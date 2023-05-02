const Loading = (props: any) => {
  return (
    <div
      className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary flex"
      style={{
        width: props.width,
        height: props.height,
      }}
    ></div>
  );
};

export default Loading;
