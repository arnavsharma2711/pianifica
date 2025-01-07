'use client';

import Breadcrumb from "@/components/Breadcrumb";
import ErrorComponent from "@/components/Error";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { NotificationBox } from "@/components/NotificationContainer";
import { useGetUserNotificationsQuery, useMarkAllAsSeenMutation } from "@/state/api";
import { CheckCheck, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ToggleButton from "../../components/FormFields/toggleButton";

const NotificationsPage = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [isSeen, setIsSeen] = useState(false);

  const { data, isLoading, isError } = useGetUserNotificationsQuery({
    limit,
    page,
    unSeenOnly: isSeen,
  });

  const [markAllAsSeen] = useMarkAllAsSeenMutation();

  const handleMarkAllAsSeen = async () => {
    try {
      const response = await markAllAsSeen();
      if (response.data?.success)
        toast.success("All notifications marked as seen");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    document.title = "Notifications - Pianifica";
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <ErrorComponent message={"Failed to fetch notifications"} breadcrumbLinks={[
      {
        value: "Notifications",
        link: '/notifications',
      },
    ]} />;
  }
  return (
    <>
      <Breadcrumb
        links={[
          {
            value: "Notifications",
            link: "/notifications",
          }
        ]}
      />
      <div className="pt-2 px-8" >
        <Header name="Notifications"
          buttonComponent={
            <div className="flex items-center gap-4">
              <ToggleButton isChecked={isSeen} handleToggle={() => setIsSeen(!isSeen)} message="Only Unseen" />
              <button
                type="button"
                className="flex items-center gap-2 rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-700"
                onClick={() => handleMarkAllAsSeen()}
              >
                <CheckCheck size={18} /> Mark all as seen
              </button>
            </div>
          }
        />
        {data?.data && <NotificationBox notifications={data?.data} />}
        <div className="flex items-center justify-center gap-10 p-4">
          <div className="relative flex items-center space-x-2 border overflow-hidden rounded-lg ">
            <select
              id="rowsPerPage"
              value={limit}

              className="appearance-none bg-transparent pl-2 pr-6 h-10 rounded-lg dark:text-white focus:outline-none"
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="30">30 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <span className="text-gray-500"><ChevronDown /></span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border rounded-lg pl-2  overflow-hidden">
            <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
              Showing
              <span className="font-bold">
                {`${(page - 1) * limit + 1} - ${Math.min(page * limit, data?.total_count || 0)}`}
              </span>
              of {data?.total_count || 0}
            </div>
            <div className="border-l">
              <button
                type="button"
                className="p-1 hover:hover:bg-gray-300 dark:hover:bg-zinc-700 disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                aria-label="Previous Page"
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-300 dark:hover:bg-zinc-700 disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={page === (Math.ceil(data?.total_count || 0 / limit))}
                aria-label="Next Page"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default NotificationsPage;
