import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        // mobile-first: comfortable tap area + prevent flex/grid squish
        "flex w-full min-w-0 rounded-md border border-input bg-background px-3 py-2",
        "min-h-[100px] sm:min-h-[90px] md:min-h-[80px]",
        "text-base leading-6 sm:text-[15px] sm:leading-6 md:text-sm md:leading-5",
        "ring-offset-background",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
