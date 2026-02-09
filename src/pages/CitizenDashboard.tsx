import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Plus, Bell, Settings, ChevronRight, Search, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import EmergencyCard from '@/components/EmergencyCard';
import { EmptyState } from '@/components/UIHelpers';
import { useAuth } from '@/lib/auth-context';
import { demoReports } from '@/lib/demo-data';
import { useLanguage } from '@/lib/language-context';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  if (!user) return <Navigate to="/auth" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;

  const filteredReports = demoReports.filter(r => {
    if (activeTab === 'active' && r.status === 'resolved') return false;
    if (activeTab === 'resolved' && r.status !== 'resolved') return false;
    if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeCount = demoReports.filter(r => r.status !== 'resolved').length;
  const resolvedCount = demoReports.filter(r => r.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 pt-24 pb-12">
        {/* Welcome header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              {t('dash.welcome')}, {user.name} 👋
            </h1>
            <p className="text-muted-foreground">{t('dash.report_desc')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: t('dash.active_reports'), value: activeCount, color: 'text-primary' },
            { label: t('dash.resolved'), value: resolvedCount, color: 'text-success' },
            { label: t('dash.stats.this_month'), value: demoReports.length, color: 'text-accent' },
            { label: t('dash.stats.avg_response'), value: '8 min', color: 'text-muted-foreground' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Action cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            <Link to="/report">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass rounded-2xl p-6 cursor-pointer hover:border-primary/40 transition-all group h-full"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 group-hover:scale-110 transition-all">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-1">{t('dash.report_emergency')}</h3>
                <p className="text-sm text-muted-foreground">{t('dash.report_desc')}</p>
              </motion.div>
            </Link>
            <Link to={`/track/${demoReports[0].id}`}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass rounded-2xl p-6 cursor-pointer hover:border-accent/40 transition-all group h-full"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center mb-4 group-hover:bg-accent/25 group-hover:scale-110 transition-all">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-1">{t('dash.track_previous')}</h3>
                <p className="text-sm text-muted-foreground">{t('dash.track_desc')}</p>
              </motion.div>
            </Link>
          </div>

          {/* Live Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                {t('dash.community_alerts')}
              </h3>
              <Badge variant="secondary" className="text-[10px]">Nearby</Badge>
            </div>
            <div className="space-y-4">
              {[
                { time: '2m ago', label: 'Road Work', desc: 'Avoid Main St intersection.' },
                { time: '15m ago', label: 'Utility Alert', desc: 'Power restoration on 5th Ave.' },
                { time: '1h ago', label: 'Weather', desc: 'Heavy rain expected by 4 PM.' },
              ].map((alert, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <div className="text-muted-foreground whitespace-nowrap">{alert.time}</div>
                  <div>
                    <div className="font-medium text-foreground">{alert.label}</div>
                    <div className="text-muted-foreground text-[11px] leading-tight">{alert.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reports section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              {t('dash.your_reports')}
            </h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('dash.search_placeholder')}
                  className="pl-9 w-full sm:w-48"
                />
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All ({demoReports.length})</TabsTrigger>
              <TabsTrigger value="active" className="text-xs sm:text-sm">{t('dash.active_reports') === 'Active Reports' ? 'Active' : 'செயலில்'} ({activeCount})</TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs sm:text-sm">{t('dash.resolved')} ({resolvedCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {filteredReports.length > 0 ? (
                <div className="space-y-3">
                  {filteredReports.map((report, i) => (
                    <EmergencyCard key={report.id} report={report} index={i} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<CheckCircle2 className="w-8 h-8" />}
                  title={activeTab === 'resolved' ? 'No resolved reports' : 'No reports found'}
                  description={searchQuery ? 'Try a different search term' : activeTab === 'active' ? 'All your emergencies have been resolved!' : 'You haven\'t submitted any emergency reports yet.'}
                  action={
                    !searchQuery && activeTab !== 'resolved' && (
                      <Link to="/report">
                        <Button className="gap-2">
                          <Plus className="w-4 h-4" />
                          {t('dash.report_emergency')}
                        </Button>
                      </Link>
                    )
                  }
                />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default CitizenDashboard;
