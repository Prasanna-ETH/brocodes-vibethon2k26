import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle, Shield, Activity, CheckCircle2, Clock, Search, Bell, LogOut,
  ChevronRight, Users, BarChart3, Settings, Heart, Flame, Sun, Moon, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusStepper from '@/components/StatusStepper';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from 'next-themes';
import { demoReports } from '@/lib/demo-data';
import { EmergencyReport, Service, SEVERITY_CONFIG, ReportStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const SERVICE_ICONS: Record<Service, React.ElementType> = { police: Shield, ambulance: Heart, fire: Flame };

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [reports, setReports] = useState(demoReports);
  const [selectedReport, setSelectedReport] = useState<EmergencyReport | null>(null);
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return <Navigate to="/auth" replace />;

  const filteredReports = reports.filter(r => {
    if (filterDept !== 'all' && !r.services.includes(filterDept as Service)) return false;
    if (filterSeverity !== 'all' && r.severity !== filterSeverity) return false;
    if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = [
    { label: 'Active Emergencies', value: reports.filter(r => r.status !== 'resolved').length, icon: AlertTriangle, color: 'text-primary' },
    { label: 'Critical Cases', value: reports.filter(r => r.severity === 'critical').length, icon: Activity, color: 'text-severity-critical' },
    { label: 'Resolved Today', value: reports.filter(r => r.status === 'resolved').length, icon: CheckCircle2, color: 'text-success' },
    { label: 'Avg Response', value: '8 min', icon: Clock, color: 'text-accent' },
  ];

  const handleStatusUpdate = (reportId: string, newStatus: ReportStatus) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
    setSelectedReport(prev => prev && prev.id === reportId ? { ...prev, status: newStatus } : prev);
    toast.success('Status updated successfully');
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-sm text-foreground">ResQ AI</span>
            <p className="text-xs text-muted-foreground">Command Center</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {[
            { icon: BarChart3, label: 'Dashboard', active: true },
            { icon: AlertTriangle, label: 'Active Emergencies' },
            { icon: CheckCircle2, label: 'Resolved' },
            { icon: Users, label: 'Teams' },
            { icon: Settings, label: 'Settings' },
          ].map(item => (
            <button
              key={item.label}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors',
                item.active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <Button variant="ghost" className="justify-start text-muted-foreground mt-auto" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="lg:hidden flex items-center gap-2 mr-4">
              <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm text-foreground">ResQ AI</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search reports..."
                className="pl-9 w-48 sm:w-64 h-9"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-foreground mb-6">
            Command Dashboard
          </motion.h1>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="police">Police</SelectItem>
                <SelectItem value="ambulance">Ambulance</SelectItem>
                <SelectItem value="fire">Fire</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-32 h-9"><SelectValue placeholder="Severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="glass rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs">Report ID</TableHead>
                  <TableHead className="text-xs">Severity</TableHead>
                  <TableHead className="text-xs hidden sm:table-cell">Services</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Time</TableHead>
                  <TableHead className="text-xs text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map(report => {
                  const sev = SEVERITY_CONFIG[report.severity];
                  return (
                    <TableRow key={report.id} className="cursor-pointer hover:bg-secondary/30 border-border" onClick={() => setSelectedReport(report)}>
                      <TableCell className="font-mono text-xs">{report.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-xs border', sev.className)}>{sev.label}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex gap-1">
                          {report.services.map(s => { const Icon = SERVICE_ICONS[s]; return <Icon key={s} className="w-4 h-4 text-muted-foreground" />; })}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground capitalize">{report.status.replace('-', ' ')}</TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{new Date(report.timestamp).toLocaleTimeString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-xs">View <ChevronRight className="w-3 h-3 ml-1" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {/* Detail drawer */}
      <Sheet open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedReport && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="font-mono text-sm">{selectedReport.id}</span>
                  <Badge variant="outline" className={cn('text-xs border', SEVERITY_CONFIG[selectedReport.severity].className)}>
                    {SEVERITY_CONFIG[selectedReport.severity].label}
                  </Badge>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Description */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Description</p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedReport.description}</p>
                </div>

                {/* Services */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Required Services</p>
                  <div className="flex gap-2">
                    {selectedReport.services.map(s => {
                      const Icon = SERVICE_ICONS[s];
                      return (
                        <Badge key={s} variant="secondary" className="gap-1">
                          <Icon className="w-3 h-3" />{s}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Dispatch */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">AI Dispatch Message</p>
                  <div className="bg-secondary/50 rounded-lg p-3 text-sm font-mono text-foreground">{selectedReport.dispatchMessage}</div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground mt-1">{selectedReport.location}</p>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Victims</p>
                    <p className="text-sm font-medium text-foreground mt-1">{selectedReport.victims}</p>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <p className="text-sm font-medium text-foreground mt-1">{selectedReport.contact}</p>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Reporter</p>
                    <p className="text-sm font-medium text-foreground mt-1">{selectedReport.reporterName}</p>
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
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminDashboard;
