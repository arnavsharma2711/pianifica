import { CustomError } from "../lib/error/custom.error";
import {
  createMailer,
  deleteMailer,
  getMailerById,
  getMailerByName,
  getMailers,
  updateMailer,
} from "../model/mailer-model";
import sendMail from "../utils/mailer";

export const createNewMailer = async ({
  title,
  subject,
  content,
  variables,
}: {
  title: string;
  subject: string;
  content: string;
  variables?: Record<string, string>;
}) => {
  const existingMailer = await getExistingMailer({ title });

  if (existingMailer) {
    throw new CustomError(
      400,
      "Mailer already exists!",
      "Mailer with same title already exists."
    );
  }
  const mailer = await createMailer({ title, subject, content, variables });

  return mailer;
};

export const getExistingMailers = async () => {
  const mailers = await getMailers();

  return mailers;
};

export const getExistingMailer = async ({
  id,
  title,
}: {
  id?: number;
  title?: string;
}) => {
  let mailer = null;
  if (id) {
    mailer = await getMailerById({ id });
  } else if (title) {
    mailer = await getMailerByName({ title });
  }
  return mailer;
};

export const updateExistingMailer = async ({
  id,
  title,
  subject,
  content,
  variables = {},
}: {
  id: number;
  title: string;
  subject: string;
  content: string;
  variables?: Record<string, string>;
}) => {
  const existingMailer = await getExistingMailer({ id });
  if (!existingMailer) {
    throw new CustomError(
      400,
      "Mailer not found!",
      "Mailer with the given ID does not exist."
    );
  }

  const mailerWithSameName = await getExistingMailer({ title });
  if (mailerWithSameName && mailerWithSameName.id !== id) {
    throw new CustomError(
      400,
      "Mailer already exists!",
      "Mailer with same title already exists."
    );
  }

  const mailer = await updateMailer({ id, title, subject, content, variables });

  return mailer;
};

export const deleteExistingMailer = async ({ id }: { id: number }) => {
  const existingMailer = await getExistingMailer({ id });
  if (!existingMailer) {
    throw new CustomError(
      400,
      "Mailer not found!",
      "Mailer with the given ID does not exist."
    );
  }

  await deleteMailer({ id });
};

const replaceVariables = (
  content: string,
  variables: Record<string, string>
) => {
  let replacedContent = content;
  for (const [key, value] of Object.entries(variables)) {
    console.log("Replacing:", key, value);
    replacedContent = replacedContent.replace(new RegExp(`${key}`, "g"), value);
  }
  return replacedContent;
};

export const generateMail = async ({
  mailerId,
  receiverMail,
  variables = {},
}: {
  mailerId: number;
  receiverMail: string;
  variables?: Record<string, string>;
}) => {
  const existingMailer = await getExistingMailer({ id: mailerId });
  if (!existingMailer) {
    throw new CustomError(
      400,
      "Mailer not found!",
      "Mailer with the given ID does not exist."
    );
  }
  const defaultVariables =
    (existingMailer.variables as Record<string, string>) || {};
  for (const [key, value] of Object.entries(defaultVariables)) {
    console.log("Setting default:", key, value, variables[key]);
    if (variables[key]) {
      defaultVariables[key] = variables[key];
    }
  }

  const content = replaceVariables(existingMailer.content, defaultVariables);
  const subject = replaceVariables(existingMailer.subject, defaultVariables);

  const response = await sendMail(receiverMail, subject, content);
  return response;
};
