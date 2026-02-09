import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const incidentIcon = new L.DivIcon({
  className: 'custom-incident-marker',
  html: `<div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const responderIcon = new L.DivIcon({
  className: 'custom-responder-marker',
  html: `<div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white relative">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
    <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white animate-ping"></div>
    <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Map bounds updater component
const MapBoundsUpdater = ({ positions }: { positions: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(p => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [map, positions]);
  return null;
};

interface LiveMapProps {
  incidentLocation: { lat: number; lng: number; address: string };
  responderName: string;
  eta: number; // in minutes
  className?: string;
}

const LiveMap = ({ incidentLocation, responderName, eta, className }: LiveMapProps) => {
  const [responderPos, setResponderPos] = useState<[number, number]>([
    incidentLocation.lat + 0.015,
    incidentLocation.lng + 0.012,
  ]);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const animationRef = useRef<number>();
  const progressRef = useRef(0);

  // Generate route path
  useEffect(() => {
    const startPos: [number, number] = [incidentLocation.lat + 0.015, incidentLocation.lng + 0.012];
    const endPos: [number, number] = [incidentLocation.lat, incidentLocation.lng];
    
    // Create curved path with intermediate points
    const points: [number, number][] = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Add slight curve
      const curve = Math.sin(t * Math.PI) * 0.003;
      const lat = startPos[0] + (endPos[0] - startPos[0]) * t + curve;
      const lng = startPos[1] + (endPos[1] - startPos[1]) * t - curve * 0.5;
      points.push([lat, lng]);
    }
    setRoutePath(points);
  }, [incidentLocation]);

  // Animate responder movement
  useEffect(() => {
    const animate = () => {
      progressRef.current += 0.002;
      if (progressRef.current > 1) progressRef.current = 0;
      
      if (routePath.length > 0) {
        const idx = Math.floor(progressRef.current * (routePath.length - 1));
        const nextIdx = Math.min(idx + 1, routePath.length - 1);
        const t = (progressRef.current * (routePath.length - 1)) % 1;
        
        const lat = routePath[idx][0] + (routePath[nextIdx][0] - routePath[idx][0]) * t;
        const lng = routePath[idx][1] + (routePath[nextIdx][1] - routePath[idx][1]) * t;
        setResponderPos([lat, lng]);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [routePath]);

  const incidentPos: [number, number] = [incidentLocation.lat, incidentLocation.lng];

  return (
    <div className={cn('relative rounded-xl overflow-hidden border border-border', className)}>
      {/* ETA Overlay */}
      <div className="absolute top-3 left-3 z-[1000] glass-strong rounded-lg px-3 py-2">
        <p className="text-xs text-muted-foreground">Estimated Arrival</p>
        <p className="text-lg font-bold text-foreground">{eta} min</p>
      </div>
      
      {/* Responder info overlay */}
      <div className="absolute top-3 right-3 z-[1000] glass-strong rounded-lg px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-medium text-foreground">{responderName}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">En route</p>
      </div>

      <MapContainer
        center={incidentPos}
        zoom={14}
        style={{ height: '100%', width: '100%', minHeight: '300px' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapBoundsUpdater positions={[incidentPos, responderPos]} />
        
        {/* Route line */}
        <Polyline
          positions={routePath}
          pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.7, dashArray: '10, 10' }}
        />
        
        {/* Incident marker */}
        <Marker position={incidentPos} icon={incidentIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">Emergency Location</p>
              <p className="text-gray-600">{incidentLocation.address}</p>
            </div>
          </Popup>
        </Marker>
        
        {/* Responder marker */}
        <Marker position={responderPos} icon={responderIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{responderName}</p>
              <p className="text-gray-600">ETA: {eta} minutes</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LiveMap;
