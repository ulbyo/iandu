import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-gray-300 mb-2 text-sm">{label}</label>
        )}
        <input
          ref={ref}
          className={`
            px-4 py-2 bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-700'} 
            rounded-lg text-white w-full focus:outline-none focus:ring-2 focus:ring-white 
            transition-colors ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;