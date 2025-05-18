import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card = ({ children, className = '', hoverable = false }: CardProps) => {
  return (
    <div 
      className={`
        backdrop-blur-md bg-gray-900 bg-opacity-60 
        border border-gray-800 rounded-lg p-6
        ${hoverable ? 'hover:shadow-lg hover:border-gray-700 transition-all duration-300 transform hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;