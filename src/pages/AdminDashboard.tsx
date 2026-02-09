import { useState, Suspense, lazy } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Shield, Activity, CheckCircle2, Clock, Search, Bell, LogOut,
  ChevronRight, Users, BarChart3, Settings, Heart, Flame, Sun, Moon, Filter,
  MapPin, Phone, RefreshCw, ExternalLink, TrendingUp, TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusStepper from '@/components/StatusStepper';
import { EmptyState, TableSkeleton, MapSkeleton } from '@/components/UIHelpers';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from 'next-themes';
import { demoReports } from '@/lib/demo-data';
import { EmergencyReport, Service, SEVERITY_CONFIG, ReportStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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

  const activeReports = reports.filter(r => r.status !== 'resolved');
  const criticalReports = reports.filter(r => r.severity === 'critical' && r.status !== 'resolved');
  
  const stats = [
    { label: 'Active Emergencies', value: activeReports.length, icon: AlertTriangle, color: 'text-primary', bg: 'bg-primary/10', trend: '+2', trendUp: true },
    { label: 'Critical Cases', value: criticalReports.length, icon: Activity, color: 'text-severity-critical', bg: 'bg-severity-critical/10', trend: criticalReports.length > 0 ? 'Needs attention' : 'None', trendUp: false },
    { label: 'Resolved Today', value: reports.filter(r => r.status === 'resolved').length, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', trend: '+5', trendUp: true },
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
    { icon: BarChart3, label: 'Dashboard', key: 'dashboard' },
    { icon: AlertTriangle, label: 'Active Emergencies', key: 'active', badge: activeReports.length },
    { icon: CheckCircle2, label: 'Resolved', key: 'resolved' },
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
          <div className="glass rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground text-sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="lg:hidden flex items-center gap-2 mr-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search reports..."
                className="pl-9 w-40 sm:w-64 h-9"
              />
            </div>
            <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
            </Button>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
            </Button>
            <div className="lg:hidden w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl lg:text-2xl font-bold text-foreground">
              Command Dashboard
            </motion.h1>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Live
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-xl p-4 hover:border-primary/20 transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', stat.bg)}>
                    <stat.icon className={cn('w-5 h-5', stat.color)} />
                  </div>
                  {typeof stat.trend === 'string' && stat.trend.startsWith('+') && (
                    <div className="flex items-center gap-0.5 text-success text-[10px]">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </div>
                  )}
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Critical Alert */}
          <AnimatePresence>
            {criticalReports.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="bg-severity-critical/10 border border-severity-critical/30 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-severity-critical/20 flex items-center justify-center siren-pulse">
                    <AlertTriangle className="w-5 h-5 text-severity-critical" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{criticalReports.length} Critical Emergency Requiring Immediate Attention</p>
                    <p className="text-sm text-muted-foreground">{criticalReports[0]?.location}</p>
                  </div>
                  <Button size="sm" className="shrink-0" onClick={() => setSelectedReport(criticalReports[0])}>
                    View Details
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-4">
            <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="w-32 lg:w-36 h-9 text-xs"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Depts</SelectItem>
                <SelectItem value="police">Police</SelectItem>
                <SelectItem value="ambulance">Ambulance</SelectItem>
                <SelectItem value="fire">Fire</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-28 lg:w-32 h-9 text-xs"><SelectValue placeholder="Severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-28 lg:w-32 h-9 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="on-the-way">On the Way</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            {(filterDept !== 'all' || filterSeverity !== 'all' || filterStatus !== 'all') && (
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => { setFilterDept('all'); setFilterSeverity('all'); setFilterStatus('all'); }}>
                Clear filters
              </Button>
            )}
            <span className="text-xs text-muted-foreground ml-auto hidden sm:block">
              {filteredReports.length} of {reports.length} reports
            </span>
          </div>

          {/* Table */}
          <div className="glass rounded-xl overflow-hidden">
            {filteredReports.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs">Report ID</TableHead>
                    <TableHead className="text-xs">Severity</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">Services</TableHead>
                    <TableHead className="text-xs hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-xs hidden lg:table-cell">Location</TableHead>
                    <TableHead className="text-xs hidden xl:table-cell">Time</TableHead>
                    <TableHead className="text-xs text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report, idx) => {
                    const sev = SEVERITY_CONFIG[report.severity];
                    return (
                      <motion.tr
                        key={report.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className="cursor-pointer hover:bg-secondary/30 border-border group"
                        onClick={() => setSelectedReport(report)}
                      >
                        <TableCell className="font-mono text-xs">{report.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-xs border', sev.className)}>{sev.label}</Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex gap-1">
                            {report.services.map(s => { const Icon = SERVICE_ICONS[s]; return <Icon key={s} className="w-4 h-4 text-muted-foreground" />; })}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="secondary" className="text-[10px] capitalize">{report.status.replace('-', ' ')}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[200px] truncate">{report.location}</TableCell>
                        <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{new Date(report.timestamp).toLocaleTimeString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            View <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                icon={<CheckCircle2 className="w-8 h-8" />}
                title="No reports match filters"
                description="Try adjusting your filters or search query"
                action={<Button variant="outline" size="sm" onClick={() => { setFilterDept('all'); setFilterSeverity('all'); setFilterStatus('all'); setSearchQuery(''); }}>Clear all filters</Button>}
                className="py-16"
              />
            )}
          </div>
        </main>
      </div>

      {/* Detail drawer */}
      <Sheet open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedReport && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm">{selectedReport.id}</span>
                  <Badge variant="outline" className={cn('text-xs border', SEVERITY_CONFIG[selectedReport.severity].className)}>
                    {SEVERITY_CONFIG[selectedReport.severity].label}
                  </Badge>
                  {selectedReport.severity === 'critical' && (
                    <Badge variant="destructive" className="text-[10px] gap-1 animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> CRITICAL
                    </Badge>
                  )}
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Quick Map Preview */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Location</p>
                  <Suspense fallback={<MapSkeleton className="h-[180px]" />}>
                    <LiveMap
                      incidentLocation={{ 
                        ...(LOCATION_COORDS[selectedReport.location] || { lat: 37.7749, lng: -122.4194 }), 
                        address: selectedReport.location 
                      }}
                      responderName="Response Team"
                      eta={8}
                      className="h-[180px]"
                    />
                  </Suspense>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {selectedReport.location}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Description</p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedReport.description}</p>
                </div>

                {/* Services */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Required Services</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedReport.services.map(s => {
                      const Icon = SERVICE_ICONS[s];
                      return (
                        <Badge key={s} variant="secondary" className="gap-1.5 py-1">
                          <Icon className="w-3.5 h-3.5" />{s.charAt(0).toUpperCase() + s.slice(1)}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Dispatch */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">AI Dispatch Message</p>
                  <div className="bg-secondary/50 rounded-lg p-3 text-sm font-mono text-foreground leading-relaxed">{selectedReport.dispatchMessage}</div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Victims</p>
                    <p className="text-lg font-bold text-foreground mt-1">{selectedReport.victims}</p>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Reporter</p>
                    <p className="text-sm font-medium text-foreground mt-1">{selectedReport.reporterName}</p>
                  </div>
                  <div className="glass rounded-lg p-3 col-span-2">
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-medium text-foreground">{selectedReport.contact}</p>
                      <Button variant="ghost" size="sm" className="text-xs gap-1">
                        <Phone className="w-3 h-3" /> Call
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Status update */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Update Status</p>
                  <StatusStepper
                    currentStatus={selectedReport.status}
                    onStatusChange={(s) => handleStatusUpdate(selectedReport.id, s)}
                    interactive
                  />
                </div>

                {/* Forward buttons */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Forward to Team</p>
                  <div className="flex gap-2 flex-wrap">
                    {(['Police Unit P4', 'Ambulance A3', 'Fire Unit F2']).map(team => (
                      <Button key={team} variant="outline" size="sm" className="text-xs" onClick={() => toast.success(`Forwarded to ${team}`)}>
                        {team}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Open full tracking */}
                <Link to={`/track/${selectedReport.id}`}>
                  <Button variant="secondary" className="w-full gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Open Full Tracking View
                  </Button>
                </Link>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminDashboard;
