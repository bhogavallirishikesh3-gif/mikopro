import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Flame, 
  ShieldAlert, 
  Truck, 
  Send, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Filter, 
  AlertTriangle, 
  Radio, 
  FileText,
  Sliders,
  TrendingUp,
  Volume2
} from 'lucide-react';
import { CivicIssue, HotspotCluster, MunicipalCrew, IssueCategory, UrgencyLevel, IssueStatus } from '../../types';
import { AdminMap } from './AdminMap';
import confetti from 'canvas-confetti';

interface AdminCommandCenterProps {
  issues: CivicIssue[];
  hotspots: HotspotCluster[];
  crews: MunicipalCrew[];
  selectedIssueId?: string;
  onSelectIssue: (issue: CivicIssue) => void;
  onDispatchCrew: (issueId: string, crewId: string) => void;
  onUpdatePriority: (issueId: string, newScore: number) => void;
  onUpdateStatus: (issueId: string, newStatus: IssueStatus) => void;
  onResolveHotspot: (hotspotId: string) => void;
}

export const AdminCommandCenter: React.FC<AdminCommandCenterProps> = ({
  issues,
  hotspots,
  crews,
  selectedIssueId,
  onSelectIssue,
  onDispatchCrew,
  onUpdatePriority,
  onUpdateStatus,
  onResolveHotspot,
}) => {
  // Layer toggles
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showCrews, setShowCrews] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [schoolZoneOnly, setSchoolZoneOnly] = useState(false);

  // Modals & Drawers
  const [activeHotspotModal, setActiveHotspotModal] = useState<HotspotCluster | null>(null);
  const [selectedCrewToDispatch, setSelectedCrewToDispatch] = useState<string>('');
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Filtered issues
  const filteredIssues = issues.filter((issue) => {
    if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
    if (urgencyFilter !== 'all' && issue.urgency !== urgencyFilter) return false;
    if (schoolZoneOnly && !issue.nearSchoolZone) return false;
    return true;
  });

  const selectedIssue = issues.find((i) => i.id === selectedIssueId) || null;

  const handleDispatch = () => {
    if (!selectedIssue || !selectedCrewToDispatch) return;
    onDispatchCrew(selectedIssue.id, selectedCrewToDispatch);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    setSelectedCrewToDispatch('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage('');
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Telemetry & Control Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white">
              Municipal Command &amp; Triage Grid
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              Live Geo-Telemetry Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time incident geospatial mapping, AI cluster detection, and municipal crew dispatch orchestration.
          </p>
        </div>

        {/* Map Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
              showHotspots
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            AI Hotspots ({hotspots.length})
          </button>

          <button
            onClick={() => setShowCrews(!showCrews)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
              showCrews
                ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            Municipal Crews ({crews.length})
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
              showHeatmap
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Heatmap Layer
          </button>
        </div>
      </div>

      {/* AI Hotspots Cluster Notification Strip */}
      {hotspots.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 animate-bounce" />
              Active AI Hotspot Clusters ({hotspots.length} Detected)
            </span>
            <span>Synthesizes multiple correlated reports into unified municipal response briefs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hotspots.map((hotspot) => (
              <div
                key={hotspot.id}
                className="p-3.5 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 rounded-xl border border-rose-500/40 flex items-center justify-between gap-3 shadow-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      {hotspot.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-rose-900/60 text-rose-200">
                      {hotspot.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1">
                    {hotspot.rootCauseHypothesis}
                  </p>
                  <div className="text-[11px] text-cyan-400 font-mono">
                    {hotspot.issueIds.length} citizen tickets merged · {hotspot.locationName}
                  </div>
                </div>

                <button
                  onClick={() => setActiveHotspotModal(hotspot)}
                  className="shrink-0 px-3 py-1.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-rose-500/20 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  View Action Brief
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Map + Side Details Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Map & Filters (8 cols or 7 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          {/* Quick Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="all">All Categories ({issues.length})</option>
                <option value="pothole">Potholes &amp; Road</option>
                <option value="water_leak">Water &amp; Sewer Leaks</option>
                <option value="downed_wire">Power &amp; Downed Wire</option>
                <option value="traffic_signal">Traffic Signals</option>
                <option value="streetlight">Streetlights</option>
                <option value="sidewalk">Sidewalk &amp; ADA</option>
              </select>

              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="all">All Urgencies</option>
                <option value="critical">Critical (85+ Score)</option>
                <option value="high">High (70-84 Score)</option>
                <option value="moderate">Moderate</option>
              </select>
            </div>

            <button
              onClick={() => setSchoolZoneOnly(!schoolZoneOnly)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                schoolZoneOnly
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              School Zones Only ({issues.filter((i) => i.nearSchoolZone).length})
            </button>
          </div>

          {/* Interactive Map View */}
          <div className="h-[560px] relative">
            <AdminMap
              issues={filteredIssues}
              hotspots={hotspots}
              crews={crews}
              selectedIssueId={selectedIssueId}
              onSelectIssue={onSelectIssue}
              onSelectHotspot={(hotspot) => setActiveHotspotModal(hotspot)}
              showHeatmap={showHeatmap}
              showHotspots={showHotspots}
              showCrews={showCrews}
            />

            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-20 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-xl text-[11px] space-y-1.5">
              <div className="font-bold text-white text-xs mb-1">Grid Telemetry Legend</div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-rose-500 border border-white shrink-0"></span>
                <span>Critical Urgency (85-100)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shrink-0"></span>
                <span>High Urgency (70-84)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-cyan-500 border border-white shrink-0"></span>
                <span>Moderate Urgency (&lt;70)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-3 h-3 rounded bg-blue-600 border border-white shrink-0"></span>
                <span>Municipal Crew Fleet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Issue Detail & Dispatch Workspace (4 cols or 5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          {selectedIssue ? (
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-5 shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {selectedIssue.trackingNumber}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      selectedIssue.urgency === 'critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      selectedIssue.urgency === 'high' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {selectedIssue.urgency}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {selectedIssue.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{selectedIssue.coordinate.address}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase font-semibold">Priority</div>
                  <div className="text-xl font-mono font-extrabold text-cyan-400">
                    {selectedIssue.priorityScore}
                    <span className="text-xs text-slate-500">/100</span>
                  </div>
                </div>
              </div>

              {/* Status Controls */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Incident Status Pipeline
                </label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  {(['triaged', 'dispatched', 'in_progress', 'resolved'] as IssueStatus[]).map((statusKey) => (
                    <button
                      key={statusKey}
                      onClick={() => onUpdateStatus(selectedIssue.id, statusKey)}
                      className={`py-1.5 text-[10px] font-semibold rounded-lg capitalize transition ${
                        selectedIssue.status === statusKey
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {statusKey.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo & Voice Evidence */}
              <div>
                {selectedIssue.photos[0] && (
                  <div className="rounded-xl overflow-hidden border border-slate-800 relative group">
                    <img
                      src={selectedIssue.photos[0]}
                      alt="Incident photo"
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-slate-300">
                      <span>Citizen photo submission</span>
                      {selectedIssue.duplicateCount > 0 && (
                        <span className="text-amber-400 font-semibold font-mono">
                          +{selectedIssue.duplicateCount} merged tickets
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {selectedIssue.audioTranscript && (
                  <div className="mt-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <p className="italic font-mono text-[11px] leading-relaxed">
                      "{selectedIssue.audioTranscript}"
                    </p>
                  </div>
                )}
              </div>

              {/* Explainable Factor Breakdown */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Explainable AI Factor Breakdown
                  </span>
                  <span className="font-mono text-cyan-400">{selectedIssue.priorityScore} pts</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Category Severity</span>
                    <span className="font-mono text-slate-200">+{selectedIssue.explainableFactors.baseSeverity} pts</span>
                  </div>
                  {selectedIssue.nearSchoolZone && (
                    <div className="flex justify-between text-rose-300 font-medium">
                      <span>School Zone Proximity Multiplier</span>
                      <span className="font-mono">+{selectedIssue.explainableFactors.vulnerableZoneBonus} pts</span>
                    </div>
                  )}
                  {selectedIssue.nearHospitalZone && (
                    <div className="flex justify-between text-amber-300 font-medium">
                      <span>Hospital / Ambulance Route Multiplier</span>
                      <span className="font-mono">+{selectedIssue.explainableFactors.vulnerableZoneBonus} pts</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Duplicate Ticket Velocity</span>
                    <span className="font-mono text-slate-200">+{selectedIssue.explainableFactors.duplicateVelocityBonus} pts</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Imminent Weather Hazard Factor</span>
                    <span className="font-mono text-slate-200">+{selectedIssue.explainableFactors.weatherRiskModifier} pts</span>
                  </div>
                </div>
              </div>

              {/* Crew Dispatch Action Workflow */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-cyan-400" />
                    Dispatch Municipal Response Crew
                  </span>
                  {selectedIssue.assignedCrew ? (
                    <span className="text-[10px] text-emerald-400 font-mono">
                      UNIT ASSIGNED
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-mono">
                      AWAITING CREW
                    </span>
                  )}
                </div>

                {selectedIssue.assignedCrew ? (
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div className="font-bold text-white">
                      {selectedIssue.assignedCrew.name}
                    </div>
                    <div className="text-[11px] text-cyan-300 font-mono">
                      Unit: {selectedIssue.assignedCrew.unitType} · ETA: {selectedIssue.assignedCrew.etaMinutes} mins
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <select
                      value={selectedCrewToDispatch}
                      onChange={(e) => setSelectedCrewToDispatch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">Select Available Field Crew...</option>
                      {crews.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.unitCode} - {c.name} ({c.type}) [{c.status}]
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleDispatch}
                      disabled={!selectedCrewToDispatch}
                      className="w-full py-2 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Deploy Crew &amp; Alert Citizens
                    </button>
                  </div>
                )}
              </div>

              {/* Citizen Broadcast Push Announcement */}
              <form onSubmit={handleSendBroadcast} className="space-y-2 pt-1 border-t border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  Broadcast Live Update to Citizens
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="e.g. Repair crew en route, lane 2 closed for 45 mins"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={!broadcastMessage.trim()}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
                  >
                    Broadcast
                  </button>
                </div>
                {broadcastSent && (
                  <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    SMS &amp; In-App push notification broadcasted to all citizens tracking this corridor!
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="bg-slate-900/60 rounded-2xl p-8 border border-slate-800 text-center text-slate-500 space-y-2">
              <MapPin className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
              <div className="text-sm font-semibold text-slate-300">No Incident Selected</div>
              <p className="text-xs">
                Click any numbered incident marker on the tactical map to inspect triage telemetry, review photos, and dispatch municipal crews.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Hotspot Action Brief Modal */}
      {activeHotspotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setActiveHotspotModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                  AI Synthesized Emergency Action Brief
                </span>
                <h2 className="text-lg font-bold text-white">
                  {activeHotspotModal.title}
                </h2>
              </div>
            </div>

            <div className="p-3.5 bg-rose-950/30 rounded-xl border border-rose-500/30 text-xs text-rose-200 leading-relaxed">
              <span className="font-bold text-white block mb-1">Root Cause Hypothesis:</span>
              {activeHotspotModal.rootCauseHypothesis}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400 font-semibold uppercase text-[10px]">
                  Recommended Municipal Unit
                </div>
                <div className="font-bold text-white text-sm">
                  {activeHotspotModal.aiActionBrief.recommendedCrew}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400 font-semibold uppercase text-[10px]">
                  Traffic Impact Advisory
                </div>
                <div className="font-bold text-amber-300 text-sm">
                  {activeHotspotModal.aiActionBrief.trafficImpact}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Required Field Equipment &amp; Rig Manifest
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeHotspotModal.aiActionBrief.equipmentRequired.map((equip, eIdx) => (
                  <div key={eIdx} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{equip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Safety Protocol &amp; Precaution Directives
              </div>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {activeHotspotModal.aiActionBrief.safetyPrecautions.map((safe, sIdx) => (
                  <li key={sIdx}>{safe}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveHotspotModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                Close Brief
              </button>
              <button
                type="button"
                onClick={() => {
                  onResolveHotspot(activeHotspotModal.id);
                  setActiveHotspotModal(null);
                  confetti({ particleCount: 50, spread: 70 });
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-500 hover:bg-rose-400 text-slate-950 rounded-xl shadow-lg shadow-rose-500/20 flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" />
                Dispatch Unified Emergency Fleet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
