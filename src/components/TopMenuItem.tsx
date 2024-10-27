'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  title: string;
  path: string;
}

export const TopMenuItem = ({ title, path }: Props) => {
  const pathName = usePathname();

  return (
    <>
      <div>
        <Link href={path}>
          <p className={`${pathName === path ? 'text-vino-600 font-semibold' : 'text-black '} text-lg`}>{title}</p>
        </Link>
      </div>
    </>
  );
};
