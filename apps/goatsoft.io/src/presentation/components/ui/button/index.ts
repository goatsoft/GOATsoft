import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--goat-accent)_35%,transparent),0_8px_30px_-8px_color-mix(in_oklab,var(--goat-accent)_70%,transparent)] hover:brightness-110 hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--goat-accent)_50%,transparent),0_12px_40px_-8px_color-mix(in_oklab,var(--goat-accent)_90%,transparent)]',
        aurora:
          'text-white bg-[linear-gradient(110deg,var(--goat-accent),var(--goat-glow)_55%,var(--goat-accent2))] bg-[length:200%_100%] bg-left hover:bg-right shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--goat-glow)_80%,transparent)] transition-[background-position,box-shadow,transform] duration-500',
        outline: 'border border-border bg-transparent text-foreground hover:glass-hover',
        ghost: 'text-muted-foreground hover:text-foreground hover:glass-hover',
        glass: 'glass text-foreground hover:glass-hover',
        link: 'text-primary underline-offset-4 hover:underline rounded-none',
      },
      size: {
        default: 'h-10 px-5 text-sm',
        sm: 'h-8 px-3.5 text-xs',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-9 text-lg',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
