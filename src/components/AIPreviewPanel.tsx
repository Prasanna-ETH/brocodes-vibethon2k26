import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Heart, Flame, Copy, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Severity, Service, SEVERITY_CONFIG } from '@/lib/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const SERVICE_ICONS: Record<Service, { icon: React.ElementType; label: string }> = {
  police: { icon: Shield, label: 'Police' },
  ambulance: { icon: Heart, label: 'Ambulance' },
  fire: { icon: Flame, label: 'Fire Dept' },
};

interface AIPreviewPanelProps {
  description: string;
  predictedServices: Service[];
  predictedSeverity: Severity;
  dispatchMessage: string;
}

const AIPreviewPanel = ({ description, predictedServices, predictedSeverity, dispatchMessage }: AIPreviewPanelProps) => {
  const [copied, setCopied] = useState(false);
  const sev = SEVERITY_CONFIG[predictedSeverity];
  const hasContent = description.length > 10;

  const handleCopy = () => {
    navigator.clipboard.writeText(dispatchMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-strong rounded-xl p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-foreground">AI Analysis Preview</h3>
      </div>

      <AnimatePresence mode="wait">
        {hasContent ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Services */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Predicted Services</p>
              <div className="flex gap-2 flex-wrap">
                {predictedServices.map(s => {
                  const { icon: Icon, label } = SERVICE_ICONS[s];
                  return (
                    <motion.div
                      key={s}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm"
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Severity */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Predicted Severity</p>
              <Badge variant="outline" className={cn('text-sm border px-3 py-1', sev.className)}>
                {sev.label}
              </Badge>
            </div>

            {/* Dispatch Message */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Generated Dispatch Message</p>
              <div className="bg-secondary/50 rounded-lg p-3 text-sm text-foreground font-mono leading-relaxed">
                {dispatchMessage}
              </div>
              <Button variant="ghost" size="sm" className="mt-2 text-muted-foreground" onClick={handleCopy}>
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied!' : 'Copy message'}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Sparkles className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">Start describing your emergency</p>
              <p className="text-xs mt-1 opacity-60">AI will analyze in real-time</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIPreviewPanel;
