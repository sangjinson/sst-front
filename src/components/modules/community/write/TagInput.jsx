import TextInput from "@modules/form/TextInput";

const TagInput = ({
  tags,
  setTags,
  tagInput,
  setTagInput,
  handleTagKeyDown,
}) => {
  return (
    <div>
      <label htmlFor="tagInput" className="block fs-down-1 font-bold text-gray-700 mb-3">
        태그 설정
      </label>

      <div className="w-full flex flex-wrap gap-2 items-center">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-[#f0f9f7] text-[#009277] px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 shadow-sm"
          >
            #{tag}
            <button
              type="button"
              onClick={() => setTags(tags.filter((_, i) => i !== index))}
              className="ml-1 hover:text-red-500"
            >
              ×
            </button>
          </span>
        ))}

        <TextInput
          id="tagInput"
          value={tagInput}
          size="md"
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder={tags.length === 0 ? "태그 입력 후 엔터" : ""}
          inputClassName="fs-down-1"
        />
      </div>
    </div>
  );
};

export default TagInput;