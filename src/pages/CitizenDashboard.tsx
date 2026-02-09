import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import EmergencyCard from '@/components/EmergencyCard';
import { useAuth } from '@/lib/auth-context';
import { demoReports } from '@/lib/demo-data';

const CitizenDashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Hello, {user.name} 👋
          </h1>
          <p className="text-muted-foreground">Report emergencies and track their resolution in real-time.</p>
        </motion.div>

        {/* Action cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <Link to="/report">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 cursor-pointer hover:border-primary/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-1">Report an Emergency</h3>
              <p className="text-sm text-muted-foreground">AI will analyze and route to correct teams.</p>
            </motion.div>
          </Link>
          <Link to={`/track/${demoReports[0].id}`}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 cursor-pointer hover:border-accent/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center mb-4 group-hover:bg-accent/25 transition-colors">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-1">Track Previous Requests</h3>
              <p className="text-sm text-muted-foreground">View live status of your reports.</p>
            </motion.div>
          </Link>
        </div>

        {/* Recent */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Recent Requests
            </h2>
          </div>
          <div className="space-y-3">
            {demoReports.map((report, i) => (
              <EmergencyCard key={report.id} report={report} index={i} />
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CitizenDashboard;
