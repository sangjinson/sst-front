/**
 * Iunput 크기조절할때
 * size: sm, md, lg, xl, 2xl 
 * lable: 옵션값 넣으면 라벨도 달아줌
 *
 */
const TextInput = ({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  className = "",
  inputClassName = "",
  size = "md",
  ...props
}) => {
  const baseInputClassName =
    "w-full border border-gray-200 rounded-lg outline-none focus:border-[#009277] transition-colors";

  const sizeStyles = {
    sm: "h-[2.5rem] px-[0.75rem] text-[0.875rem]",   // 40px
    md: "h-[3rem] px-[1rem] text-[1rem]",           // 48px
    lg: "h-[3.5rem] px-[1.25rem] text-[1.125rem]",  // 56px
    xl: "h-[4rem] px-[1.5rem] text-[1.25rem]",      // 64px
    "2xl": "h-[4.5rem] px-[1.75rem] text-[1.5rem]", // 72px
    };
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`${baseInputClassName} ${sizeStyles[size]} ${inputClassName} ${className}`}
      {...props}
    />
  );
};

export default TextInput;