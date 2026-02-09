import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Shield, Heart, Flame, Zap, Radio, Clock, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <motion.div {...fadeUp()} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">Trusted Response System</span>
          </motion.div>

          {/* Siren */}
          <motion.div {...fadeUp(0.1)} className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center siren-pulse">
                <AlertTriangle className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-primary/10 animate-pulse-ring" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 {...fadeUp(0.2)} className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
            Report Emergencies
            <br />
            <span className="text-gradient">in Seconds.</span>
          </motion.h1>

          <motion.p {...fadeUp(0.3)} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            AI automatically alerts Police, Ambulance, and Fire teams with severity classification & proof verification.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/report">
              <Button size="lg" className="text-base px-8 py-6 gap-2 shadow-lg shadow-primary/25">
                <Zap className="w-5 h-5" />
                Report Emergency
              </Button>
            </Link>
            <Link to="/track/RSQ-2024-0847">
              <Button variant="outline" size="lg" className="text-base px-8 py-6 gap-2">
                <Eye className="w-5 h-5" />
                Track Request
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Three simple steps to get emergency response dispatched.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: 'Describe Incident', desc: 'Type or speak your emergency description. Our AI understands natural language.' },
              { icon: Radio, title: 'Upload Proof', desc: 'Attach photos, videos, or audio. AI verifies and classifies evidence automatically.' },
              { icon: Zap, title: 'AI Routes Instantly', desc: 'AI determines severity, assigns correct teams, and dispatches within seconds.' },
            ].map((step, i) => (
              <motion.div key={i} {...fadeUp(i * 0.15)} className="glass rounded-2xl p-6 text-center group hover:border-primary/30 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-xs font-bold text-primary mb-2">STEP {i + 1}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Multi-Service Classification', desc: 'Police, ambulance, and fire automatically identified.' },
              { icon: AlertTriangle, title: 'Severity Detection', desc: 'AI assesses urgency from low to critical in real-time.' },
              { icon: Zap, title: 'Auto Dispatch', desc: 'Structured dispatch messages generated and sent instantly.' },
              { icon: Clock, title: 'Live Tracking', desc: 'Real-time status updates from report to resolution.' },
            ].map((feat, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="glass rounded-xl p-5 group hover:border-primary/30 transition-colors">
                <feat.icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-1.5 text-sm">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">ResQ AI</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            For real emergencies, always call your local emergency number. This platform supplements but does not replace emergency services.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
