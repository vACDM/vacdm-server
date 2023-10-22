export   const TRANSITIONS = {
  toggleable: {
    classNames: {
      enter: 'max-h-0',
      enterActive: 'overflow-hidden transition-all duration-500 ease-in-out',
      enterDone: 'max-h-40',
      exit: 'max-h-40',
      exitActive: 'overflow-hidden transition-all duration-500 ease-in',
      exitDone: 'max-h-0',
    },
  },
  overlay: {
    classNames: {
      enter: 'opacity-0 scale-75',
      enterActive: 'transition-transform transition-opacity duration-150 ease-in',
      exitActive: 'transition-opacity duration-150 ease-linear',
      exitDone: 'opacity-0',
    },
  },
};
