import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { faker } from "@faker-js/faker";

async function createData(model: any, data: object) {
  try {
    return await model.create({ data });
  } catch (error) {
    console.error(`Error seeding data for ${model}:`, error);
  }
}

async function deleteAllData() {
  const modelNames = [
    "Comment",
    "Attachment",
    "Task",
    "ProjectTeam",
    "Team",
    "Project",
    "UserRole",
    "Role",
    "User",
    "Organization",
  ];
  for (const modelName of modelNames) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${modelName}";`);
      await prisma.$executeRawUnsafe(
        `ALTER SEQUENCE "${modelName}_id_seq" RESTART WITH 1;`
      );
      console.log(`Cleared data from ${modelName} and reset ID sequence`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

async function main() {
  await deleteAllData();

  await createOrganization();
  const orgUsers = await createUser();
  await createRole();
  const admins = await createUserRole();
  await createProject();
  await createTeam(admins);
  await createTask(admins, orgUsers);
}

const OrganizationModel: any = prisma["Organization" as keyof typeof prisma];
const UserModel: any = prisma["User" as keyof typeof prisma];
const RoleModel: any = prisma["Role" as keyof typeof prisma];
const UserRoleModel: any = prisma["UserRole" as keyof typeof prisma];
const ProjectModel: any = prisma["Project" as keyof typeof prisma];
const TeamModel: any = prisma["Team" as keyof typeof prisma];
const ProjectTeamModel: any = prisma["ProjectTeam" as keyof typeof prisma];
const TaskModel: any = prisma["Task" as keyof typeof prisma];
const AttachmentModel: any = prisma["Attachment" as keyof typeof prisma];
const CommentModel: any = prisma["Comment" as keyof typeof prisma];

async function createOrganization() {
  console.log("Creating organizations...");

  await createData(OrganizationModel, { name: "Pianifica" });

  const organizationData = Array.from({ length: 5 }, () => ({
    name: faker.company.name(),
  }));

  for (const data of organizationData) {
    await createData(OrganizationModel, data);
  }
  console.log("Organizations created successfully!");
}

async function createUser() {
  const organizations = await OrganizationModel.findMany();
  console.log("Creating users...");

  await createData(UserModel, {
    organizationId: 1,
    firstName: "Arnav",
    lastName: "Sharma",
    username: "arnavsharma2711",
    email: "arnavsharma2711@gmail.com",
    password: "password",
    profilePictureUrl: faker.image.avatar(),
  });

  const orgUsers: { [key: number]: number[] } = {};

  for (const organization of organizations) {
    const userData = Array.from({ length: 5 }, () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const username = faker.internet.username({
        firstName: firstName,
        lastName: lastName,
      });
      const email = faker.internet.email({
        firstName: firstName,
        lastName: lastName,
      });
      return {
        organizationId: organization.id,
        firstName: firstName,
        lastName: lastName,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: faker.internet.password(),
        profilePictureUrl: faker.image.avatar(),
      };
    });

    for (const data of userData) {
      if (!orgUsers[organization.id]) {
        orgUsers[organization.id] = [];
      }
      const createdUser = await createData(UserModel, data);
      orgUsers[organization.id].push(createdUser.id);
    }
  }
  console.log("Users created successfully!");

  return orgUsers;
}

async function createRole() {
  console.log("Creating roles...");
  const roleData = [
    {
      name: "Super Admin",
      description: "The user has access to all privileges",
    },
    {
      name: "Organization Admin",
      description:
        "The user has access to all privileges within the organization",
    },
  ];

  for (const data of roleData) {
    await createData(RoleModel, data);
  }
  console.log("Roles created successfully!");
}

async function createUserRole() {
  console.log("Creating user roles...");

  await createData(UserRoleModel, {
    userId: 1,
    roleId: 1,
  });

  const users = await UserModel.findMany({
    distinct: ["organizationId"],
  });

  const admins: { [key: number]: number } = {};

  for (const user of users) {
    const organizationId = user.organizationId;
    const userId = user.id;
    admins[organizationId] = userId;
    const userRole = {
      userId: userId,
      roleId: 2,
    };
    await createData(UserRoleModel, userRole);
  }

  console.log("User roles created successfully!");

  return admins;
}

async function createProject() {
  console.log("Creating projects...");

  const organizations = await OrganizationModel.findMany({
    where: { id: { not: 1 } },
  });

  for (const organization of organizations) {
    const projects = Array.from({ length: 5 }, () => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      organizationId: organization.id,
      startDate: faker.date.past(),
      endDate: faker.date.future(),
    }));

    for (const project of projects) {
      await createData(ProjectModel, project);
    }
  }

  console.log("Projects created successfully!");
}

async function createTeam(admins: { [key: number]: number }) {
  console.log("Creating teams and project teams...");

  const users = await UserModel.findMany({
    distinct: ["organizationId"],
    where: {
      organizationId: {
        not: 1,
      },
      id: {
        notIn: Object.values(admins),
      },
    },
  });

  for (const user of users) {
    const teams = Array.from({ length: 1 }, () => ({
      name: faker.commerce.department(),
      managerId: admins[user.organizationId],
      leadId: user.id,
    }));

    for (const team of teams) {
      const createdTeam = await createData(TeamModel, team);
      const projects = await ProjectModel.findMany({
        where: { organizationId: user.organizationId },
      });
      for (const project of projects) {
        await createData(ProjectTeamModel, {
          teamId: createdTeam.id,
          projectId: project.id,
        });
      }
    }
  }

  console.log("Teams and project teams created successfully!");
}

async function createTask(
  admins: { [key: number]: number },
  orgUsers: { [key: number]: number[] }
) {
  enum Status {
    BLOCKED = "BLOCKED",
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    UNDER_REVIEW = "UNDER_REVIEW",
    RELEASE_READY = "RELEASE_READY",
    COMPLETED = "COMPLETED",
  }

  enum Priority {
    BACKLOG = "BACKLOG",
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
  }

  function getRandomEnumValue<T extends object>(enumObj: T): T[keyof T] {
    const enumValues = Object.values(enumObj) as T[keyof T][];
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
  }

  console.log("Creating tasks, comments and attachments...");

  const projects = await ProjectModel.findMany();

  for (const project of projects) {
    const tasks = [];
    for (const user of orgUsers[project.organizationId]) {
      tasks.push({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        status: getRandomEnumValue(Status),
        priority: getRandomEnumValue(Priority),
        tags: "",
        points: Math.floor(Math.random() * 5),
        projectId: project.id,
        authorId: admins[project.organizationId],
        assigneeId: user,
        startDate: faker.date.past(),
        dueDate: faker.date.future(),
      });

      for (const task of tasks) {
        const createdTask = await createData(TaskModel, task);

        const comments = Array.from(
          { length: Math.floor(Math.random() * 4) },
          () => ({
            text: faker.lorem.sentence(),
            taskId: createdTask.id,
            userId:
              orgUsers[project.organizationId][
                Math.floor(
                  Math.random() * orgUsers[project.organizationId].length
                )
              ],
          })
        );

        for (const comment of comments) {
          await createData(CommentModel, comment);
        }

        if (Math.random() < 0.1) {
          await createData(AttachmentModel, {
            taskId: createdTask.id,
            uploadedById: createdTask.authorId,
            fileUrl: faker.image.url(),
            fileName: faker.system.commonFileName("jpg"),
          });
        }
      }
    }
  }

  console.log("Tasks, comments and attachments created successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
