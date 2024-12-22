import { CustomError } from "../lib/error/custom.error";
import {
  createOrganization,
  deleteOrganization,
  getOrganizationById,
  getOrganizationByName,
  getOrganizations,
  updateOrganization,
} from "../model/organization-model";

export const createNewOrganization = async ({ name }: { name: string }) => {
  const existingOrganization = await getExistingOrganization({ name });

  if (existingOrganization) {
    throw new CustomError(
      400,
      "Organization already exists!",
      "Organization with same name already exists."
    );
  }

  const organization = await createOrganization({ name });

  return organization;
};

export const getExistingOrganizations = async () => {
  const organizations = await getOrganizations();

  return organizations;
};

export const getExistingOrganization = async ({
  id,
  name,
}: {
  id?: number;
  name?: string;
}) => {
  let organization = null;
  if (id) {
    organization = await getOrganizationById(id);
  } else if (name) {
    organization = await getOrganizationByName(name);
  }
  return organization;
};

export const updateExistingOrganization = async ({
  id,
  name,
}: {
  id: number;
  name: string;
}) => {
  const existingOrganization = await getExistingOrganization({ id });
  if (!existingOrganization) {
    throw new CustomError(
      400,
      "Organization not found!",
      "Organization with the given ID does not exist."
    );
  }

  const organizationWithSameName = await getExistingOrganization({ name });
  if (organizationWithSameName && organizationWithSameName.id !== id) {
    throw new CustomError(
      400,
      "Organization already exists!",
      "Organization with same name already exists."
    );
  }

  const organization = await updateOrganization({ id, name });

  return organization;
};

export const deleteExistingOrganization = async ({ id }: { id: number }) => {
  const existingOrganization = await getExistingOrganization({ id });
  if (!existingOrganization) {
    throw new CustomError(
      400,
      "Organization not found!",
      "Organization with the given ID does not exist."
    );
  }

  await deleteOrganization({ id });
};
