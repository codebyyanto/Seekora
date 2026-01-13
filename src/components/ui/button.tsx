import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Note: Radix Slot is not installed yet, but usually good for 'asChild'. 
// If not using Radix Slot immediately, I can simulate standard button.
// For now, I'll stick to a simpler button to avoid dependency error if @radix-ui/react-slot is missing.
// Wait, I didn't install @radix-ui/react-slot. I'll omit Slot for now.

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-seekora-primary text-white hover:bg-seekora-primary/90 shadow-lg shadow-seekora-primary/20",
                destructive: "bg-red-500 text-white hover:bg-red-500/90",
                outline: "border border-seekora-border bg-seekora-card hover:bg-seekora-border text-foreground glass",
                secondary: "bg-seekora-accent text-white hover:bg-seekora-accent/80",
                ghost: "hover:bg-seekora-card hover:text-white text-slate-400",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8 text-base",
                icon: "h-10 w-10",
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
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
