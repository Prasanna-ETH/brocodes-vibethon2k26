import { useState, Suspense, lazy } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Shield, Activity, CheckCircle2, Clock, Search, Bell, LogOut,
  ChevronRight, Users, BarChart3, Settings, Heart, Flame, Sun, Moon, Filter,
  MapPin, Phone, RefreshCw, ExternalLink, TrendingUp, Languages
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import StatusStepper from '@/components/StatusStepper';
import { EmptyState, TableSkeleton, MapSkeleton } from '@/components/UIHelpers';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from 'next-themes';
import { demoReports } from '@/lib/demo-data';
import { EmergencyReport, Service, SEVERITY_CONFIG, ReportStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';

const LiveMap = lazy(() => import('@/components/LiveMap'));

const SERVICE_ICONS: Record<Service, React.ElementType> = { police: Shield, ambulance: Heart, fire: Flame };

const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  'Highway 101, Mile Marker 45, Northbound': { lat: 37.7749, lng: -122.4194 },
  '742 Maple Avenue, Apt 3B, Downtown': { lat: 40.7128, lng: -74.0060 },
  '1200 Commerce Blvd, Tech Zone Mall': { lat: 34.0522, lng: -118.2437 },
  'Oak Street & 5th Avenue Intersection': { lat: 41.8781, lng: -87.6298 },
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [reports, setReports] = useState(demoReports);
  const [selectedReport, setSelectedReport] = useState<EmergencyReport | null>(null);
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!user) return <Navigate to="/auth" replace />;

  const filteredReports = reports.filter(r => {
    if (filterDept !== 'all' && !r.services.includes(filterDept as Service)) return false;
    if (filterSeverity !== 'all' && r.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeReportsCount = reports.filter(r => r.status !== 'resolved').length;
  const criticalReports = reports.filter(r => r.severity === 'critical' && r.status !== 'resolved');

  const stats = [
    { label: t('dash.active_reports'), value: activeReportsCount, icon: AlertTriangle, color: 'text-primary', bg: 'bg-primary/10', trend: '+2', trendUp: true },
    { label: 'Critical Cases', value: criticalReports.length, icon: Activity, color: 'text-severity-critical', bg: 'bg-severity-critical/10', trend: criticalReports.length > 0 ? 'Needs attention' : 'None', trendUp: false },
    { label: t('dash.resolved'), value: reports.filter(r => r.status === 'resolved').length, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', trend: '+5', trendUp: true },
    { label: 'Avg Response', value: '8 min', icon: Clock, color: 'text-accent', bg: 'bg-accent/10', trend: '-2 min', trendUp: true },
  ];

  const handleStatusUpdate = (reportId: string, newStatus: ReportStatus) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
    setSelectedReport(prev => prev && prev.id === reportId ? { ...prev, status: newStatus } : prev);
    toast.success('Status updated successfully');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Dashboard refreshed');
    }, 1000);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const navItems = [
    { icon: BarChart3, label: t('nav.dashboard'), key: 'dashboard' },
    { icon: AlertTriangle, label: t('dash.active_reports'), key: 'active', badge: activeReportsCount },
    { icon: Users, label: 'Teams', key: 'teams' },
    { icon: Settings, label: 'Settings', key: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border">
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-sm text-foreground">ResQ AI</span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Command Center</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveNav(item.key)}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all',
                activeNav === item.key
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">{item.badge}</Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground text-sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> {t('nav.logout')}
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search reports..."
                className="pl-9 w-40 sm:w-64 h-9"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
            </Button>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 px-2"
            >
              <Languages className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">{language}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl lg:text-2xl font-bold text-foreground capitalize">
              {activeNav} Center
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Live System
            </div>
          </div>

          <Tabs value={activeNav} onValueChange={setActiveNav} className="w-full">
            <TabsContent value="dashboard" className="mt-0 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {stats.map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', stat.bg)}>
                        <stat.icon className={cn('w-5 h-5', stat.color)} />
                      </div>
                      {stat.trendUp && <TrendingUp className="w-3 h-3 text-success" />}
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Critical Alert */}
              <AnimatePresence>
                {criticalReports.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }} className="bg-severity-critical/10 border border-severity-critical/30 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-severity-critical/20 flex items-center justify-center siren-pulse">
                      <AlertTriangle className="w-5 h-5 text-severity-critical" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Critical: {criticalReports[0].description.slice(0, 60)}...</p>
                      <p className="text-xs text-muted-foreground">{criticalReports[0].location}</p>
                    </div>
                    <Button size="sm" onClick={() => setSelectedReport(criticalReports[0])}>Dispatch</Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <Select value={filterDept} onValueChange={setFilterDept}>
                  <SelectTrigger className="w-32 h-9 text-xs"><SelectValue placeholder="Dept" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Depts</SelectItem>
                    <SelectItem value="police">Police</SelectItem>
                    <SelectItem value="ambulance">Ambulance</SelectItem>
                    <SelectItem value="fire">Fire</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-32 h-9 text-xs"><SelectValue placeholder="Severity" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Level</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground ml-auto">{filteredReports.length} reports</span>
              </div>

              {/* Table */}
              <div className="glass rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-xs">ID</TableHead>
                      <TableHead className="text-xs">Severity</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">Status</TableHead>
                      <TableHead className="text-xs text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id} className="cursor-pointer border-border" onClick={() => setSelectedReport(report)}>
                        <TableCell className="font-mono text-xs">{report.id}</TableCell>
                        <TableCell><Badge variant="outline" className={cn('text-[10px]', SEVERITY_CONFIG[report.severity].className)}>{report.severity}</Badge></TableCell>
                        <TableCell className="hidden md:table-cell capitalize text-xs">{report.status.replace('-', ' ')}</TableCell>
                        <TableCell className="text-right"><Button variant="ghost" size="sm" className="h-8 text-xs">View</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="teams" className="mt-0">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Police Local P1', status: 'On Duty', icon: Shield, color: 'text-blue-500' },
                  { name: 'Ambulance A3', status: 'Responding', icon: Heart, color: 'text-red-500' },
                  { name: 'Fire Unit F2', status: 'Available', icon: Flame, color: 'text-orange-500' },
                ].map((team, i) => (
                  <div key={i} className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn("w-10 h-10 rounded-lg bg-background flex items-center justify-center", team.color)}>
                        <team.icon className="w-5 h-5" />
                      </div>
                      <Badge variant={team.status === 'Responding' ? 'destructive' : 'secondary'} className="text-[10px]">{team.status}</Badge>
                    </div>
                    <h3 className="font-bold text-sm">{team.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Ready for dispatch</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <div className="glass rounded-xl p-6 max-w-md">
                <h3 className="font-bold mb-4">Command Settings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span>Auto-Dispatch (Critical)</span>
                    <Badge variant="outline" className="text-success border-success/30">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>AI Analysis Precision</span>
                    <span className="font-mono font-bold">98.2%</span>
                  </div>
                  <Button className="w-full mt-4">Save Configuration</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Detail drawer */}
      <Sheet open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedReport && (
            <div className="space-y-6 pt-4">
              <SheetHeader>
                <SheetTitle className="font-mono text-sm">{selectedReport.id}</SheetTitle>
              </SheetHeader>
              <div>
                <Label className="text-xs uppercase text-muted-foreground">Status Update</Label>
                <StatusStepper
                  currentStatus={selectedReport.status}
                  onStatusChange={(s) => handleStatusUpdate(selectedReport.id, s)}
                  interactive
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground">Description</Label>
                <p className="text-sm border rounded-lg p-3 bg-secondary/20">{selectedReport.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <span className="text-[10px] uppercase text-muted-foreground block">Location</span>
                  <span className="text-xs font-medium">{selectedReport.location}</span>
                </div>
                <div className="border rounded-lg p-3">
                  <span className="text-[10px] uppercase text-muted-foreground block">Contact</span>
                  <span className="text-xs font-medium">{selectedReport.contact}</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => setSelectedReport(null)}>Close Details</Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminDashboard;
