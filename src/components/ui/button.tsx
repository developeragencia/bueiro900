import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50
          ${size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base'}
          ${variant === 'outline' ? 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground' : ''}
          ${className}`}
        {...props}
      />
    );
  }
); 