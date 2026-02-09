import { motion } from 'framer-motion';
import { CheckCircle2, ClipboardList, Send, Truck, Activity, ShieldCheck } from 'lucide-react';
import { ReportStatus, STATUS_STEPS } from '@/lib/types';
import { cn } from '@/lib/utils';

const STEP_ICONS = [CheckCircle2, ClipboardList, Send, Truck, Activity, ShieldCheck];

interface StatusStepperProps {
  currentStatus: ReportStatus;
  onStatusChange?: (status: ReportStatus) => void;
  interactive?: boolean;
  vertical?: boolean;
}

const StatusStepper = ({ currentStatus, onStatusChange, interactive, vertical = true }: StatusStepperProps) => {
  const currentIdx = STATUS_STEPS.findIndex(s => s.key === currentStatus);

  return (
    <div className={cn('flex', vertical ? 'flex-col gap-0' : 'flex-row gap-2 overflow-x-auto')}>
      {STATUS_STEPS.map((step, idx) => {
        const Icon = STEP_ICONS[idx];
        const isCompleted = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        const isLast = idx === STATUS_STEPS.length - 1;

        return (
          <div
            key={step.key}
            className={cn(
              'flex',
              vertical ? 'flex-row gap-3' : 'flex-col items-center gap-1 min-w-[100px]',
              interactive && 'cursor-pointer'
            )}
            onClick={() => interactive && onStatusChange?.(step.key)}
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.15 : 1,
                  backgroundColor: isCompleted ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center relative z-10',
                  isCurrent && 'siren-pulse'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5',
                  isCompleted ? 'text-primary-foreground' : 'text-muted-foreground'
                )} />
              </motion.div>
              {vertical && !isLast && (
                <div className={cn(
                  'w-0.5 h-12',
                  isCompleted && idx < currentIdx ? 'bg-primary' : 'bg-muted'
                )} />
              )}
            </div>
            <div className={cn('pt-1', vertical ? 'pb-4' : 'text-center')}>
              <p className={cn(
                'text-sm font-semibold',
                isCompleted ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {step.label}
              </p>
              {vertical && (
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusStepper;
