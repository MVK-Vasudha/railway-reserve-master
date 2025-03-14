
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variantStyles = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      glass: "glass text-foreground hover:shadow-glass-hover border-0"
    };
    
    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3 rounded-md text-sm",
      lg: "h-11 px-8 rounded-md text-base",
      icon: "h-10 w-10"
    };
    
    const loadingClass = isLoading ? "relative text-transparent hover:text-transparent transition-none" : "";
    
    const loadingSpinner = isLoading ? (
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    ) : null;

    return (
      <button
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          loadingClass,
          className
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {children}
        {loadingSpinner}
      </button>
    );
  }
);

CustomButton.displayName = "CustomButton";

export { CustomButton };
