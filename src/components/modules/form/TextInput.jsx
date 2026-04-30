import React from 'react';

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
  // 베이스 클래스에 우리가 만든 커스텀 유틸리티 포함
  const baseInputClassName = "input input-secondary input-hover-green w-full transition-all outline-none";

  // DaisyUI 표준 클래스와 커스텀 높이 조합
  const sizeStyles = {
    sm: "input-sm h-[2.5rem]",   // 40px
    md: "input-md h-[3rem]",    // 48px
    lg: "input-lg h-[3.5rem]",   // 56px
    xl: "input-lg h-[4rem] text-xl",    // 64px (lg 베이스로 높이 확장)
    "2xl": "input-lg h-[4.5rem] text-2xl", // 72px (lg 베이스로 높이 확장)
  };

  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label className="label py-1" htmlFor={id}>
          <span className="label-text font-medium text-gray-700">{label}</span>
          {required && <span className="label-text-alt text-error font-bold">* 필수</span>}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        // DaisyUI 사이즈 클래스와 커스텀 높이를 함께 적용
        className={`${baseInputClassName} ${sizeStyles[size] || sizeStyles.md} ${inputClassName}`}
        {...props}
      />
    </div>
  );
};

export default TextInput;