import { classNames } from 'primereact/utils';

import { TRANSITIONS } from './transitions';

export const accodion = {
  root: 'mb-1',
  accordiontab: {
    root: 'mb-1',
    header: ({ context }) => {
      return {
        className: classNames(
          { 'select-none pointer-events-none cursor-default opacity-60': context.disabled }, // Condition
        ),
      };
    },
    headerAction: ({ context }) => ({
      className: classNames(
        'flex items-center cursor-pointer relative no-underline select-none', // Alignments
        'p-5 transition duration-200 ease-in-out rounded-t-md font-bold transition-shadow duration-200', // Padding and transition
        'border border-gray-300 bg-gray-100 text-gray-600', // Borders and colors
        'dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80 dark:hover:bg-gray-800/80 dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]', // Dark mode
        'hover:border-gray-300 hover:bg-gray-200 hover:text-gray-800', // Hover
        'focus:outline-none focus:outline-offset-0 focus:shadow-[inset_0_0_0_0.2rem_rgba(191,219,254,1)]', // Focus
        { 'rounded-br-md rounded-bl-md': !context.selected, 'rounded-br-0 rounded-bl-0 text-gray-800': context.selected }, // Condition
      ),
    }),
    headerIcon: 'inline-block mr-2',
    headerTitle: 'leading-none',
    content: {
      className: classNames(
        'p-5 border border-gray-300 bg-white text-gray-700 border-t-0 rounded-tl-none rounded-tr-none rounded-br-lg rounded-bl-lg',
        'dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80', // Dark mode
      ),
    },
    transition: TRANSITIONS.toggleable,
  },
};
