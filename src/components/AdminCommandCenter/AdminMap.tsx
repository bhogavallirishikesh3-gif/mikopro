import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CivicIssue, HotspotCluster, MunicipalCrew } from '../../types';

interface AdminMapProps {
  issues: CivicIssue[];
  hotspots: HotspotCluster[];
  crews: MunicipalCrew[];
  selectedIssueId?: string;
  onSelectIssue: (issue: CivicIssue) => void;
  onSelectHotspot: (hotspot: HotspotCluster) => void;
  showHeatmap: boolean;
  showHotspots: boolean;
  showCrews: boolean;
}

export const AdminMap: React.FC<AdminMapProps> = ({
  issues,
  hotspots,
  crews,
  selectedIssueId,
  onSelectIssue,
  onSelectHotspot,
  showHeatmap,
  showHotspots,
  showCrews,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const hotspotsLayerRef = useRef<L.LayerGroup | null>(null);
  const crewsLayerRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [37.7758, -122.4175],
      zoom: 14,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark Carto tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Create Layer Groups
    markersLayerRef.current = L.layerGroup().addTo(map);
    hotspotsLayerRef.current = L.layerGroup().addTo(map);
    crewsLayerRef.current = L.layerGroup().addTo(map);
    heatmapLayerRef.current = L.layerGroup().addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Incident Markers
  useEffect(() => {
    if (!markersLayerRef.current || !mapRef.current) return;
    markersLayerRef.current.clearLayers();

    issues.forEach((issue) => {
      const isSelected = issue.id === selectedIssueId;
      const isCritical = issue.urgency === 'critical';
      const isHigh = issue.urgency === 'high';

      const color = isCritical ? '#f43f5e' : isHigh ? '#f59e0b' : '#06b6d4';
      const glow = isCritical ? 'box-shadow: 0 0 15px rgba(244, 63, 94, 0.8);' : '';

      const markerHtml = `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          ${isCritical ? `<div style="position: absolute; inset: -4px; border-radius: 9999px; background: rgba(244,63,94,0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
          <div style="width: 24px; height: 24px; border-radius: 9999px; background: ${color}; border: ${isSelected ? '3px solid #ffffff' : '2px solid #0f172a'}; display: flex; align-items: center; justify-content: center; ${glow}">
            <span style="font-size: 11px; font-weight: 800; color: #0f172a;">${issue.priorityScore}</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-incident-pin',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([issue.coordinate.lat, issue.coordinate.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectIssue(issue);
      });

      marker.bindTooltip(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 600; color: #f8fafc; padding: 2px;">
          <div style="color: ${color}; font-size: 10px; font-weight: 800; text-transform: uppercase;">${issue.category.replace('_', ' ')} · ${issue.urgency}</div>
          <div style="margin-top: 2px;">${issue.title}</div>
          <div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">Priority Score: <strong>${issue.priorityScore}/100</strong></div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -12],
        className: 'custom-map-tooltip',
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [issues, selectedIssueId, onSelectIssue]);

  // Update Hotspots Layer
  useEffect(() => {
    if (!hotspotsLayerRef.current) return;
    hotspotsLayerRef.current.clearLayers();

    if (!showHotspots) return;

    hotspots.forEach((hotspot) => {
      const circle = L.circle([hotspot.center.lat, hotspot.center.lng], {
        radius: hotspot.radiusMeters,
        color: '#f43f5e',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#f43f5e',
        fillOpacity: 0.18,
      });

      circle.on('click', () => {
        onSelectHotspot(hotspot);
      });

      circle.bindTooltip(`
        <div style="font-size: 12px; font-weight: 700; color: #f8fafc;">
          <div style="color: #fb7185; font-size: 10px; text-transform: uppercase;">AI HOTSPOT CLUSTER</div>
          <div>${hotspot.title}</div>
          <div style="font-size: 10px; color: #cbd5e1; margin-top: 2px;">Click to view AI Action Brief</div>
        </div>
      `, { sticky: true });

      circle.addTo(hotspotsLayerRef.current!);
    });
  }, [hotspots, showHotspots, onSelectHotspot]);

  // Update Crews Layer
  useEffect(() => {
    if (!crewsLayerRef.current) return;
    crewsLayerRef.current.clearLayers();

    if (!showCrews) return;

    crews.forEach((crew) => {
      const crewHtml = `
        <div style="background: #0284c7; border: 2px solid #ffffff; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.4); cursor: pointer;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        </div>
      `;

      const crewIcon = L.divIcon({
        className: 'custom-crew-pin',
        html: crewHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([crew.location.lat, crew.location.lng], { icon: crewIcon });
      marker.bindTooltip(`
        <div style="font-size: 11px; color: #f8fafc;">
          <div style="font-weight: 800; color: #38bdf8;">${crew.unitCode} (${crew.status.toUpperCase()})</div>
          <div>${crew.name}</div>
          <div style="color: #94a3b8; font-size: 10px;">Lead: ${crew.leadTechnician}</div>
        </div>
      `);

      marker.addTo(crewsLayerRef.current!);
    });
  }, [crews, showCrews]);

  // Update Heatmap Density Layer
  useEffect(() => {
    if (!heatmapLayerRef.current) return;
    heatmapLayerRef.current.clearLayers();

    if (!showHeatmap) return;

    issues.forEach((issue) => {
      const intensity = issue.priorityScore / 100;
      const radius = 120 + intensity * 80;
      const gradient = L.circle([issue.coordinate.lat, issue.coordinate.lng], {
        radius,
        stroke: false,
        fillColor: issue.urgency === 'critical' ? '#ef4444' : '#f59e0b',
        fillOpacity: 0.25 * intensity,
      });

      gradient.addTo(heatmapLayerRef.current!);
    });
  }, [issues, showHeatmap]);

  // Center on selected issue if changed
  useEffect(() => {
    if (!mapRef.current || !selectedIssueId) return;
    const selected = issues.find((i) => i.id === selectedIssueId);
    if (selected) {
      mapRef.current.panTo([selected.coordinate.lat, selected.coordinate.lng], {
        animate: true,
        duration: 0.8,
      });
    }
  }, [selectedIssueId, issues]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};
