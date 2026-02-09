import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Heart, Flame, Zap, Radio, Clock, FileText, Eye, CheckCircle2, Users, Smartphone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/lib/language-context';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const Landing = () => {
  const { t } = useLanguage();

  const stats = [
    { value: '< 30s', label: t('dash.stats.avg_response') },
    { value: '99.9%', label: 'System Uptime' },
    { value: '24/7', label: 'Always Available' },
    { value: '3+', label: 'Service Departments' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
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
            {t('landing.title').includes('Seconds') ? (
              <>
                Report Emergencies
                <br />
                <span className="text-gradient">in Seconds.</span>
              </>
            ) : (
              <span className="text-gradient">{t('landing.title')}</span>
            )}
          </motion.h1>

          <motion.p {...fadeUp(0.3)} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('landing.subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/report">
              <Button size="lg" className="text-base px-8 py-6 gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                <Zap className="w-5 h-5" />
                {t('dash.report_emergency')}
              </Button>
            </Link>
            <Link to="/track/RSQ-2024-0847">
              <Button variant="outline" size="lg" className="text-base px-8 py-6 gap-2 hover:bg-secondary/50 transition-colors">
                <Eye className="w-5 h-5" />
                {t('landing.track_request')}
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp(0.5)} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t('landing.how_it_works')}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Three simple steps to get emergency response dispatched.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: 'Describe Incident', desc: 'Type or speak your emergency description. Our AI understands natural language.' },
              { icon: Radio, title: 'Upload Proof', desc: 'Attach photos, videos, or audio. AI verifies and classifies evidence automatically.' },
              { icon: Zap, title: 'AI Routes Instantly', desc: 'AI determines severity, assigns correct teams, and dispatches within seconds.' },
            ].map((step, i) => (
              <motion.div key={i} {...fadeUp(i * 0.15)} className="glass rounded-2xl p-6 text-center group hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t('landing.features')}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Built with cutting-edge AI technology for rapid emergency response.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Multi-Service Classification', desc: 'Police, ambulance, and fire automatically identified.' },
              { icon: AlertTriangle, title: 'Severity Detection', desc: 'AI assesses urgency from low to critical in real-time.' },
              { icon: Zap, title: 'Auto Dispatch', desc: 'Structured dispatch messages generated and sent instantly.' },
              { icon: Clock, title: 'Live Tracking', desc: 'Real-time status updates from report to resolution.' },
            ].map((feat, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="glass rounded-xl p-5 group hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <feat.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5 text-sm">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="glass rounded-2xl p-8 md:p-12 text-center">
            <div className="flex justify-center gap-4 mb-6">
              {[CheckCircle2, Users, Smartphone, Globe].map((Icon, i) => (
                <div key={i} className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              ))}
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">{t('landing.trusted')}</h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Our AI-powered platform is designed to work seamlessly with existing emergency infrastructure, providing faster response times and better outcomes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth">
                <Button variant="outline" className="gap-2">
                  <Users className="w-4 h-4" />
                  Join as Responder
                </Button>
              </Link>
              <Link to="/report">
                <Button className="gap-2">
                  {t('landing.get_started')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">ResQ AI</span>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              For real emergencies, always call your local emergency number. This platform supplements but does not replace emergency services.
            </p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-xs text-muted-foreground/60">© 2024 ResQ AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
