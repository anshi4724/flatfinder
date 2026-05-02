const Spinner = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
        <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>
    </div>
  );
};

export default Spinner;
