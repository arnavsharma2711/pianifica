import type { Priority, Status } from "@/enum";

export interface User {
  id?: number;
  organizationId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string;
  role?: string;
}

export interface Team {
  id?: number;
  name: string;
  teamManager?: User;
  teamLead?: User;
}

export interface Attachment {
  id: number;
  fileUrl: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}

export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;

  user?: User;
}
export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorId?: number;
  assigneeId?: number;
  comments_count?: number;

  project?: Project;
  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface Search {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}
