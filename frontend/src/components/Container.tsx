const Container = (props: any) => {
  return (
    <div
      className={`container mx-auto ${
        props.className ? props.className : ''
      }`}
    >
      {props.children}
    </div>
  );
};

export default Container;
