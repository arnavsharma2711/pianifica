import controllerWrapper from "../../lib/controllerWrapper";
import { mailerSchema } from "../../lib/schema";
import {
  createNewMailer,
  getExistingMailers,
  getExistingMailer,
  deleteExistingMailer,
  updateExistingMailer,
  generateMail,
} from "../../service/mailer-service";
import { createMailerSchema, previewMailerSchema } from "./schema";

// POST api/mailer
export const createMailer = controllerWrapper(async (req, res) => {
  const { title, subject, content, variables } = createMailerSchema.parse(
    req.body
  );

  const mailer = await createNewMailer({ title, subject, content, variables });

  const mailerData = mailerSchema.parse(mailer);
  res.success({
    message: "Mailer created successfully.",
    data: mailerData,
  });
});

// GET api/mailers
export const getMailers = controllerWrapper(async (req, res) => {
  const mailers = await getExistingMailers();

  const mailersData = mailers.map((mailer) => mailerSchema.parse(mailer));
  res.success({
    message: "Mailers fetched successfully.",
    data: mailersData,
  });
});

// GET api/mailer/:id
export const getMailer = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.invalid({
      message: "Invalid request.",
      error: "Mailer id is required.",
    });
    return;
  }

  const mailer = await getExistingMailer({ id: Number(id) });

  if (!mailer) {
    res.invalid({
      message: "Mailer not found.",
      error: "Mailer with provided id not found.",
    });
    return;
  }

  const mailerData = mailerSchema.parse(mailer);
  res.success({
    message: "Mailer fetched successfully.",
    data: mailerData,
  });
});

// PUT api/mailer
export const updateMailer = controllerWrapper(async (req, res) => {
  const { id, title, subject, content, variables } = createMailerSchema.parse(
    req.body
  );

  const mailer = await updateExistingMailer({
    id: Number(id),
    title,
    subject,
    content,
    variables,
  });

  res.success({
    message: "Mailer updated successfully.",
    data: mailer,
  });
});

// DELETE api/mailer/:id
export const deleteMailer = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.invalid({
      message: "Invalid request.",
      error: "Mailer id is required.",
    });
    return;
  }

  const mailer = await getExistingMailer({ id: Number(id) });

  if (!mailer) {
    res.invalid({
      message: "Mailer not found.",
      error: "Mailer with provided id not found.",
    });
    return;
  }

  await deleteExistingMailer({ id: Number(id) });

  res.success({
    message: "Mailer deleted successfully.",
  });
});

// POST api/mailer/:id/preview
export const previewMailer = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const { receiverMail, variables } = previewMailerSchema.parse(req.body);
  if (!id) {
    res.invalid({
      message: "Invalid request.",
      error: "Mailer id is required.",
    });
    return;
  }

  const mailer = await getExistingMailer({ id: Number(id) });

  if (!mailer) {
    res.invalid({
      message: "Mailer not found.",
      error: "Mailer with provided id not found.",
    });
    return;
  }

  const response = await generateMail({ mailerId: Number(id), receiverMail, variables });

  res.success({
    message: "Mail preview sent successfully.",
    data: response,
  });
});
