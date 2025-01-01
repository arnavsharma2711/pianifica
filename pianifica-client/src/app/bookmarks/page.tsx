'use client';

import Breadcrumb from '@/components/Breadcrumb';
import ProjectCard from '@/components/Cards/ProjectCard';
import TaskCard from '@/components/Cards/TaskCard';
import { useGetBookmarkedProjectsQuery, useGetBookmarkedTasksQuery } from '@/state/api';
import React, { useEffect, useState } from 'react';

const BookmarkPage = () => {
  const [selectedOption, setSelectedOption] = useState<'Tasks' | 'Projects'>('Tasks');

  const handleOptionClick = (option: 'Tasks' | 'Projects') => {
    setSelectedOption(option);
  };

  const { data: taskList, isLoading: taskLoading } = useGetBookmarkedTasksQuery();
  const { data: projectList, isLoading: projectLoading } = useGetBookmarkedProjectsQuery();

  useEffect(() => {
    document.title = "My Bookmarks - Pianifica";
  }, []);

  return (
    <>
      <Breadcrumb
        links={[
          { value: "Bookmark", link: "/bookmarks" },
          { value: selectedOption, link: "/", disable: true },
        ]}
      />
      <div className='w-full h-full p-4 flex flex-col gap-4'>
        <h2 className='text-2xl font-bold'>Bookmark Items
        </h2>
        <div className='w-full flex items-center justify-start gap-4 bg-gray-100 dark:bg-zinc-800 p-4 rounded-md'>
          <div
            className={`w-48 text-center border rounded-md text-xl p-2 cursor-pointer ${selectedOption === 'Tasks' ? 'dark:border-zinc-700 bg-white dark:bg-dark-tertiary' : ' border-transparent hover:bg-gray-300 dark:hover:bg-dark-tertiary'}`}
            onClick={() => handleOptionClick('Tasks')}
            onKeyUp={(e) => e.key === 'Enter' && handleOptionClick('Tasks')}>
            Tasks
          </div>
          <div
            className={`w-48 text-center border rounded-md text-xl p-2 cursor-pointer ${selectedOption === 'Projects' ? 'dark:border-zinc-700 bg-white dark:bg-dark-tertiary' : ' border-transparent hover:bg-gray-300 dark:hover:bg-dark-tertiary'}`}
            onClick={() => handleOptionClick('Projects')}
            onKeyUp={(e) => e.key === 'Enter' && handleOptionClick('Projects')}>
            Projects
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">{selectedOption}</h2>
          {taskLoading || projectLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {selectedOption === 'Projects' && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {projectList?.data.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
              {selectedOption === 'Tasks' && (
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                  {taskList?.data.map((task) => (
                    <TaskCard key={task.id} task={task} size='md' />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>

  );
};

export default BookmarkPage;