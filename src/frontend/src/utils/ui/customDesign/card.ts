import { classNames } from 'primereact/utils';

export const card = {
  root: {
    className: classNames(
      'bg-white text-black shadow-md rounded-md', // Background, text color, box shadow, and border radius.
      'dark:bg-zinc-800 dark:text-white ', //dark
    ),
  },
  //body: 'p-4', // Padding.
  title: 'text-2xl font-bold mb-2', // Font size, font weight, and margin bottom.
  subtitle: {
    className: classNames(
      'font-normal mb-2 text-gray-600', // Font weight, margin bottom, and text color.
      'dark:text-white/60 ', //dark
    ),
  },
  content: 'py-4', // Vertical padding.
  footer: 'pt-5', // Top padding.
};
