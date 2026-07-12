import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'dark' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-naranja text-white hover:bg-[#e66800] disabled:bg-zinc-300 disabled:text-zinc-500',
  secondary:
    'bg-white text-brand-naranja border border-brand-naranja hover:bg-orange-50 disabled:border-zinc-300 disabled:text-zinc-400',
  dark: 'bg-brand-azul text-white hover:bg-[#232a63] disabled:bg-zinc-300 disabled:text-zinc-500',
  ghost: 'bg-transparent text-brand-naranja hover:bg-orange-50 disabled:text-zinc-400',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
