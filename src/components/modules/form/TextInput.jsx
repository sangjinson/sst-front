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
  // 1. 베이스 클래스 (우리가 재정의한 초록색 테마)
  const baseInputClassName = "input input-secondary input-hover-green w-full transition-all outline-none";

  // 2. DaisyUI 표준 사이즈 클래스 매핑
  const sizeStyles = {
    sm: "input-sm",      // DaisyUI 표준 높이 (32px)
    md: "input-md",      // DaisyUI 표준 높이 (48px)
    lg: "input-lg",      // DaisyUI 표준 높이 (64px)
    // 표준을 넘어서는 사이즈만 커스텀 높이 적용
    xl: "input-lg h-[4.5rem] text-xl", 
    "2xl": "input-lg h-[5.5rem] text-2xl", 
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
        // h-를 제거하고 DaisyUI 표준 클래스(input-sm 등)가 높이를 결정하게 함
        className={`${baseInputClassName} ${sizeStyles[size] || sizeStyles.md} ${inputClassName}`}
        {...props}
      />
    </div>
  );
};

export default TextInput;