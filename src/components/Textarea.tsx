interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  className?: string;
}

export default function Textarea({ label, className, rows, ...props }: TextareaProps) {
  return (
    <div className="flex w-full flex-col">
      <label className="mb-1 text-[13px] sm:text-sm">{label}</label>
      <textarea
        {...props}
        rows={rows ?? 4}
        className={[
          // mobile-first: compact, prevents grid/flex squish
          "w-full min-w-0 rounded-md border border-input bg-background px-3 py-2",
          // comfortable tap area, denser on wider screens
          "min-h-[100px] sm:min-h-[90px] md:min-h-[80px]",
          // fluid-ish text that steps down on larger screens
          "text-base sm:text-[15px] md:text-sm leading-6",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // dark fallback consistent with the rest of the app
          "dark:bg-zinc-800",
          className || ""
        ].join(" ")}
      />
    </div>
  );
}
