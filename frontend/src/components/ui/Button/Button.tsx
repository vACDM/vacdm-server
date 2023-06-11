const Button = (props: any) => {
  return (
    <button
      type="button"
      className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2 mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
    >
      {props.children}
    </button>
  );
};

export default Button;
