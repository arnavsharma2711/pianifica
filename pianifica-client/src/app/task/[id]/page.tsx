'use client';

import type { Comment } from "@/interface";
import { useCreateCommentMutation, useGetCurrentUserQuery, useGetTaskQuery } from "@/state/api";
import { Priority, Status } from "@/enum";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SendHorizonal } from "lucide-react";
import Loading from "@/components/Loading";
import StatusTag from "@/components/StatusTag";
import PriorityTag from "@/components/PriorityTag";
import Breadcrumb from "@/components/Breadcrumb";
import Header from "@/components/Header";

type Props = {
  params: Promise<{ id: string }>;
};

const AddComponent = ({ taskId }: { taskId: number }) => {
  const { data: currentUser } = useGetCurrentUserQuery();
  const [text, setText] = useState("");

  const [createComment] = useCreateCommentMutation();
  const handleAddComment = () => {
    if (text === "") return;
    createComment({ taskId: Number(taskId), text });
    setText("");
  }

  return (
    <div className="p-2 border dark:border-zinc-800 rounded-lg">
      <div className="flex flex-row gap-4 items-center">
        <div className="h-10 w-10 overflow-hidden rounded-full flex items-center justify-center">
          <Image
            src={currentUser?.data?.profilePictureUrl || "/default-profile-picture.webp"}
            alt={currentUser?.data?.username || "Profile Pic"}
            width={100}
            height={100}
            className="rounded-full" />
        </div>
        <div className="flex flex-row w-full items-center">
          <input className="h-full w-full p-2 rounded-l border-y border-l dark:border-zinc-800" type="text" placeholder="Add a comment..." onChange={(e) => setText(e.target.value)} />
          <button disabled={!text} type="button" className={`h-[30.5px] px-4 rounded-r-lg ${text === "" ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} bg-blue-500 whitespace-nowrap text-white`} onClick={handleAddComment}>
            <SendHorizonal size={20} />
          </button>
        </div>

      </div>

    </div>
  );
}
const CommentComponent = ({ comment }: { comment: Comment }) => {
  return (
    <div className="p-2 border dark:border-zinc-800 rounded-lg">
      <div className="flex flex-row gap-4">
        <div className="h-10 w-10 overflow-hidden rounded-full flex items-center justify-center">
          <Image
            src={comment.user?.profilePictureUrl || "/default-profile-picture.webp"}
            alt={comment.user?.username || "Profile Pic"}
            width={100}
            height={100}
            className="rounded-full" />
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex items-center justify-between">
            <strong>
              {comment.user?.firstName} {comment.user?.lastName}
            </strong>
            <span className="whitespace-nowrap text-gray-600">
              {new Date(comment.updatedAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}
            </span>
          </div>
          <div>
            {comment.text}
          </div>
        </div>

      </div>

    </div>
  )
}

const KeyValue = ({ keyName, value }: { keyName: React.ReactNode, value: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-1">
      <strong>{keyName}:</strong> {value}
    </div>
  )
}

const TaskPage = ({ params }: Props) => {
  const [id, setId] = useState<string | null>(null);

  const { data: task, isLoading } = useGetTaskQuery({ taskId: id ? Number(id) : 0 }, { skip: id === null });

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  if (!id || isLoading) {
    return <Loading />;
  }
  return (
    <>
      <Breadcrumb
        links={[
          {
            value: task?.data.project?.name || "Projects",
            link: `/project/${task?.data.project?.id}`,
          },
          { value: "Tasks", link: "/tasks", disable: true },
          { value: task?.data?.title || "Task", link: `/task/${id}` },
        ]}
      />
      <div className="pt-2 px-8">
        <div className="space-y-4">
          <Header name={task?.data.title || "Task"} />
          <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-10">
            <div className="flex flex-col w-full gap-10">
              <div className="flex flex-col gap-1">
                <KeyValue keyName={"Description"} value={task?.data.description} />
              </div>
              {task?.data?.attachments && task?.data?.attachments.length > 0 && (
                <div className="max-w-xl border-2 dark:border-zinc-800 rounded-lg">
                  <Image
                    src={task.data?.attachments[0].fileUrl || "/default-attachment.webp"}
                    alt={task.data?.attachments[0].fileName}
                    width={400}
                    height={200}
                    className="h-auto w-full rounded-t-md"
                  />
                </div>
              )}
              <div className="mt-6">
                <strong>Comments:</strong>
                <ul className="space-y-2 mb-2">
                  {task?.data.comments?.map(comment => (
                    <li key={comment.id}>
                      <CommentComponent comment={comment} />
                    </li>
                  ))}
                </ul>
                <AddComponent taskId={Number(id)} />
              </div>
            </div>
            <div className="border-2 dark:border-zinc-800 w-full md:w-96 flex justify-between flex-col gap-4 p-2 rounded-lg whitespace-nowrap">
              <KeyValue keyName={"Author"} value={
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 overflow-hidden rounded-full flex items-center justify-center">
                    <Image
                      src={task?.data?.author?.profilePictureUrl || "/default-profile-picture.webp"}
                      alt={task?.data?.author?.username || "Profile Pic"}
                      width={100}
                      height={100}
                      className="rounded-full" />
                  </div>
                  {task?.data.author?.firstName} {task?.data.author?.lastName}
                </div>
              } />
              <KeyValue keyName={"Assignee"} value={
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 overflow-hidden rounded-full flex items-center justify-center">
                    <Image
                      src={task?.data?.assignee?.profilePictureUrl || "/default-profile-picture.webp"}
                      alt={task?.data?.assignee?.username || "Profile Pic"}
                      width={100}
                      height={100}
                      className="rounded-full" />
                  </div>
                  {task?.data.assignee?.firstName} {task?.data.assignee?.lastName}
                </div>
              } />
              <KeyValue keyName={"Status"} value={<StatusTag status={task?.data.status || Status.TODO} />} />
              <KeyValue keyName={"Priority"} value={<PriorityTag priority={task?.data.priority || Priority.BACKLOG} />} />
              <KeyValue keyName={"Start Date"} value={task?.data.startDate ? new Date(task.data.startDate).toLocaleDateString() : "N/A"} />
              <KeyValue keyName={"Due Date"} value={task?.data.dueDate ? new Date(task.data.dueDate).toLocaleDateString() : "N/A"} />
              <KeyValue keyName={"Points"} value={task?.data.points} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskPage;