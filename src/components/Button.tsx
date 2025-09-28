import React, { ReactNode, cloneElement, isValidElement } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "link";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 " +
  "ring-offset-[hsl(var(--background))] disabled:pointer-events-none disabled:opacity-50";

// Compact, mobile-first sizes (aligns with ui/button.tsx)
// Global.css enforces min-height ≥40px on touch devices.
const sizes: Record<Size, string> = {
  sm: "h-9 px-2.5 text-sm",          // compact
  md: "h-9 px-3 text-sm",            // default compact
  lg: "h-10 px-4 text-sm",           // slightly taller
  icon: "h-9 w-9 p-0",               // square icon
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-hover))] active:bg-[hsl(var(--primary-active))]",
  secondary:
    "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary-hover))] active:bg-[hsl(var(--secondary-active))]",
  outline:
    "border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]",
  ghost:
    "bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] border border-[hsl(var(--border))]",
  link:
    "bg-transparent p-0 h-auto text-[hsl(var(--primary))] hover:underline",
};

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}: ButtonProps) {
  const classes = cx(base, sizes[size], variants[variant], className);

  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement, {
      className: cx((children as React.ReactElement).props?.className, classes),
      "aria-disabled": props.disabled ? true : undefined,
    });
  }

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
}
