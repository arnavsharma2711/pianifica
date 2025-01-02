import prisma from "../utils/prisma";

export const createMailer = async ({
  title,
  subject,
  content,
  variables = {},
}: {
  title: string;
  subject: string;
  content: string;
  variables?: Record<string, string>;
}) => {
  return await prisma.mailer.create({
    data: {
      title,
      subject,
      content,
      variables,
    },
  });
};

export const getMailers = async () => {
  return await prisma.mailer.findMany();
};

export const getMailerById = async ({ id }: { id: number }) => {
  return await prisma.mailer.findFirst({
    where: { id },
  });
};

export const getMailerByName = async ({ title }: { title: string }) => {
  return await prisma.mailer.findFirst({
    where: { title },
  });
};

export const updateMailer = async ({
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
  return await prisma.mailer.update({
    where: { id },
    data: { title, subject, content, variables },
  });
};

export const deleteMailer = async ({ id }: { id: number }) => {
  return await prisma.mailer.delete({
    where: { id },
  });
};
