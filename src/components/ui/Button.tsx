import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-vinotel-primary text-white hover:bg-vinotel-primary/90 focus:ring-vinotel-primary',
    secondary: 'bg-vinotel-secondary text-white hover:bg-vinotel-secondary/90 focus:ring-vinotel-secondary',
    outline: 'border-2 border-vinotel-primary text-vinotel-primary hover:bg-vinotel-primary hover:text-white focus:ring-vinotel-primary',
    ghost: 'text-vinotel-primary hover:bg-vinotel-primary/10 focus:ring-vinotel-primary'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;