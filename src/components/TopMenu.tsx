import Link from 'next/link';
import { CiBellOn, CiLogin, CiMenuBurger, CiShoppingBasket } from 'react-icons/ci';
import { FiUserCheck } from 'react-icons/fi';
import { LogoutButton } from './auth/LogoutButton';
import { getUserSession } from '@/helpers/auth/getUserSession';
import { User } from 'next-auth';
import { TopMenuItem } from './TopMenuItem';
import { SearchProduct } from './products';
import Image from 'next/image';

interface MenuItem {
  title: string;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    title: 'Inicio',
    path: '/',
  },
  {
    title: 'Productos',
    path: '/products',
  },
];

export const TopMenu = async () => {
  const cartItemsCount = 0;
  const user: User | undefined = await getUserSession();

  return (
    <>
      <div className="grid grid-cols-10">
        <div className="col-span-1 h-fit lg:mt-2.5">
          <Link hidden href="/" className="lg:block">
            <Image src="/images/logo/logo.png" alt="Anymal Style" width={120} height={120} />
          </Link>
          <button className="w-12 h-16 -mr-2 border-r lg:hidden">
            <CiMenuBurger size={30} />
          </button>
        </div>
        <div className="col-span-9 sticky z-10 top-0 h-fit border-b lg:mt-2.5 lg:pb-5">
          <div className="px-6 mt-0 flex items-center justify-between space-x-4">
            <div className="flex justify-start items-center">
              <div className="flex justify-start gap-8 ml-12">
                {menuItems.map((item, index) => (
                  <TopMenuItem key={index} {...item} />
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <SearchProduct />

              <Link
                href={'#'}
                className="p-2 flex items-center justify-center h-10 rounded-xl border bg-gray-100 focus:bg-gray-100 active:bg-gray-200"
              >
                {cartItemsCount > 0 && <span className="text-sm mr-2 text-blue-600 font-bold">{cartItemsCount}</span>}
                <CiShoppingBasket size={25} />
              </Link>
              <button className="flex items-center justify-center w-10 h-10 rounded-xl border bg-gray-100 focus:bg-gray-100 active:bg-gray-200">
                <CiBellOn size={25} />
              </button>

              <Link
                data-testid={user ? 'user-link' : 'login-link'}
                href={'/signin'}
                className="flex items-center justify-center w-10 h-10 rounded-xl border bg-gray-100 focus:bg-gray-100 active:bg-gray-200"
              >
                {user ? <FiUserCheck size={25} /> : <CiLogin size={25} />}
              </Link>
              <div className="ml-2">
                <p>
                  {user && `Hola ${user.name || 'Usuario'}!`}
                  <span className="text-vino-700 font-bold text-xs ml-1">{user?.role}</span>
                </p>
                <p>{user && <LogoutButton />}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
