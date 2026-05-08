import { forwardRef } from "react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          // Base
          "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed select-none",
          // Size
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-6 py-3.5 text-sm",
          size === "lg" && "px-8 py-4 text-base",
          // Variant
          variant === "primary" &&
            "bg-gradient-to-r from-airbnb-red to-[#E31C5F] text-white hover:opacity-90 shadow-sm",
          variant === "outline" &&
            "bg-white border border-airbnb-border text-airbnb-dark hover:bg-airbnb-bg-hover",
          variant === "ghost" &&
            "bg-transparent text-airbnb-dark hover:bg-airbnb-bg-hover underline",
          variant === "danger" &&
            "bg-white border border-red-300 text-red-600 hover:bg-red-50",
          // Full width
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Cargando...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
