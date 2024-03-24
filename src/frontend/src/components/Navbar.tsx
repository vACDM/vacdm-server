import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from 'primereact/button';
import { Fragment, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import logo from '../assets/cdm_logo.png';
import AuthContext from '../contexts/AuthProvider';
import DarkModeContext from '../contexts/DarkModeProvider';
import AuthService from '../services/AuthService';

// import { FrontendSettings } from '@/shared/interfaces/config.interface';
import ProfilePicture from './ProfilePicture';

import User from '@/shared/interfaces/user.interface';

interface NavItemDefinition {
  label: string;
  href: string;
  permission?: (user: User | undefined) => boolean;
  current: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function NavbarWithDropdown() {
  // const [config, setConfig] = useState<FrontendSettings>();
  const navigate = useNavigate();
  const [items, setItems] = useState<NavItemDefinition[]>([]);
  const { auth } = useContext(AuthContext);
  const { darkMode, changeDarkMode } = useContext(DarkModeContext);

  async function logout() {
    await AuthService.logout();

    window.location.reload();
  }

  const navItems: NavItemDefinition[] = [
    {
      label: 'Delivery',
      href: '/delivery',
      permission: (usr) => !!usr && !usr.banned && (usr.admin || usr.hasAtcRating),
      current: true,
    },
    {
      label: 'Airports',
      href: '/airports',
      permission: (usr) => !!usr && !usr.banned && usr.admin,
      current: false,
    },
    {
      label: 'Flow Management',
      href: '/flow-management',
      permission: (usr) => !!usr && !usr.banned && (usr.admin || usr.hasAtcRating),
      current: false,
    },
    {
      label: 'AVDGS',
      href: '/vdgs',
      permission: (usr) => !!usr && !usr.banned,
      current: false,
    },
  ];

  const redirectToVatsimAuth = () => {
    window.location.replace('/api/auth');
  };

  useEffect(() => {
    setItems(
      navItems.filter((item) =>
        (item.permission ? item.permission : () => true)(auth.user),
      ),
    );
    
    // AuthService.getConfig()
    //   .then((data) => {
    //     setConfig(data);
    //   })
    //   .catch((e) => {
    //     console.error(e);
    //   });
    return () => {};
  }, [auth]);

  return (
    <Disclosure as="nav" className="bg-zinc-800 shadow-xl">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <button onClick={() => navigate('/')}>
                <div className="flex flex-shrink-0 items-center ">
                  <img
                    className="block h-8 w-auto lg:hidden"
                    src={logo}
                    alt="vACDM"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src={logo}
                    alt="vACDM"
                  />
                </div>
                </button>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {items.map((item) => (
                      <a
                        key={item.label}
                        onClick={() => navigate(item.href)}
                        className={classNames(
                          location.pathname === item.href
                            ? 'bg-zinc-900 text-white'
                            : 'text-white hover:bg-zinc-900',
                          'rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* {config?.vaccLogoUrl && <img alt="vacc-logo" src={config?.vaccLogoUrl} className='hidden md:block  max-h-[40px] mr-3' />} */}
                <button
                  onClick={changeDarkMode}
                  type="button"
                  className="rounded-full bg-zinc-900 p-1 text-white hover:text-white"
                >
                  {darkMode ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      />
                    </svg>
                  )}
                </button>

                <div className={`${auth.user ? 'hidden' : ''} ml-2`}>
                  <Button size='small' onClick={() => redirectToVatsimAuth()}>Login</Button>
                </div>

                {/* Profile dropdown */}

                <Menu as="div" className="relative ml-3">
                  <div className={!auth.user ? 'hidden' : ''}>
                    <Menu.Button className="flex rounded-full bg-zinc-900  text-white hover:text-white">
                      <span className="sr-only">Open user menu</span>
                      <ProfilePicture user={auth.user} className='h-8 w-8 rounded-full' />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700 cursor-pointer',
                            )}
                          >
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            onClick={() => logout()}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700 cursor-pointer',
                            )}
                          >
                            Sign out
                          </span>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navItems.map((item) => (
                <Disclosure.Button
                  key={item.label}
                  as="a"
                  onClick={() => navigate(item.href)}
                  className={classNames(
                    location.pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium',
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.label}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
