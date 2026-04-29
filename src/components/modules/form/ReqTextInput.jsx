/**
 * Iunput 크기조절할때
 * size: sm, md, lg, xl, 2xl 
 * lable: 옵션값 넣으면 라벨도 달아줌
 *
 */
const ReqTextInput = ({
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
    sm: "h-[32px] px-2 text-sm",
    md: "h-[41px] px-4 text-base",
    lg: "h-[48px] px-5 text-lg",
    xl: "h-[56px] px-6 text-xl",
    "2xl": "h-[64px] px-7 text-2xl",
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

export default ReqTextInput;