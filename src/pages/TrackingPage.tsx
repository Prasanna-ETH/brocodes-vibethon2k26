import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Shield, Heart, Flame, Phone, MessageSquare, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import StatusStepper from '@/components/StatusStepper';
import { demoReports } from '@/lib/demo-data';
import { Service, SEVERITY_CONFIG } from '@/lib/types';
import { cn } from '@/lib/utils';

const SERVICE_ICONS: Record<Service, React.ElementType> = { police: Shield, ambulance: Heart, fire: Flame };

const TrackingPage = () => {
  const { id } = useParams();
  const report = demoReports.find(r => r.id === id) || demoReports[0];
  const sev = SEVERITY_CONFIG[report.severity];
  const isCritical = report.severity === 'critical';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Critical banner */}
      {isCritical && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-primary/10 border-b border-primary/20 py-2">
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary siren-pulse" />
            <span className="text-sm font-semibold text-primary">Priority Response Enabled</span>
          </div>
        </div>
      )}

      <main className={cn('max-w-5xl mx-auto px-4 pb-12', isCritical ? 'pt-32' : 'pt-24')}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <code className="text-sm font-mono text-muted-foreground">{report.id}</code>
            <Badge variant="outline" className={cn('border', sev.className)}>{sev.label}</Badge>
            <div className="flex gap-1">
              {report.services.map(s => {
                const Icon = SERVICE_ICONS[s];
                return <Badge key={s} variant="secondary" className="gap-1 text-xs"><Icon className="w-3 h-3" />{s}</Badge>;
              })}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Live Tracking</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{report.location}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{new Date(report.timestamp).toLocaleString()}</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Status stepper */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <div className="glass rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Status Timeline
              </h2>
              <StatusStepper currentStatus={report.status} />
            </div>

            {/* Incident description */}
            <div className="glass rounded-xl p-6 mt-4">
              <h3 className="font-semibold text-foreground mb-3">Incident Details</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{report.description}</p>
              {report.dispatchMessage && (
                <div className="mt-4 bg-secondary/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Dispatch Message</p>
                  <p className="text-sm font-mono text-foreground">{report.dispatchMessage}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Side panel */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            {/* Assigned team */}
            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3 text-sm">Assigned Response Team</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Ambulance Unit A3</p>
                    <p className="text-xs text-muted-foreground">ETA: 8 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-severity-low/15 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-severity-low" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Police Unit T7</p>
                    <p className="text-xs text-muted-foreground">ETA: 12 minutes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="glass rounded-xl p-5 space-y-3">
              <Button variant="outline" className="w-full gap-2 justify-start">
                <Phone className="w-4 h-4" /> Call Support
              </Button>
              <Button variant="outline" className="w-full gap-2 justify-start">
                <MessageSquare className="w-4 h-4" /> Send Extra Details
              </Button>
            </div>

            {/* Reporter */}
            <div className="glass rounded-xl p-5">
              <p className="text-xs text-muted-foreground mb-1">Reported by</p>
              <p className="text-sm font-medium text-foreground">{report.reporterName}</p>
              <p className="text-xs text-muted-foreground mt-1">{report.contact}</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default TrackingPage;
