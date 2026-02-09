import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, MapPin, Upload, Users, Phone, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import AIPreviewPanel from '@/components/AIPreviewPanel';
import { demoPresets } from '@/lib/demo-data';
import { Service, Severity } from '@/lib/types';
import { cn } from '@/lib/utils';

const ReportEmergency = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [victims, setVictims] = useState(0);
  const [contact, setContact] = useState('');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  // AI predictions based on description
  const predictions = useMemo(() => {
    const desc = description.toLowerCase();
    const services: Service[] = [];
    let severity: Severity = 'low';
    if (desc.includes('fire') || desc.includes('flame') || desc.includes('smoke') || desc.includes('burning')) services.push('fire');
    if (desc.includes('injur') || desc.includes('hurt') || desc.includes('bleed') || desc.includes('accident') || desc.includes('collision') || desc.includes('medical')) services.push('ambulance');
    if (desc.includes('theft') || desc.includes('robb') || desc.includes('police') || desc.includes('break-in') || desc.includes('suspect') || desc.includes('weapon') || desc.includes('accident') || desc.includes('collision')) services.push('police');
    if (services.length === 0 && description.length > 10) services.push('police');

    if (desc.includes('critical') || desc.includes('life-threatening') || desc.includes('explosion') || victims >= 5) severity = 'critical';
    else if (desc.includes('severe') || desc.includes('major') || desc.includes('serious') || victims >= 3) severity = 'high';
    else if (desc.includes('minor') || desc.includes('small') || victims === 0) severity = 'low';
    else severity = 'medium';

    const serviceLabels = services.map(s => s === 'police' ? 'Police' : s === 'ambulance' ? 'Ambulance' : 'Fire Dept').join(' + ');
    const dispatchMessage = description.length > 10
      ? `${severity.toUpperCase()} ALERT: ${description.slice(0, 120)}... Location: ${location || 'Pending'}. ${victims > 0 ? `${victims} victim(s) reported.` : ''} Dispatching ${serviceLabels}. Contact: ${contact || 'N/A'}.`
      : '';

    return { services: [...new Set(services)], severity, dispatchMessage };
  }, [description, location, victims, contact]);

  const handleDemoFill = (presetIdx: number) => {
    const p = demoPresets[presetIdx];
    setDescription(p.description);
    setLocation(p.location);
    setVictims(p.victims);
    setContact(p.contact);
    setFiles(['evidence_photo_01.jpg', 'scene_video.mp4']);
  };

  const handleSubmit = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      navigate('/submitted', { state: { report: { id: `RSQ-${Date.now()}`, description, location, victims, contact, ...predictions } } });
    }, 2500);
  };

  return (
    <div className={cn('min-h-screen bg-background transition-all', emergencyMode && 'bg-primary/5')}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Report Emergency</h1>
            <p className="text-muted-foreground mt-1">Describe the situation. AI will analyze and route your report.</p>
          </div>
          <div className="flex items-center gap-3">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Zap className={cn('w-4 h-4', emergencyMode ? 'text-primary' : 'text-muted-foreground')} />
              Emergency Mode
            </Label>
            <Switch checked={emergencyMode} onCheckedChange={setEmergencyMode} />
          </div>
        </motion.div>

        {/* Demo presets */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs text-muted-foreground self-center mr-1">Demo Fill:</span>
          {demoPresets.map((p, i) => (
            <Badge
              key={i}
              variant="outline"
              className="cursor-pointer hover:bg-secondary transition-colors"
              onClick={() => handleDemoFill(i)}
            >
              {p.name}
            </Badge>
          ))}
        </motion.div>

        {/* Two columns */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-3 space-y-5">
            <div className="glass rounded-xl p-6 space-y-5">
              {/* Description */}
              <div>
                <Label className="text-sm text-muted-foreground">Incident Description *</Label>
                <Textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the emergency in detail..."
                  className={cn('mt-1.5 min-h-[140px] resize-none', emergencyMode && 'text-lg')}
                />
              </div>

              {/* Upload */}
              <div>
                <Label className="text-sm text-muted-foreground">Upload Evidence</Label>
                <div
                  className="mt-1.5 border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors"
                  onClick={() => setFiles(['evidence_photo.jpg', 'scene_recording.mp4'])}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Images, videos up to 50MB</p>
                </div>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {files.map((f, i) => (
                      <Badge key={i} variant="secondary" className="text-xs gap-1">
                        📎 {f}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <Label className="text-sm text-muted-foreground">Location</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter address or landmark" className="flex-1" />
                  <Button variant="outline" size="icon" onClick={() => setLocation('Main Street & 5th Ave (Auto-detected)')}>
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Victims & Contact */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Victims Count</Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setVictims(Math.max(0, victims - 1))}>-</Button>
                    <span className="w-10 text-center font-semibold text-foreground">{victims}</span>
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setVictims(Math.min(10, victims + 1))}>+</Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Contact Number</Label>
                  <Input value={contact} onChange={e => setContact(e.target.value)} placeholder="+1 (555) 000-0000" className="mt-1.5" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={description.length < 10}
              className={cn('w-full py-6 text-base gap-2', emergencyMode && 'text-lg py-8')}
              size="lg"
            >
              <Sparkles className="w-5 h-5" />
              Analyze & Submit
            </Button>
          </motion.div>

          {/* AI Preview */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="lg:col-span-2">
            <AIPreviewPanel
              description={description}
              predictedServices={predictions.services}
              predictedSeverity={predictions.severity}
              dispatchMessage={predictions.dispatchMessage}
            />
          </motion.div>
        </div>
      </main>

      {/* Analyzing modal */}
      <AnimatePresence>
        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-strong rounded-2xl p-8 text-center max-w-sm mx-4 w-full"
            >
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4 siren-pulse">
                <AlertTriangle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">AI Analysis in Progress</h3>

              <div className="space-y-3 mb-6">
                {[
                  'Extracting incident keywords...',
                  'Verifying evidence authenticity...',
                  'Classifying severity level...',
                  'Identifying optimal response units...',
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.5 }}
                    className="flex items-center gap-2 text-xs text-left"
                  >
                    <div className="w-4 h-4 rounded-full border border-primary/30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    </div>
                    <span className="text-muted-foreground">{step}</span>
                  </motion.div>
                ))}
              </div>

              <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportEmergency;
