import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "skeuo-button-shell inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[1rem] border text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 enabled:hover:-translate-y-0.5 enabled:active:translate-y-[1px] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-[#caa15e]/30 bg-[linear-gradient(180deg,rgba(224,188,122,0.95)_0%,rgba(162,121,55,0.96)_100%)] text-[#151922] hover:border-[#e2bc7e]/40 hover:brightness-105",
        destructive:
          "border-[#d36b4a]/35 bg-[linear-gradient(180deg,rgba(217,103,74,0.95)_0%,rgba(146,52,33,0.96)_100%)] text-destructive-foreground hover:brightness-105",
        outline:
          "border-white/10 bg-[linear-gradient(180deg,rgba(57,68,89,0.92)_0%,rgba(28,35,49,0.98)_100%)] text-foreground hover:border-white/20 hover:bg-[linear-gradient(180deg,rgba(66,78,101,0.94)_0%,rgba(32,40,56,1)_100%)]",
        secondary:
          "border-[#6ba6b8]/30 bg-[linear-gradient(180deg,rgba(110,163,185,0.95)_0%,rgba(55,100,119,0.96)_100%)] text-[#101721] hover:brightness-105",
        ghost:
          "border-transparent bg-transparent text-foreground shadow-none hover:border-white/10 hover:bg-white/5",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-[0.95rem] px-3.5",
        lg: "h-12 rounded-[1.1rem] px-8",
        icon: "h-11 w-11 rounded-[1rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
