import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Share2, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useState } from 'react';

const SubmissionSuccess = () => {
  const location = useLocation();
  const report = (location.state as any)?.report;
  const trackingId = report?.id || `RSQ-${Date.now()}`;
  const dispatch = report?.dispatchMessage || 'Emergency report submitted. Dispatch team notified. Standby for updates.';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(dispatch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 pt-24 pb-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-success" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl font-bold text-foreground mb-2">
          Emergency Request Submitted
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-muted-foreground mb-2">
          Your report has been received and dispatched to response teams.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex items-center gap-2 mb-8">
          <span className="text-sm text-muted-foreground">Tracking ID:</span>
          <code className="font-mono text-sm text-primary bg-primary/10 px-3 py-1 rounded-lg">{trackingId}</code>
        </motion.div>

        {/* Dispatch message */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full glass rounded-xl p-5 mb-8 text-left">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">AI-Generated Dispatch Message</p>
          <p className="text-sm text-foreground font-mono leading-relaxed">{dispatch}</p>
          <Button variant="ghost" size="sm" className="mt-3 text-muted-foreground" onClick={handleCopy}>
            {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied!' : 'Copy message'}
          </Button>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-3 w-full">
          <Link to={`/track/${trackingId}`} className="flex-1">
            <Button className="w-full gap-2">Track Live Status</Button>
          </Link>
          <Button variant="outline" className="flex-1 gap-2" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/track/${trackingId}`)}>
            <Share2 className="w-4 h-4" /> Share Tracking Link
          </Button>
          <Link to="/report" className="flex-1">
            <Button variant="secondary" className="w-full gap-2"><Plus className="w-4 h-4" /> Report Another</Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default SubmissionSuccess;
