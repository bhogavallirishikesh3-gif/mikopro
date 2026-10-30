import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Camera, 
  Mic, 
  MapPin, 
  Send, 
  Sparkles, 
  CopyCheck, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Volume2,
  StopCircle,
  FileText,
  Truck,
  RotateCcw
} from 'lucide-react';
import { CivicIssue, DuplicateMatch, IssueCategory, PrioritizationWeights } from '../../types';
import { performAiTriage, TriageAnalysisResult } from '../../services/aiService';
import confetti from 'canvas-confetti';

interface CitizenPortalProps {
  issues: CivicIssue[];
  weights: PrioritizationWeights;
  onSubmitIssue: (newIssue: CivicIssue) => void;
  onUpvoteDuplicate: (issueId: string) => void;
  selectedTrackId?: string;
  onSelectTrackId: (id: string) => void;
}

const PRESET_TEMPLATES = [
  {
    label: 'Deep Pothole (School Zone)',
    category: 'pothole' as IssueCategory,
    title: 'Severe crater pothole near Lincoln High entrance',
    desc: 'Huge 8-inch deep road crater causing morning school bus swerves and popped tires.',
    address: '740 Lincoln Ave (near 8th St)',
    lat: 37.7758,
    lng: -122.4175,
    photo: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    audioText: "I'm reporting a dangerous crater right in front of Lincoln High School. Cars are braking hard to avoid it.",
  },
  {
    label: 'Water Main Geyser',
    category: 'water_leak' as IssueCategory,
    title: 'High pressure water rupture uplifting street surface',
    desc: 'Clean water spewing 4 feet into the air. Street is beginning to crater and cave in under lane 2.',
    address: '1088 Market St (near 7th St)',
    lat: 37.7792,
    lng: -122.4135,
    photo: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=800&q=80',
    audioText: 'There is water shooting straight through the road here on Market Street. It looks like a huge pipe burst underneath.',
  },
  {
    label: 'Sparking Downed Wire',
    category: 'downed_wire' as IssueCategory,
    title: 'Live sparking electrical wire on sidewalk',
    desc: 'Overhead cable fell onto concrete sidewalk next to bus stop. Emitting sparks and smoke.',
    address: '420 Pine Street',
    lat: 37.7715,
    lng: -122.4218,
    photo: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    audioText: 'Live power wire down on the ground sparking near the bus bench! People are walking too close!',
  },
  {
    label: 'Dark Streetlights Corridor',
    category: 'streetlight' as IssueCategory,
    title: 'Four blackout streetlights creating hazard zone',
    desc: 'Zero illumination along 200 meters of sidewalk. Pedestrians unable to see curbs at night.',
    address: '1010 Folsom Street',
    lat: 37.7760,
    lng: -122.4090,
    photo: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    audioText: 'All the street lights are completely dark on this stretch of Folsom, totally pitch black.',
  },
];

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  issues,
  weights,
  onSubmitIssue,
  onUpvoteDuplicate,
  selectedTrackId,
  onSelectTrackId,
}) => {
  const [viewMode, setViewMode] = useState<'report' | 'track'>(selectedTrackId ? 'track' : 'report');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('740 Lincoln Ave (at 8th Street)');
  const [coords, setCoords] = useState({ lat: 37.7758, lng: -122.4175 });
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [audioTranscript, setAudioTranscript] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Live AI Preview State
  const [aiPreview, setAiPreview] = useState<TriageAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);

  // Sync selected track ID when changed from outside
  useEffect(() => {
    if (selectedTrackId) {
      setViewMode('track');
    }
  }, [selectedTrackId]);

  // Voice recording simulation timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Real-time AI analysis debounce
  useEffect(() => {
    if (!title && !description) {
      setAiPreview(null);
      return;
    }

    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      const result = performAiTriage(
        title,
        description,
        { ...coords, address },
        issues,
        weights
      );
      setAiPreview(result);
      setIsAnalyzing(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [title, description, coords, address, issues, weights]);

  // Apply a rapid template
  const handleApplyTemplate = (tmpl: (typeof PRESET_TEMPLATES)[0]) => {
    setTitle(tmpl.title);
    setDescription(tmpl.desc);
    setAddress(tmpl.address);
    setCoords({ lat: tmpl.lat, lng: tmpl.lng });
    setPhotoUrl(tmpl.photo);
    setAudioTranscript(tmpl.audioText);
  };

  // Toggle voice memo
  const handleToggleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // simulate speech recognition
      const memo = "Citizen voice dispatch: Multiple vehicles hitting severe dip in front of Lincoln High school entrance. Rebar is showing.";
      setAudioTranscript(memo);
      if (!description) {
        setDescription(memo);
      }
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const memo = "Citizen voice dispatch: Deep road crater right near Lincoln High crosswalk. Kids crossing, very unsafe.";
        setAudioTranscript(memo);
        if (!description) {
          setDescription(memo);
        }
      }, 3500);
    }
  };

  // Handle final submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const triage = aiPreview || performAiTriage(title, description, { ...coords, address }, issues, weights);
    const trackingNumber = `CP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = `issue-${Date.now()}`;

    const newIssue: CivicIssue = {
      id: newId,
      trackingNumber,
      title,
      description: description || title,
      category: triage.category,
      status: 'triaged',
      urgency: triage.urgency,
      priorityScore: triage.priorityScore,
      coordinate: {
        lat: coords.lat,
        lng: coords.lng,
        address,
      },
      nearSchoolZone: triage.nearSchoolZone,
      schoolName: triage.schoolName,
      nearHospitalZone: triage.nearHospitalZone,
      hospitalName: triage.hospitalName,
      photos: photoUrl ? [photoUrl] : ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'],
      audioTranscript: audioTranscript || undefined,
      safetyHazards: triage.safetyHazards,
      department: triage.department,
      slaHours: triage.slaHours,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      citizenName: 'You (Verified Citizen)',
      duplicateCount: 0,
      duplicateMatches: triage.duplicateMatches,
      timeline: [
        {
          id: `t-${Date.now()}-1`,
          timestamp: 'Just now',
          title: 'Citizen Report Submitted',
          description: `Logged via Mobile Web with instant AI vision and hazard triage.`,
          actor: 'You',
          status: 'submitted',
        },
        {
          id: `t-${Date.now()}-2`,
          timestamp: 'Just now',
          title: 'AI Priority & Routing Scored',
          description: triage.reasoningBrief,
          actor: 'CivicPulse AI Engine',
          status: 'triaged',
        },
      ],
      explainableFactors: triage.explainableFactors,
    };

    onSubmitIssue(newIssue);
    onSelectTrackId(newId);
    setSubmittedSuccess(trackingNumber);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#06b6d4', '#3b82f6', '#10b981'],
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setPhotoUrl('');
    setAudioTranscript('');
    setViewMode('track');
  };

  const currentTrackIssue = issues.find((i) => i.id === selectedTrackId) || issues[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Citizen Action Hub</span>
            <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
              Response SLA &lt; 4 Hours
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Report hazards in &lt;60 seconds. Instant AI detects duplicates, calculates urgency, and dispatches municipal crews.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-stretch sm:self-auto">
          <button
            onClick={() => setViewMode('report')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'report'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Report Hazard (&lt;1 min)
          </button>
          <button
            onClick={() => setViewMode('track')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'track'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Track Status ({issues.length})
          </button>
        </div>
      </div>

      {/* VIEW MODE: REPORT AN ISSUE */}
      {viewMode === 'report' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form & Rapid Presets (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick 1-Click Templates */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Quick Hazard Scenarios (1-Click Fill)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Real-world examples</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="p-2.5 text-left rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 transition-all group"
                  >
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                      {tmpl.label}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {tmpl.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  What is the issue? <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deep pothole causing flat tires outside Lincoln High School"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Location & Address <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter street address or cross street"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                  <span className="font-mono text-cyan-300">GPS Locked: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCoords({ lat: 37.7758, lng: -122.4175 });
                      setAddress('740 Lincoln Ave (at 8th Street)');
                    }}
                    className="text-cyan-400 hover:underline"
                  >
                    Lincoln High School Zone
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCoords({ lat: 37.7792, lng: -122.4135 });
                      setAddress('1088 Market St (near 7th St)');
                    }}
                    className="text-cyan-400 hover:underline"
                  >
                    Market St Corridor
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Additional Details
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleVoiceRecording}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition ${
                      isRecording
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                        : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-cyan-500'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <StopCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Recording ({recordingSeconds}s)...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Add Voice Memo</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe severity, traffic obstruction, or any immediate danger..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
                {audioTranscript && (
                  <div className="mt-2 p-2.5 bg-cyan-950/40 border border-cyan-800/50 rounded-xl text-xs text-cyan-200 flex items-start gap-2">
                    <Volume2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-cyan-300">Voice Transcription Captured:</div>
                      <p className="italic text-slate-300 mt-0.5 font-mono">"{audioTranscript}"</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Photo Attachment */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Photo Evidence (Auto-analyzed by Vision AI)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80')}
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 rounded-xl text-xs text-slate-300 transition"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span>Attach Road Hazard Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=800&q=80')}
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 rounded-xl text-xs text-slate-300 transition"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span>Attach Water Leak Photo</span>
                  </button>
                </div>
                {photoUrl && (
                  <div className="mt-2.5 relative rounded-xl overflow-hidden border border-slate-700 max-h-48 group">
                    <img src={photoUrl} alt="Attached Evidence" className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-1 font-mono text-[11px] text-cyan-300">
                        <Sparkles className="w-3.5 h-3.5" /> AI Vision Scan: Asphalt void &amp; shear detected
                      </span>
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="text-xs text-rose-400 hover:text-rose-300 bg-slate-900/80 px-2 py-0.5 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit to Municipal AI Dispatch</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Instant AI Analysis Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-cyan-500/30 shadow-xl shadow-cyan-950/20 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Sparkles className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Instant AI Analysis Preview</h3>
                    <p className="text-[11px] text-slate-400">Evaluates duplicates, safety hazards &amp; routing</p>
                  </div>
                </div>
                {isAnalyzing && (
                  <span className="text-[11px] font-mono text-cyan-400 animate-pulse">
                    Analyzing...
                  </span>
                )}
              </div>

              {!aiPreview && !isAnalyzing ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                  Start typing an issue or click a template to preview live AI triage, duplicate detection, and urgency scores.
                </div>
              ) : aiPreview ? (
                <div className="space-y-4 mt-4">
                  {/* Duplicate Detection Warning Banner */}
                  {aiPreview.duplicateMatches.length > 0 ? (
                    <div className="bg-amber-950/40 border border-amber-500/50 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <CopyCheck className="w-4 h-4 text-amber-400" />
                          Semantic Duplicate Detected ({Math.round(aiPreview.duplicateMatches[0].similarityScore * 100)}% match)
                        </span>
                        <span className="text-[10px] font-mono bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-200">
                          {aiPreview.duplicateMatches[0].distanceMeters}m away
                        </span>
                      </div>
                      <p className="text-xs text-amber-200/90">
                        A nearly identical report is already active: <span className="font-semibold text-white">"{aiPreview.duplicateMatches[0].title}"</span> at {aiPreview.duplicateMatches[0].address}.
                      </p>
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            onUpvoteDuplicate(aiPreview.duplicateMatches[0].issueId);
                            onSelectTrackId(aiPreview.duplicateMatches[0].issueId);
                            setViewMode('track');
                            confetti({ particleCount: 30, spread: 50 });
                          }}
                          className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          Upvote &amp; Merge with Existing Report (+1 Priority)
                        </button>
                      </div>
                      <p className="text-[10px] text-amber-300/70 text-center">
                        Upvoting merges citizen reports, avoids duplicate crew dispatches, and bumps municipal urgency queue.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Zero duplicate tickets found within 250m. Brand new incident candidate.</span>
                    </div>
                  )}

                  {/* Urgency & Priority Score Meter */}
                  <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider">Urgency Score</span>
                      <span className={`font-mono font-bold text-sm ${
                        aiPreview.priorityScore >= 85 ? 'text-rose-400' :
                        aiPreview.priorityScore >= 70 ? 'text-amber-400' : 'text-cyan-400'
                      }`}>
                        {aiPreview.priorityScore} / 100 ({aiPreview.urgency.toUpperCase()})
                      </span>
                    </div>

                    {/* Score Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          aiPreview.priorityScore >= 85 ? 'bg-gradient-to-r from-amber-500 to-rose-500' :
                          aiPreview.priorityScore >= 70 ? 'bg-gradient-to-r from-cyan-500 to-amber-500' :
                          'bg-cyan-500'
                        }`}
                        style={{ width: `${aiPreview.priorityScore}%` }}
                      />
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Target SLA Response: <span className="font-semibold text-white">&lt; {aiPreview.slaHours} Hours</span>
                    </div>
                  </div>

                  {/* Safety Hazards & Critical Zones */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Detected Hazard Vectors
                    </span>
                    <div className="space-y-1.5">
                      {aiPreview.nearSchoolZone && (
                        <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>School Zone Proximity (+1.5x Multiplier): {aiPreview.schoolName}</span>
                        </div>
                      )}
                      {aiPreview.nearHospitalZone && (
                        <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Emergency Medical Route (+1.4x Multiplier): {aiPreview.hospitalName}</span>
                        </div>
                      )}
                      {aiPreview.safetyHazards.map((hazard, hIdx) => (
                        <div key={hIdx} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{hazard}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Routing */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                      Automated Municipal Dispatch Target
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {aiPreview.department}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE: TRACK STATUS & TIMELINE */}
      {viewMode === 'track' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List of Reports (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Reports ({issues.length})
              </span>
              <span className="text-[11px] text-slate-400">Select to inspect</span>
            </div>

            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {issues.map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => onSelectTrackId(issue.id)}
                  className={`w-full p-3 rounded-xl text-left border transition-all ${
                    currentTrackIssue?.id === issue.id
                      ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/30'
                      : 'bg-slate-950/80 hover:bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                      {issue.trackingNumber}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                      issue.status === 'resolved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      issue.status === 'in_progress' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                      issue.status === 'dispatched' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-white line-clamp-1">
                    {issue.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{issue.coordinate.address}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <span>Priority {issue.priorityScore}/100</span>
                    {issue.duplicateCount > 0 && (
                      <span className="text-amber-400 font-medium">
                        +{issue.duplicateCount} merged citizen reports
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Timeline & Inspection Card (8 cols) */}
          <div className="lg:col-span-8">
            {currentTrackIssue ? (
              <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-6">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
                        {currentTrackIssue.trackingNumber}
                      </span>
                      <span className="text-xs text-slate-400">
                        Reported by {currentTrackIssue.citizenName || 'Citizen'}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white">
                      {currentTrackIssue.title}
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{currentTrackIssue.coordinate.address}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                    <div className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                      currentTrackIssue.status === 'resolved' ? 'bg-emerald-500 text-slate-950' :
                      currentTrackIssue.status === 'in_progress' ? 'bg-blue-500 text-white' :
                      currentTrackIssue.status === 'dispatched' ? 'bg-amber-400 text-slate-950' :
                      'bg-slate-700 text-white'
                    }`}>
                      {currentTrackIssue.status.replace('_', ' ')}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      SLA Target: &lt;{currentTrackIssue.slaHours}h
                    </div>
                  </div>
                </div>

                {/* Assigned Crew Card */}
                {currentTrackIssue.assignedCrew && (
                  <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-xl border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Assigned Municipal Response Crew:</div>
                        <div className="text-sm font-bold text-white">
                          {currentTrackIssue.assignedCrew.name}
                        </div>
                        <div className="text-xs text-cyan-300 font-mono">
                          {currentTrackIssue.assignedCrew.unitType}
                        </div>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Crew Status</span>
                      <span className="text-xs font-semibold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800">
                        {currentTrackIssue.status === 'in_progress' ? 'Active On-Site Works' : `En Route (ETA ${currentTrackIssue.assignedCrew.etaMinutes} mins)`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Visual Step-by-Step Timeline */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Real-time Incident Progress Timeline
                  </h3>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                    {currentTrackIssue.timeline.map((step, sIdx) => (
                      <div key={sIdx} className="relative">
                        {/* Node circle */}
                        <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 ${
                          step.status === 'resolved' ? 'bg-emerald-500 border-slate-950' :
                          step.status === 'in_progress' ? 'bg-blue-500 border-slate-950' :
                          step.status === 'dispatched' ? 'bg-amber-400 border-slate-950' :
                          'bg-cyan-400 border-slate-950'
                        }`} />

                        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">
                              {step.title}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              {step.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300">
                            {step.description}
                          </p>
                          <div className="text-[10px] text-cyan-400 font-mono pt-1">
                            Logged by: {step.actor}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Photos: Before & After (if resolved) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    Field Verification Photos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentTrackIssue.photos[0] && (
                      <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                        <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-semibold text-slate-400">
                          Initial Citizen Submission Photo
                        </div>
                        <img
                          src={currentTrackIssue.photos[0]}
                          alt="Initial submission"
                          className="w-full h-44 object-cover"
                        />
                      </div>
                    )}
                    {currentTrackIssue.resolvedPhoto ? (
                      <div className="rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-950">
                        <div className="px-3 py-1.5 bg-emerald-950/80 border-b border-emerald-800 text-[11px] font-semibold text-emerald-300 flex items-center justify-between">
                          <span>Verified Municipal Repair Photo</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <img
                          src={currentTrackIssue.resolvedPhoto}
                          alt="Resolved verification"
                          className="w-full h-44 object-cover"
                        />
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-6 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
                        <Camera className="w-6 h-6 mb-2 opacity-40" />
                        <span>Crew completion photo will be verified and published here upon resolution.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
