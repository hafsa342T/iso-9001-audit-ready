import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export const ProgressBar = ({
  value,
  max,
  className,
  showPercentage = true,
  variant = 'default'
}: ProgressBarProps) => {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'destructive':
        return 'bg-destructive';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">
          Progress
        </span>
        {showPercentage && (
          <span className="text-sm font-medium text-muted-foreground">
            {percentage}%
          </span>
        )}
      </div>
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            getVariantStyles()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};