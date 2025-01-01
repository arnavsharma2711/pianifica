"use client";

import type { Task } from "@/interface";
import { AlarmClock, CalendarDays, ChevronDown, ChevronUp, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { Priority, Status } from "@/enum";
import StatusTag from "../StatusTag";
import PriorityTag from "../PriorityTag";
import UserCard from "./UserCard";
import Link from "next/link";

type Props = {
  task: Task;
  size?: "sm" | "md" | "lg";
};

const TaskCard = ({ task, size = "lg" }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {
        size === "lg" &&
        (
          <div className="mb-3 rounded-lg bg-white p-2 shadow-md dark:bg-dark-secondary">
            <div
              className="w-full flex flex-row items-center justify-between py-2 gap-2 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              onKeyUp={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setIsOpen(!isOpen);
                }
              }}>
              <div className="flex gap-3 items-center text-xl font-bold">
                {task.title}
                <StatusTag status={task.status || Status.TODO} />
                <Link href={`/task/${task.id}`}>
                  <LinkIcon size={15} />
                </Link>
              </div>
              {isOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
            {isOpen && (<div className="flex flex-col gap-2 p-2 my-2 border-t-2 dark:border-zinc-800">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <PriorityTag priority={task.priority || Priority.LOW} />

                    <div className="w-full flex items-center gap-2">
                      <div className=" flex items-center gap-2">
                        <CalendarDays />
                        {task.startDate && (
                          <span>{new Date(task.startDate).toDateString()}</span>
                        )}
                      </div>
                      {""}
                      <div className="flex items-center gap-2">
                        <AlarmClock />{task.dueDate && (
                          <span>{new Date(task.dueDate).toDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    {task.attachments && task.attachments.length > 0 && (
                      <Image
                        src={task.attachments[0].fileUrl || "/default-attachment.webp"}
                        alt={task.attachments[0].fileName}
                        width={400}
                        height={200}
                        className="h-auto w-full rounded-t-md"
                      />
                    )}
                  </div>
                  <p>{task.description}</p>
                </div>
                <div className="flex items-start gap-10">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">
                      Author:
                    </span>
                    {task.author && <UserCard user={task.author} />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">
                      Assignee:
                    </span>
                    {task.assignee && <UserCard user={task.assignee} />}
                  </div>
                </div>
              </div>


            </div>)}
          </div>
        )
      }
      {
        size === "md" &&
        (
          <Link href={`/task/${task.id}`} className={"flex flex-col w-96 p-4 bg-white dark:bg-dark-secondary border dark:border-zinc-800 rounded-md items-start gap-4"}>
            <div className="w-full h-10 flex items-center justify-between">
              <div className="font-bold">
                {task.title}
              </div>
              <StatusTag status={task.status || Status.TODO} />
            </div>
            <PriorityTag priority={task.priority || Priority.LOW} />
            <div className="max-h-10 overflow-hidden">
              {task.description && (
                <span>
                  {task.description.length > 80 ? `${task.description.substring(0, 100)}...` : task.description}
                </span>
              )}
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <div className=" flex items-center gap-2">
                <CalendarDays />
                {task.startDate && (
                  <span>{new Date(task.startDate).toDateString()}</span>
                )}
              </div>
              {""}
              <div className="flex items-center gap-2">
                <AlarmClock />{task.dueDate && (
                  <span>{new Date(task.dueDate).toDateString()}</span>
                )}
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  Author:
                </span>
                {task.author && <UserCard user={task.author} />}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  Assignee:
                </span>
                {task.assignee && <UserCard user={task.assignee} />}
              </div>
            </div>
          </Link>
        )
      }
      {
        size === "sm" &&
        (
          <Link href={`/task/${task.id}`} className={"flex flex-row w-max items-center gap-2"}>
            <div className="flex flex-row items-center gap-1">
              <span className="flex items-center gap-1 font-bold">
                {task.title} {task.status && <StatusTag status={task.status} />}
              </span>
            </div>
          </Link>
        )
      }
    </>

  );
};

export default TaskCard;
