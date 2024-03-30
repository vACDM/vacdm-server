import { classNames } from 'primereact/utils';

import { TRANSITIONS } from './transitions';

export const menu = {
  root: 'py-1 bg-white dark:bg-zinc-800 text-gray-700 dark:text-white border border-gray-300 dark:border-zinc-900/40 rounded-md w-48',
  menu: {
    className: classNames('m-0 p-0 list-none', 'outline-none'),
  },
  content: ({ state }) => ({
    className: classNames(
      'text-gray-700 dark:text-white transition-shadow duration-200 rounded-none',
      'hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700', // Hover
      {
        'bg-gray-300 text-gray-700 dark:text-white dark:bg-gray-800/90': state.focused,
      },
    ),
  }),
  action: {
    className: classNames('text-gray-700 dark:text-white/80 py-3 px-5 select-none', 'cursor-pointer flex items-center no-underline overflow-hidden relative'),
  },
  menuitem: {
    className: classNames('hover:bg-zinc-200 dark:hover:bg-zinc-600'),
  },
  icon: 'text-gray-600 dark:text-white/70 mr-2',
  submenuheader: {
    className: classNames('m-0 p-3 text-gray-700 dark:text-white/80 bg-white dark:bg-gray-900 font-bold rounded-tl-none rounded-tr-none'),
  },
  separator: 'border-t border-gray-300 dark:border-blue-900/40 my-1',
  transition: TRANSITIONS.overlay,
};
