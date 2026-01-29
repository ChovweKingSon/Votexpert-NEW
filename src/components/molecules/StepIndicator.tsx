import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number; // 0-indexed
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function StepIndicator({
  steps,
  currentStep,
  className,
  orientation = 'horizontal',
}: StepIndicatorProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'flex-row items-center' : 'flex-col',
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={index}
            className={cn(
              'flex',
              isHorizontal ? 'flex-1 items-center' : 'items-start gap-3'
            )}
          >
            {/* Step indicator */}
            <div
              className={cn(
                'flex',
                isHorizontal ? 'flex-col items-center' : 'flex-col items-center'
              )}
            >
              {/* Circle */}
              <div
                className={cn(
                  'flex items-center justify-center rounded-full transition-colors',
                  'w-8 h-8 text-sm font-medium',
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : isCurrent
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Label (horizontal only - below circle) */}
              {isHorizontal && (
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      'text-xs font-medium',
                      isCurrent || isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              )}
            </div>

            {/* Connector line (not for last item) */}
            {!isLast && (
              <div
                className={cn(
                  isHorizontal
                    ? 'flex-1 h-0.5 mx-2'
                    : 'w-0.5 h-8 ml-4 my-1',
                  isCompleted ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}

            {/* Label and description (vertical only - beside circle) */}
            {!isHorizontal && (
              <div className="pb-8">
                <p
                  className={cn(
                    'font-medium',
                    isCurrent || isCompleted
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
