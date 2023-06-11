const FeatureBox = (props: any) => {
  return (
    <div
      className={`container max-w-sm text-center p-8 mx-auto bg-gray-500 rounded-lg ${
        props.className ? props.className : ''
      }`}
    >
        <div className="items-center justify-center shadow-lg w-12 h-12 inline-flex rounded-full bg-gray-400 mb-4">
        {props.icon}
        </div>

      <h1 className="text-xl font-bold text-zinc-900 ">{props.headline}</h1>
      {props.children}
    </div>
  );
};

export default FeatureBox;
