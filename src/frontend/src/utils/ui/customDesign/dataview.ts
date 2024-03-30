import { classNames } from 'primereact/utils';

export const dataview =  {
  dataview: {
    content: {
      className: classNames(
        'bg-white blue-gray-700 border-0 p-0',
        'dark:bg-zinc-800 dark:text-white/80', // Dark Mode
      ),
    },
    grid: 'flex flex-wrap ml-0 mr-0 mt-0 bg-white dark:bg-zinc-800',
    list: 'flex flex-wrap ml-0 mr-0 mt-0 bg-white dark:bg-zinc-800',
    header: 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-white/80 border-gray-200 dark:border-blue-900/40 border-t border-b p-4 font-bold',
  },
  dataviewlayoutoptions: {
    listbutton: ({ props }) => ({
      className: classNames(
        'items-center cursor-pointer inline-flex overflow-hidden relative select-none text-center align-bottom justify-center border',
        'transition duration-200',
        'w-12 pt-3 pb-3 rounded-lg rounded-r-none',
        props.layout === 'list' ? 'bg-zinc-800 border-blue-500 text-white dark:bg-sky-300 dark:border-sky-300 dark:text-gray-900' : 'bg-white border-gray-300 text-blue-gray-700 dark:bg-zinc-800 dark:border-blue-900/40 dark:text-white/80',
      ),
    }),
    gridbutton: ({ props }) => ({
      className: classNames(
        'items-center cursor-pointer inline-flex overflow-hidden relative select-none text-center align-bottom justify-center border',
        'transition duration-200',
        'w-12 pt-3 pb-3 rounded-lg rounded-l-none',
        props.layout === 'grid' ? 'bg-zinc-800 border-blue-500 text-white dark:bg-sky-300 dark:border-sky-300 dark:text-gray-900' : 'bg-white border-gray-300 text-blue-gray-700 dark:bg-zinc-800 dark:border-blue-900/40 dark:text-white/80',
      ),
    }),
  },
};
