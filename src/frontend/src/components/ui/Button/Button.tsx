import { joinClassNames } from '../../../utils/ui/classNameHelper';
import { ButtonProps } from './Button.props';

function buttonStyle(style: string | undefined) {
  switch (style) {
    case 'success':
      return 'focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium  rounded-lg text-sm px-5 lg:py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800';
    case 'warning':
      return 'focus:outline-none text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 lg:py-2 dark:focus:ring-yellow-900';
    case 'danger':
      return 'focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 lg:py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900';
    case 'purple':
      return 'focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 lg:py-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900';
    case 'alternative':
      return 'focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 lg:py-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900';
    case 'light':
      return 'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 lg:py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700';
    default:
      return 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 lg:py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800';
  }
}
const Button = (props: ButtonProps) => {
  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (props.disabled || props.loading) {
      e.preventDefault();
      return;
    }
    props.onClick?.(e);
  }

    const classes = joinClassNames(buttonStyle(props.style), 'md:py-1' , props.className || '');


  return (
    <button
      disabled={props.disabled}
      type="button"
      className={classes}
      onClick={(e) => handleClick(e)}
    >
      {props.children}
    </button>
  );
};

export default Button;
