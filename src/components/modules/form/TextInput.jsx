import React from "react";

/**
 * TextInput 컴포넌트
 * @param {string} size - sm, md, lg, xl, 2xl
 */
const TextInput = ({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  label,
  className = "",
  inputClassName = "",
  size = "md",
  ...props
}) => {
  const baseInputClassName = `
      w-full h-12 px-4 
      border border-gray-200 
      rounded-lg 
      text-sm 
      outline-none 
      focus:border-[#0F9B73] 
      transition
      `;

  const sizeStyles = {
    sm: "input-sm",
    md: "input-md",
    lg: "input-lg",
    xl: "input-lg h-[4.5rem] text-xl",
    "2xl": "input-lg h-[5.5rem] text-2xl",
  };

  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label className="label py-1" htmlFor={id}>
          <span className="label-text font-medium text-gray-700">
            {label}
          </span>

          {required && (
            <span className="label-text-alt text-[#0F9B73] font-bold">
              * 필수
            </span>
          )}
        </label>
      )}

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-required={required}
        className={`
          ${baseInputClassName}
          ${sizeStyles[size] || sizeStyles.md}
          ${inputClassName}
        `}
        {...props}
      />
    </div>
  );
};

export default TextInput;