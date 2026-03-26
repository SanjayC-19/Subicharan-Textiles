import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  // Base
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-sans font-medium tracking-[0.12em] uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/85 hover:shadow-md',
        outline:
          'border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground',
        ghost:
          'text-foreground hover:text-primary hover:bg-accent',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        link:
          'text-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-11 px-7 py-2',
        sm: 'h-9 px-5',
        lg: 'h-14 px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export function Button({ className, variant, size, asChild, children, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
}
