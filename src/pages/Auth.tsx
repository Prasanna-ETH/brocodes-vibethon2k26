import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Eye, EyeOff, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/language-context';

type Role = 'citizen' | 'admin';
type Mode = 'login' | 'signup';

const Auth = () => {
  const [role, setRole] = useState<Role>('citizen');
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (mode === 'signup') {
      if (!name) { toast.error('Please enter your name'); return; }
      signup(name, email, password);
      toast.success('Account created successfully!');
      navigate('/home');
    } else {
      login(email, password, role);
      toast.success(`Welcome back!`);
      navigate(role === 'admin' ? '/admin' : '/home');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary/30 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 -right-20 w-60 h-60 bg-accent/8 rounded-full blur-[80px]" />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-8 siren-pulse">
            <AlertTriangle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground mb-4">ResQ AI</h1>
          <p className="text-lg text-muted-foreground max-w-md">{t('auth.subtitle')}</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">ResQ AI</span>
          </div>

          {/* Role toggle */}
          <div className="flex rounded-xl glass p-1 mb-8">
            {([
              { key: 'citizen' as Role, icon: User, label: t('auth.citizen_login') },
              { key: 'admin' as Role, icon: Shield, label: t('auth.responder_login') },
            ]).map(r => (
              <button
                key={r.key}
                onClick={() => { setRole(r.key); setMode('login'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[11px] sm:text-sm font-medium transition-all ${role === r.key
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <r.icon className="w-4 h-4" />
                {r.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${role}-${mode}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {role === 'admin' ? 'Secure Login' : mode === 'signup' ? t('auth.create_account') : t('auth.welcome_back')}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {role === 'admin' ? 'Authorized responders only.' : mode === 'signup' ? 'Register to report emergencies.' : 'Sign in to your account.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && role === 'citizen' && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Full Name</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="mt-1.5" />
                  </div>
                )}
                <div>
                  <Label className="text-sm text-muted-foreground">{role === 'admin' ? 'Admin Email / ID' : t('auth.email')}</Label>
                  <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('auth.password')}</Label>
                  <div className="relative mt-1.5">
                    <Input
                      value={password}
                      onChange={password => setPassword(password.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full py-5">
                  {role === 'admin' ? 'Secure Login' : mode === 'signup' ? t('auth.create_account') : t('auth.login')}
                </Button>

                {/* Demo Logins */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-[10px] sm:text-xs h-10 gap-1 sm:gap-1.5 px-1 sm:px-2"
                    onClick={() => {
                      login('citizen@demo.com', 'password', 'citizen');
                      toast.success('Logged in as Citizen');
                      navigate('/home');
                    }}
                  >
                    <User className="w-3.5 h-3.5" /> {t('auth.demo.citizen')}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-[10px] sm:text-xs h-10 gap-1 sm:gap-1.5 px-1 sm:px-2"
                    onClick={() => {
                      login('admin@resq.ai', 'password', 'admin');
                      toast.success('Logged in as Admin');
                      navigate('/admin');
                    }}
                  >
                    <Shield className="w-3.5 h-3.5" /> {t('auth.demo.admin')}
                  </Button>
                </div>

                {role === 'citizen' && (
                  <>
                    <div className="relative flex items-center justify-center my-4">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                      <span className="relative bg-background px-3 text-xs text-muted-foreground">or</span>
                    </div>
                    <Button type="button" variant="outline" className="w-full" disabled>
                      Continue with Google
                    </Button>
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      {mode === 'login' ? (
                        <>Don't have an account? <button type="button" onClick={() => setMode('signup')} className="text-primary hover:underline font-medium">Create account</button></>
                      ) : (
                        <>Already registered? <button type="button" onClick={() => setMode('login')} className="text-primary hover:underline font-medium">Login</button></>
                      )}
                    </p>
                  </>
                )}

                {role === 'admin' && (
                  <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" /> Authorized responders only. Unauthorized access is prohibited.
                  </p>
                )}
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Auth;
