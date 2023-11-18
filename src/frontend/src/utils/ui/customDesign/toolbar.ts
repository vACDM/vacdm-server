import { classNames } from 'primereact/utils';

export const toolbar = {
  root: {
    className: classNames('flex items-center justify-between flex-wrap', 'bg-slate-50 dark:bg-zinc-800 p-4 rounded-md gap-2'),
  },
  start: 'flex items-center',
  center: 'flex items-center',
  end: 'flex items-center',
};
