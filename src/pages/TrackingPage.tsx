import { useParams } from 'react-router-dom';
import { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Shield, Heart, Flame, Phone, MessageSquare, AlertTriangle, Share2, Copy, Check, Navigation, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import StatusStepper from '@/components/StatusStepper';
import { MapSkeleton } from '@/components/UIHelpers';
import { demoReports } from '@/lib/demo-data';
import { Service, SEVERITY_CONFIG } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const LiveMap = lazy(() => import('@/components/LiveMap'));

const SERVICE_ICONS: Record<Service, React.ElementType> = { police: Shield, ambulance: Heart, fire: Flame };

// Demo coordinates for locations
const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  'Highway 101, Mile Marker 45, Northbound': { lat: 37.7749, lng: -122.4194 },
  '742 Maple Avenue, Apt 3B, Downtown': { lat: 40.7128, lng: -74.0060 },
  '1200 Commerce Blvd, Tech Zone Mall': { lat: 34.0522, lng: -118.2437 },
  'Oak Street & 5th Avenue Intersection': { lat: 41.8781, lng: -87.6298 },
};

const TrackingPage = () => {
  const { id } = useParams();
  const report = demoReports.find(r => r.id === id) || demoReports[0];
  const sev = SEVERITY_CONFIG[report.severity];
  const isCritical = report.severity === 'critical';
  const [copied, setCopied] = useState(false);
  const [extraDetails, setExtraDetails] = useState('');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const coords = LOCATION_COORDS[report.location] || { lat: 37.7749, lng: -122.4194 };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/track/${report.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Tracking link copied!');
  };

  const handleSendDetails = () => {
    if (extraDetails.trim()) {
      toast.success('Extra details sent to response team');
      setExtraDetails('');
      setDetailsDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Critical banner */}
      <AnimatePresence>
        {isCritical && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-primary/10 border-b border-primary/20 py-2"
          >
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary siren-pulse" />
              <span className="text-sm font-semibold text-primary">Priority Response Enabled</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={cn('max-w-6xl mx-auto px-4 pb-12', isCritical ? 'pt-32' : 'pt-24')}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <code className="text-sm font-mono text-muted-foreground">{report.id}</code>
            <Badge variant="outline" className={cn('border', sev.className)}>{sev.label}</Badge>
            <div className="flex gap-1">
              {report.services.map(s => {
                const Icon = SERVICE_ICONS[s];
                return <Badge key={s} variant="secondary" className="gap-1 text-xs"><Icon className="w-3 h-3" />{s}</Badge>;
              })}
            </div>
            <Button variant="ghost" size="sm" className="ml-auto text-xs gap-1" onClick={handleCopyLink}>
              {copied ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Share'}
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Live Tracking</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{report.location}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{new Date(report.timestamp).toLocaleString()}</span>
            {report.victims > 0 && (
              <span className="flex items-center gap-1"><Users className="w-4 h-4" />{report.victims} victim(s)</span>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Map + Stepper */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-4">
            {/* Live Map */}
            <div className="glass rounded-xl p-4">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                Live Responder Location
              </h2>
              <Suspense fallback={<MapSkeleton className="h-[350px]" />}>
                <LiveMap
                  incidentLocation={{ ...coords, address: report.location }}
                  responderName="Ambulance Unit A3"
                  eta={8}
                  className="h-[350px]"
                />
              </Suspense>
            </div>

            {/* Status Timeline */}
            <div className="glass rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Status Timeline
              </h2>
              <StatusStepper currentStatus={report.status} />
            </div>

            {/* Incident description */}
            <div className="glass rounded-xl p-6">
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

          {/* Right column - Side panel */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            {/* Assigned team */}
            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3 text-sm">Assigned Response Team</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center relative">
                    <Heart className="w-5 h-5 text-primary" />
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-card" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Ambulance Unit A3</p>
                    <p className="text-xs text-muted-foreground">ETA: 8 minutes</p>
                  </div>
                  <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">Active</Badge>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-severity-low/15 flex items-center justify-center relative">
                    <Shield className="w-5 h-5 text-severity-low" />
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-card" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Police Unit T7</p>
                    <p className="text-xs text-muted-foreground">ETA: 12 minutes</p>
                  </div>
                  <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">Active</Badge>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-foreground mb-1 text-sm">Quick Actions</h3>
              <Button variant="outline" className="w-full gap-2 justify-start hover:border-primary/50 transition-colors">
                <Phone className="w-4 h-4" /> Call Support Line
              </Button>
              <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full gap-2 justify-start hover:border-primary/50 transition-colors">
                    <MessageSquare className="w-4 h-4" /> Send Extra Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Additional Information</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <Textarea
                      value={extraDetails}
                      onChange={(e) => setExtraDetails(e.target.value)}
                      placeholder="Provide any additional details that might help the response team..."
                      className="min-h-[120px]"
                    />
                    <Button onClick={handleSendDetails} className="w-full" disabled={!extraDetails.trim()}>
                      Send to Response Team
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" className="w-full gap-2 justify-start text-muted-foreground" onClick={handleCopyLink}>
                <Copy className="w-4 h-4" /> Copy Tracking Link
              </Button>
            </div>

            {/* Reporter info */}
            <div className="glass rounded-xl p-5">
              <p className="text-xs text-muted-foreground mb-1">Reported by</p>
              <p className="text-sm font-medium text-foreground">{report.reporterName}</p>
              <p className="text-xs text-muted-foreground mt-1">{report.contact}</p>
            </div>

            {/* Live updates indicator */}
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-success animate-ping" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Live Updates Active</p>
                <p className="text-xs text-muted-foreground">Auto-refreshing every 30s</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default TrackingPage;
