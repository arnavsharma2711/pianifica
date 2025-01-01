import React from 'react';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-8">Sorry, the page you are looking for does not exist.</p>
      <Link href="/">
        <button type='button' className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go to Home</button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
