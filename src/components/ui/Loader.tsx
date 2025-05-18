const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-white rounded-full"></div>
        <div className="w-12 h-12 border-2 border-transparent border-t-white rounded-full absolute top-0 left-0 animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;