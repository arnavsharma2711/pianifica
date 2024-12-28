import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

const Breadcrumb = ({ links }: { links: { value: string; link: string; disable?: boolean }[] }) => {
  return (
    <nav className="flex p-4 whitespace-nowrap overflow-x-auto" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <Home size={15} />
            Home
          </Link>
        </li>
        {links.map((link) => (
          <li key={link.value} className="inline-flex items-center">
            <ChevronRight size={15} className="text-gray-400 dark:text-gray-400" />
            {link?.disable ? (
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{link.value}</span>
            ) : (
              <Link href={link.link} className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                {link.value}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};


export default Breadcrumb;
