"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { DotsLoader } from "@koko420/react-components";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
  secondary:
    "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-400",
  outline:
    "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
  ghost: "text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm h-[32px]",
  md: "px-4 py-2 text-base h-[40px]",
  lg: "px-6 py-3 text-lg h-[52px]",
};

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <DotsLoader
            size={size}
            modifier="primary"
          />
        ) : (
          children
        )}
      </button>
    );
  }
);

ActionButton.displayName = "ActionButton";
