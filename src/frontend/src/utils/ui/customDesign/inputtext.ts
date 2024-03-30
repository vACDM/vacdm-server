import { classNames } from 'primereact/utils';

export const inputtext = {
  root: ({ props, context }) => ({
    className: classNames(
      'm-0',
      'font-sans text-gray-600 dark:text-white/80 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 transition-colors duration-200 appearance-none rounded-lg',
      {
        'hover:border-zinc-600 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]': !context.disabled,
        'opacity-60 select-none pointer-events-none cursor-default': context.disabled,
      },
      {
        'text-lg px-4 py-4': props.size == 'large',
        'text-xs px-2 py-2': props.size == 'small',
        'p-1 text-base': props.size == null,
      },
    ),
  }),
};
