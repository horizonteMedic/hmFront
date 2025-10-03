const SectionWithBack = ({ title, onBack, children, topLayout = "double-between", showBottomBack = true }) => {
  const topClasses = (() => {
    switch (topLayout) {
      case "single-end":
        return "w-full flex items-center justify-end gap-4 mb-2";
      case "single-start":
        return "w-full flex items-center justify-start gap-4 mb-2";
      case "double-between":
      default:
        return "w-full flex items-center justify-between gap-4 mb-2 max-w-[95%] mx-auto";
    }
  })();

  return (
    <div>
      <div className={topClasses}>
        {topLayout === "double-between" ? (
          <>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
              onClick={onBack}
            >
              ← Atrás
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
              onClick={onBack}
            >
              ← Atrás
            </button>
          </>
        ) : (
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
            onClick={onBack}
          >
            ← Atrás
          </button>
        )}
      </div>

      <div className="w-full flex justify-center items-center mb-4">
        <h2 className="text-2xl font-bold text-[#233245]">{title}</h2>
      </div>

      {children}

      {showBottomBack && (
        <div className="w-full flex items-center justify-start gap-4 mt-4 max-w-[95%] mx-auto">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
            onClick={onBack}
          >
            ← Atrás
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionWithBack;