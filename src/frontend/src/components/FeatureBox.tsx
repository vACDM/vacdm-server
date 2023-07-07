const FeatureBox = (props: any) => {
  return (
    <div
      className={`container max-w-sm text-center p-8 mx-auto bg-zinc-800 rounded-lg ${
        props.className ? props.className : ''
      }`}
    >
        <div className="items-center justify-center shadow-lg w-12 h-12 inline-flex rounded-full bg-blue-700 mb-4">
        {props.icon}
        </div>

      <h1 className="text-xl font-bold text-white ">{props.headline}</h1>
      <span className="text-gray-400">{props.children}</span>
    </div>
  );
};

export default FeatureBox;
