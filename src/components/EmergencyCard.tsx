import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, Shield, Heart, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmergencyReport, Service, SEVERITY_CONFIG } from '@/lib/types';
import { cn } from '@/lib/utils';

const SERVICE_ICONS: Record<Service, React.ElementType> = {
  police: Shield,
  ambulance: Heart,
  fire: Flame,
};

const EmergencyCard = ({ report, index = 0 }: { report: EmergencyReport; index?: number }) => {
  const sev = SEVERITY_CONFIG[report.severity];
  const timeAgo = getTimeAgo(report.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="glass rounded-xl p-4 hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">{report.id}</span>
            <Badge variant="outline" className={cn('text-xs border', sev.className)}>
              {sev.label}
            </Badge>
          </div>
          <p className="text-sm text-foreground line-clamp-2 mb-2">{report.description}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{report.location}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-1">
            {report.services.map(s => {
              const Icon = SERVICE_ICONS[s];
              return <Icon key={s} className="w-4 h-4 text-muted-foreground" />;
            })}
          </div>
          <Link to={`/track/${report.id}`}>
            <Button variant="ghost" size="sm" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              Track →
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

function getTimeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default EmergencyCard;
