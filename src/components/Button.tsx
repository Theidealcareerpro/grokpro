import React, { ReactNode, cloneElement, isValidElement } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "link";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** visual style; defaults to 'primary' */
  variant?: Variant;
  /** size scale; defaults to 'md' */
  size?: Size;
  /** render styles onto the child element (lets you do: <Button asChild><a/></Button>) */
  asChild?: boolean;
}

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 ring-offset-[hsl(var(--background))] disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
  icon: "h-10 w-10 p-0",
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

  // Support <Button asChild><a href="..." /></Button>
  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement, {
      className: cx((children as React.ReactElement).props?.className, classes),
      // Allow anchors/Links to receive disabled style (no pointer events)
      "aria-disabled": props.disabled ? true : undefined,
    });
  }

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
}
