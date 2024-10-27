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

const generateMenuItems = (user?: User) => {
  const defaultMenu = [
    {
      title: 'Inicio',
      path: '/',
    },
    {
      title: 'Productos',
      path: '/products',
    },
  ];

  if (user?.id) {
    defaultMenu.push({
      title: 'Reservas',
      path: '/bookings',
    });
  }

  return defaultMenu;
};

export const TopMenu = async () => {
  const cartItemsCount = 0;
  const user: User | undefined = await getUserSession();
  const menuItems: MenuItem[] = generateMenuItems(user);

  return (
    <>
      <div className="grid grid-cols-10">
        <div className="col-span-1 h-fit lg:mt-2.5">
          <Link hidden href="/" className="lg:block">
            <Image src="/images/logo/logo.png" alt="Anymal Style" width={120} height={120} />
          </Link>
          <button className="-mr-2 h-16 w-12 border-r lg:hidden">
            <CiMenuBurger size={30} />
          </button>
        </div>
        <div className="sticky top-0 z-10 col-span-9 h-fit border-b lg:mt-2.5 lg:pb-5">
          <div className="mt-0 flex items-center justify-between space-x-4 px-6">
            <div className="flex items-center justify-start">
              <div className="ml-12 flex justify-start gap-8">
                {menuItems.map((item, index) => (
                  <TopMenuItem key={index} {...item} />
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <SearchProduct />

              <Link
                href={'#'}
                className="flex h-10 items-center justify-center rounded-xl border bg-gray-100 p-2 focus:bg-gray-100 active:bg-gray-200"
              >
                {cartItemsCount > 0 && <span className="mr-2 text-sm font-bold text-blue-600">{cartItemsCount}</span>}
                <CiShoppingBasket size={25} />
              </Link>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border bg-gray-100 focus:bg-gray-100 active:bg-gray-200">
                <CiBellOn size={25} />
              </button>

              <Link
                data-testid={user ? 'user-link' : 'login-link'}
                href={'/signin'}
                className="flex h-10 w-10 items-center justify-center rounded-xl border bg-gray-100 focus:bg-gray-100 active:bg-gray-200"
              >
                {user ? <FiUserCheck size={25} /> : <CiLogin size={25} />}
              </Link>
              <div className="ml-2">
                <p>
                  {user && `Hola ${user.name || 'Usuario'}!`}
                  <span className="ml-1 text-xs font-bold text-vino-700">{user?.role}</span>
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
