const Container = (props: any) => {
  return (
    <div
      className={`mx-auto ${
        props.className ? props.className : ''
      }`}
    >
      {props.children}
    </div>
  );
};

export default Container;
