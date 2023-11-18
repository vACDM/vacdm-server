import { classNames } from 'primereact/utils';

export const inputnumber = {
  root: 'flex',
  input: ({ props }) => ({
    className: classNames({ 'rounded-tr-none rounded-br-none': props.showButtons && props.buttonLayout == 'stacked' }),
  }),
  buttongroup: ({ props }) => ({
    className: classNames({ 'flex flex-col': props.showButtons && props.buttonLayout == 'stacked' }),
  }),
  incrementbutton: ({ props }) => ({
    className: classNames('flex !items-center !justify-center', {
      'rounded-br-none rounded-bl-none rounded-bl-none !p-0 flex-1 w-[3rem]': props.showButtons && props.buttonLayout == 'stacked',
    }),
  }),
  label: 'hidden',
  decrementbutton: ({ props }) => ({
    className: classNames('flex !items-center !justify-center', {
      'rounded-tr-none rounded-tl-none rounded-tl-none !p-0 flex-1 w-[3rem]': props.showButtons && props.buttonLayout == 'stacked',
    }),
  }),
};


