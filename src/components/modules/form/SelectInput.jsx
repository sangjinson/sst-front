/**
 * Select 크기조절할때
 * size: sm, md, lg, xl, 2xl
 *
 */
const SelectInput = ({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder = "선택해주세요",
  required = false,
  className = "",
  selectClassName = "",
  size = "md",
  ...props
}) => {
  const baseSelectClassName =
    "w-full border border-gray-200 rounded-lg outline-none focus:border-[#009277] transition-colors bg-white text-gray-700 appearance-none";

  // size별 스타일
  const sizeStyles = {
    sm: "h-[32px] px-2 text-sm",
    md: "h-[41px] px-4 text-base",
    lg: "h-[48px] px-5 text-lg",
    xl: "h-[56px] px-6 text-xl",
    "2xl": "h-[64px] px-7 text-2xl",
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block fs-down-2 font-bold text-gray-700 mb-3"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className={`${baseSelectClassName} ${sizeStyles[size]} pr-10 ${selectClassName}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <svg
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default SelectInput;