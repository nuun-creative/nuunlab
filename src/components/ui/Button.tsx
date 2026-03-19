import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-nuun-orange text-white hover:brightness-110 active:brightness-95 focus-visible:ring-nuun-orange",
    ghost:
      "bg-transparent border border-white/30 text-white hover:bg-white/10 active:bg-white/5 focus-visible:ring-white",
  };

  const sizes = {
    sm: "text-sm px-4 py-1.5",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-7 py-3",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
