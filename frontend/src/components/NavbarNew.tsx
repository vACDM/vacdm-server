import {
  Avatar,
  DarkThemeToggle,
  Dropdown,
  Flowbite,
  Navbar,
} from 'flowbite-react';
import logo from '../assets/cdm_logo.png';
import { Fragment, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FrontendSettings } from '@shared/interfaces/config.interface';
import AuthContext from '../contexts/AuthProvider';
import AuthService from '../services/AuthService';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function NavbarWithDropdown(props: any) {
  const [config, setConfig] = useState<FrontendSettings>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [items, setItems] = useState<any>([]);
  const auth: any = useContext(AuthContext);

  const navItems: {
    label: string;
    href: string;
    permission?: (user: any) => boolean;
    current: boolean;
  }[] = [
    {
      label: 'Delivery',
      href: '/delivery',
      permission: (user) => user && !user.vacdm.banned && user.vacdm.atc,
      current: true,
    },
    {
      label: 'Airports',
      href: '/airports',
      permission: (user) => user && !user.vacdm.banned && user.vacdm.admin,
      current: false,
    },
    {
      label: 'Flow Management',
      href: '/flow-management',
      permission: (user) => user && !user.vacdm.banned && user.vacdm.admin,
      current: false,
    },
    {
      label: 'AVDGS',
      href: '/vdgs',
      permission: (user) => user && !user.vacdm.banned && user.vacdm.admin,
      current: false,
    },
  ];

  useEffect(() => {
    console.log(location.pathname);
    //  if (auth.auth.user !== undefined) {
    setUser(auth.auth.user);
    setItems(
      navItems.filter((item) =>
        (item.permission ? item.permission : () => true)(auth.auth.user)
      )
    );
    //  }
    AuthService.getConfig()
      .then((data) => {
        setConfig(data);
      })
      .catch((e) => {
        console.error(e);
      });
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
                <div className="flex flex-shrink-0 items-center">
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
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navItems.map((item) => (
                      <a
                        key={item.label}
                        onClick={() => navigate(item.href)}
                        className={classNames(
                          location.pathname === item.href
                            ? 'bg-gray-900 text-white'
                            : 'text-white hover:bg-gray-700',
                          'rounded-md px-3 py-2 text-sm font-medium cursor-pointer'
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
                <button
                  type="button"
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  {/* <BellIcon className="h-6 w-6" aria-hidden="true" /> */}
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://ui-avatars.com/api/?name=M+F&color=FFFFFF&background=18181B"
                        alt="##"
                      />
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
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Sign out
                          </a>
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
                    'block rounded-md px-3 py-2 text-base font-medium'
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
