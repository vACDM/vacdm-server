import { joinClassNames } from '../../../utils/ui/classNameHelper';

const Card = (props: any) => {
  const classes = joinClassNames(
    'block bg-white border border-gray-200 rounded-lg shadow dark:bg-zinc-800 dark:border-zinc-700 border',
    props.className || ''
  );

  return (
    <>
      <div className={classes}>
        <h1 className="text-xl">{props.title}</h1>
        {props.children}
      </div>
    </>
  );
};

export default Card;
