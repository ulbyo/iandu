import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  className = '',
  children,
  disabled,
  ...props 
}: ButtonProps) => {
  const baseStyles = "rounded-full font-medium focus:outline-none transition-all duration-200 flex items-center justify-center";
  
  const variantStyles = {
    primary: "bg-white text-black hover:bg-gray-100",
    secondary: "bg-gray-800 text-white hover:bg-gray-700",
    outline: "bg-transparent border border-gray-700 text-white hover:bg-gray-900",
    ghost: "bg-transparent text-white hover:bg-gray-900"
  };
  
  const sizeStyles = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-5 py-2",
    lg: "text-lg px-6 py-3"
  };
  
  const widthStyles = fullWidth ? "w-full" : "";
  const disabledStyles = (disabled || loading) ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-2" />
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
};

export default Button;