
const WriteForm = ({
  titleText,
  descriptionText,
  onSubmit,
  onCancel,
  submitText,
  children,
}) => {
  return (
    <div className="container py-20">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b px-8 py-6">
          <h2 className="fs-down-4 font-bold text-gray-800">
            {titleText}
          </h2>
          <p className="fs-down-1 text-gray-400 mt-1">
            {descriptionText}
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-8">
          {children}

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition-all"
            >
              취소
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#009277] text-white font-semibold rounded-lg hover:bg-[#007a63] shadow-md transition-all"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteForm;