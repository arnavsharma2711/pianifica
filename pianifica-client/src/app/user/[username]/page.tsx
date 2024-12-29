'use client';

import Breadcrumb from "@/components/Breadcrumb";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetCurrentUserQuery, useGetUserQuery } from "@/state/api";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  params: Promise<{ username: string }>;
};

const UserPage = ({ params }: Props) => {
  const [username, setUsername] = useState<string>("");

  const { data: user, isLoading } = useGetUserQuery({ username }, { skip: username === "" });
  const { data: currentUser } = useGetCurrentUserQuery();

  useEffect(() => {
    params.then((resolvedParams) => {
      setUsername(resolvedParams.username);
    });
  }, [params]);

  if (!username || isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Breadcrumb
        links={[
          {
            value: "Users",
            link: "/users",
          },
          {
            value: `${user?.data?.firstName} ${user?.data?.lastName}` || "User",
            link: `/user/${username}`,
          }
        ]}
      />
      <div className="pt-2 px-8" >
        <Header name={`${user?.data?.firstName} ${user?.data?.lastName}`} />
        <div>
          {currentUser?.data?.username === username && ("This is you!")}
        </div>
        <div className="w-full flex justify-center">
          <div className="w-full flex flex-col  items-center justify-center">
            <Image
              src={user?.data?.profilePictureUrl || "/user.png"}
              alt="User"
              width={400}
              height={400}
              className="rounded-full size-60 object-cover"
            />
            <div>
              Team part of
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center">
            <div>
              Task Performed
            </div>
            <div>
              Projects assigneed
            </div>
            <div>
              Team Member collaborator
            </div>
          </div>
        </div>


      </div >
    </>
  );
};

export default UserPage;