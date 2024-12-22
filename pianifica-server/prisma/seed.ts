import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

async function createData(model: any, data: object) {
  try {
    return await model.create({ data });
  } catch (error) {
    console.error(`Error seeding data for ${model}:`, error);
  }
}

async function deleteAllData() {
  const modelNames = [
    { name: "Comment", hasIdSequence: true },
    { name: "Attachment", hasIdSequence: true },
    { name: "Task", hasIdSequence: true },
    { name: "UserTeam", hasIdSequence: false },
    { name: "ProjectTeam", hasIdSequence: false },
    { name: "Team", hasIdSequence: true },
    { name: "Project", hasIdSequence: true },
    { name: "UserRole", hasIdSequence: false },
    { name: "Role", hasIdSequence: true },
    { name: "User", hasIdSequence: true },
    { name: "Organization", hasIdSequence: true },
  ];
  for (const modelName of modelNames) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${modelName.name}";`);
      if (modelName.hasIdSequence) {
        await prisma.$executeRawUnsafe(
          `ALTER SEQUENCE "${modelName.name}_id_seq" RESTART WITH 1;`
        );
      }
      console.log(
        `Cleared data from ${modelName.name}${
          modelName.hasIdSequence ? " and reset id sequence." : "."
        }`
      );
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
const UserTeamModel: any = prisma["UserTeam" as keyof typeof prisma];
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
    password: bcrypt.hashSync("password", 10),
    profilePictureUrl:
      "https://utfs.io/f/DTNeoJKzjEnaxZ4f6n5XimWVey0lE3NdSHzKBu7j1TqMGt8h",
  });

  const orgUsers: { [key: number]: number[] } = {};
  const profilePictureUrls = [
    "https://utfs.io/f/DTNeoJKzjEnaRihbJz3aCjEzvNgrPGB4mb8W5xeft0FlohIX",
    "https://utfs.io/f/DTNeoJKzjEnaJ5WayRrAXg1DAUZLGCmHWjufkVEPeihNpq82",
    "https://utfs.io/f/DTNeoJKzjEna6wD48rC0vL9Bt4z8325eCWkx7lPHRdfgbNiA",
    "https://utfs.io/f/DTNeoJKzjEnaMyglhtemF1taoGCZVSjIeW32fJhlAXvDQxR8",
    "https://utfs.io/f/DTNeoJKzjEnaotvQyQYM4TZMJf9XKhidyF3wUzHOuEjVeIvn",
    "https://utfs.io/f/DTNeoJKzjEnaISOQB0GLQ4C5F7TaNXiWh0ovRnG9Y12UmlDA",
    "https://utfs.io/f/DTNeoJKzjEnalqsi3uSnJ0SLwdF96srQoPKI7WZbVU2ytB43",
    "https://utfs.io/f/DTNeoJKzjEnatOVVoKJj8bxod69YOukKVy2J1WsrlP53AvNa",
    "https://utfs.io/f/DTNeoJKzjEna1NlcWONVDJ3zw0rmSpLOntsMKycBGeq7gxj4",
    "https://utfs.io/f/DTNeoJKzjEnac56saE9QmTzhxip0k92jHKMDAlcXEty3GWeI",
    "https://utfs.io/f/DTNeoJKzjEnak8emcLREh8TMvGngWPt0awIY2UeBmsZulSA1",
    "https://utfs.io/f/DTNeoJKzjEnaWlj1HQI7rsJnDMbI9CkYQ2qdpzTjlh4g0XBK",
    "https://utfs.io/f/DTNeoJKzjEna825O5a6TulJYX23PrWiGnjsbSZVxEfaqNdkK",
  ];
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
        password: bcrypt.hashSync("password", 10),
        profilePictureUrl:
          profilePictureUrls[
            Math.floor(Math.random() * profilePictureUrls.length)
          ],
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
      name: "SUPER_ADMIN",
      description: "The user has access to all privileges",
    },
    {
      name: "ORG_ADMIN",
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
      organizationId: user.organizationId,
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
      const orgUsers = await UserModel.findMany({
        where: { organizationId: user.organizationId },
      });
      for (const user of orgUsers) {
        await createData(UserTeamModel, {
          userId: user.id,
          teamId: createdTeam.id,
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

  const attachment_urls = [
    "https://utfs.io/f/DTNeoJKzjEnawijxNM8j5DGBeKt9lYSrJIpksugaTAo0LqdE",
    "https://utfs.io/f/DTNeoJKzjEnaIe2puIGLQ4C5F7TaNXiWh0ovRnG9Y12UmlDA",
    "https://utfs.io/f/DTNeoJKzjEnaDWXWw1KzjEna2SxlquGrbfI7O4PhkNtBCwsU",
    "https://utfs.io/f/DTNeoJKzjEnaejeoqRtgNqYiHlV4n17kbRIhLEjTZAQXMJm6",
    "https://utfs.io/f/DTNeoJKzjEna1dtjORVDJ3zw0rmSpLOntsMKycBGeq7gxj4C",
    "https://utfs.io/f/DTNeoJKzjEnaiDnDvuLNEnUhA9J861dKXyM3jlVzDowvRb7S",
    "https://utfs.io/f/DTNeoJKzjEnaXkfNDgOwk9MNs38V0oP1iBTLrcG4JOmzFAqY",
    "https://utfs.io/f/DTNeoJKzjEnal5LxcYSnJ0SLwdF96srQoPKI7WZbVU2ytB43",
    "https://utfs.io/f/DTNeoJKzjEnamjRcrf41nb8lA75dgNOXqyVer4mtSoP3926a",
    "https://utfs.io/f/DTNeoJKzjEnag8cDkXazZFS7PKJ1xtG9n5iLY6H4cfdyEAX3",
  ];

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
            fileUrl:
              attachment_urls[
                Math.floor(Math.random() * attachment_urls.length)
              ],
            fileName: faker.system.commonFileName("webp"),
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
