import controllerWrapper from "../../lib/controllerWrapper";
import { organizationSchema } from "../../lib/schema";
import {
  createNewOrganization,
  getExistingOrganizations,
  getExistingOrganization,
  deleteExistingOrganization,
  updateExistingOrganization,
} from "../../service/organization-service";
import { createOrganizationSchema, updateOrganizationSchema } from "./schema";

// POST api/organization
export const createOrganization = controllerWrapper(async (req, res) => {
  const { name } = createOrganizationSchema.parse(req.body);

  const organization = await createNewOrganization({ name });

  const organizationData = organizationSchema.parse(organization);
  res.success({
    message: "Organization created successfully.",
    data: organizationData,
  });
});

// GET api/organization
export const getOrganizations = controllerWrapper(async (req, res) => {
  const organizations = await getExistingOrganizations();

  const organizationsData = organizations.map((organization) =>
    organizationSchema.parse(organization)
  );
  res.success({
    message: "Organizations fetched successfully.",
    data: organizationsData,
  });
});

// GET api/organization/:id
export const getOrganization = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.invalid({
      message: "Invalid request.",
      error: "Organization id is required.",
    });
    return;
  }

  const organization = await getExistingOrganization({ id: Number(id) });

  if (!organization) {
    res.invalid({
      message: "Organization not found.",
      error: "Organization with provided id not found.",
    });
    return;
  }

  const organizationData = organizationSchema.parse(organization);
  res.success({
    message: "Organization fetched successfully.",
    data: organizationData,
  });
});

// PUT api/organization
export const updateOrganization = controllerWrapper(async (req, res) => {
  const { id, name } = updateOrganizationSchema.parse(req.body);

  const organization = await updateExistingOrganization({
    id: Number(id),
    name,
  });

  res.success({
    message: "Organization updated successfully.",
    data: organization,
  });
});

// DELETE api/organization/:id
export const deleteOrganization = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.invalid({
      message: "Invalid request.",
      error: "Organization id is required.",
    });
    return;
  }

  const organization = await getExistingOrganization({ id: Number(id) });

  if (!organization) {
    res.invalid({
      message: "Organization not found.",
      error: "Organization with provided id not found.",
    });
    return;
  }

  await deleteExistingOrganization({ id: Number(id) });

  res.success({
    message: "Organization deleted successfully.",
  });
});
