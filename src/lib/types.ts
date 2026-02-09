export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Service = 'police' | 'ambulance' | 'fire';
export type ReportStatus = 'received' | 'preparing' | 'dispatched' | 'on-the-way' | 'in-progress' | 'resolved';

export interface EmergencyReport {
  id: string;
  description: string;
  severity: Severity;
  services: Service[];
  status: ReportStatus;
  location: string;
  victims: number;
  contact: string;
  timestamp: string;
  media: string[];
  dispatchMessage: string;
  reporterName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin';
}

export const STATUS_STEPS: { key: ReportStatus; label: string; description: string }[] = [
  { key: 'received', label: 'Request Received', description: 'Emergency report logged into system' },
  { key: 'preparing', label: 'Preparing Response', description: 'Assigning appropriate response teams' },
  { key: 'dispatched', label: 'Team Dispatched', description: 'Response team has been deployed' },
  { key: 'on-the-way', label: 'On the Way', description: 'Response team en route to location' },
  { key: 'in-progress', label: 'Action in Progress', description: 'Response team on scene, handling situation' },
  { key: 'resolved', label: 'Resolved', description: 'Emergency has been resolved successfully' },
];

export const SERVICE_INFO: Record<Service, { label: string; color: string }> = {
  police: { label: 'Police', color: 'severity-low' },
  ambulance: { label: 'Ambulance', color: 'severity-high' },
  fire: { label: 'Fire Dept', color: 'severity-critical' },
};

export const SEVERITY_CONFIG: Record<Severity, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-severity-low/15 text-severity-low border-severity-low/30' },
  medium: { label: 'Medium', className: 'bg-severity-medium/15 text-severity-medium border-severity-medium/30' },
  high: { label: 'High', className: 'bg-severity-high/15 text-severity-high border-severity-high/30' },
  critical: { label: 'Critical', className: 'bg-severity-critical/15 text-severity-critical border-severity-critical/30' },
};
