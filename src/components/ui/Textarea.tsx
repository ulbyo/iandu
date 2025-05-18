import { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-gray-300 mb-2 text-sm">{label}</label>
        )}
        <textarea
          ref={ref}
          className={`
            px-4 py-2 bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-700'} 
            rounded-lg text-white w-full focus:outline-none focus:ring-2 focus:ring-white
            transition-colors min-h-[100px] ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;