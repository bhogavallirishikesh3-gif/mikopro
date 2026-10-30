import React, { useState } from 'react';
import { 
  Compass, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Radio, 
  MapPin, 
  Cpu, 
  ShieldAlert, 
  Play, 
  Pause, 
  RotateCcw,
  Flame,
  Truck
} from 'lucide-react';
import { ActiveTab } from '../Header';

interface JudgeTourProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectTrackIssue: (issueId: string) => void;
  onResetData: () => void;
}

interface TourStep {
  stepNumber: number;
  badge: string;
  title: string;
  targetTab: ActiveTab;
  explanation: string;
  keyDifferentiators: string[];
  actionLabel: string;
  actionPayload?: () => void;
}

export const JudgeTour: React.FC<JudgeTourProps> = ({
  onNavigateTab,
  onSelectTrackIssue,
  onResetData,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const TOUR_STEPS: TourStep[] = [
    {
      stepNumber: 1,
      badge: "Citizen Experience (< 1 Min)",
      title: "Rapid Hazard Submission with Voice & Vision",
      targetTab: "citizen",
      explanation: "Citizens can report dangerous municipal issues in seconds without painful 30-field forms. Watch as voice transcription converts frantic audio into actionable descriptions, and computer vision flags infrastructure damage instantly.",
      keyDifferentiators: [
        "One-click hazard scenarios (potholes, geysers, downed wires)",
        "Integrated voice memo recorder with live audio-to-text transcription",
        "Vision AI camera tagging for rebar, surface voids, and utility risks",
      ],
      actionLabel: "Open Citizen Portal & Try Reporting",
    },
    {
      stepNumber: 2,
      badge: "Instant AI Triage",
      title: "Real-Time Semantic Duplicate & Hazard Preview",
      targetTab: "citizen",
      explanation: "Before submission, CivicPulse AI compares the report against active tickets within 250m. If a match is detected (e.g. 91% similarity), it suggests a 1-click 'Upvote & Merge'—preventing municipal ticket backlog and speeding repair times by 40%.",
      keyDifferentiators: [
        "Sub-300ms vector similarity & spatial bounding check",
        "Automated School Zone (1.5x) and Hospital Corridor (1.4x) multiplier flags",
        "1-click merge upvotes boost existing priority rather than creating duplicate crew dispatches",
      ],
      actionLabel: "Test Duplicate Detection & Upvote Merge",
      actionPayload: () => {
        onSelectTrackIssue('issue-101');
      },
    },
    {
      stepNumber: 3,
      badge: "Command Center GIS",
      title: "Interactive Municipal Map & AI Hotspot Clusters",
      targetTab: "admin",
      explanation: "Dispatchers gain bird's-eye situational awareness. The AI detects clusters of distinct reports—such as five independent reports of water bubbling and pavement buckling on Market St—identifying that an underground water main has ruptured.",
      keyDifferentiators: [
        "Tactical dark Carto GIS map with priority score telemetry markers",
        "Pulsing radar rings for critical emergencies (85+ score)",
        "Spatial clustering algorithms grouping multi-street incidents into root-cause hotspots",
      ],
      actionLabel: "View Command Center Map & Hotspots",
    },
    {
      stepNumber: 4,
      badge: "AI Action Synthesis",
      title: "Municipal Action Brief & Equipment Manifest",
      targetTab: "admin",
      explanation: "Instead of an engineer manually reading 10 separate citizen complaints, the AI synthesizes an emergency Action Brief: exact root cause hypothesis, traffic closure directives, and required equipment manifest (pumps, hydro-excavators).",
      keyDifferentiators: [
        "Synthesizes raw citizen descriptions into municipal engineering directives",
        "Suggests traffic detours and required heavy machinery",
        "1-click 'Dispatch Unified Emergency Fleet' triggers coordinated response",
      ],
      actionLabel: "Inspect Clustered Action Brief",
    },
    {
      stepNumber: 5,
      badge: "Dispatch & Transparency",
      title: "Live Fleet Deployment & Real-Time Citizen Tracking",
      targetTab: "citizen",
      explanation: "Watch the dispatch workflow in action: assigning HydroWorks or DPW crews updates live ETAs on the map, and immediately sends visual step-by-step timeline updates to the citizen's mobile tracking portal.",
      keyDifferentiators: [
        "Full transparent lifecycle: Submitted → AI Triaged → Crew Dispatched → On Site → Verified Resolution",
        "Live crew ETA and unit equipment badges",
        "Before & After verified repair photo evidence comparison",
      ],
      actionLabel: "View Citizen Timeline & Crew ETA",
      actionPayload: () => {
        onSelectTrackIssue('issue-102');
      },
    },
    {
      stepNumber: 6,
      badge: "Algorithmic Fairness",
      title: "Explainable Prioritization & Weight Sliders",
      targetTab: "pipeline",
      explanation: "Municipalities cannot rely on opaque black-box AI. CivicPulse provides an explainable factor breakdown for every score and an interactive Weight Studio where city officials can tune school zone, hospital, and weather multipliers live.",
      keyDifferentiators: [
        "Math is 100% transparent: Base + VulnerableZone + DuplicateVelocity + Weather = Score",
        "Interactive sliders allow live dynamic re-ranking of the city queue",
        "Guards against geographic and socioeconomic neighborhood bias",
      ],
      actionLabel: "Explore AI Explainability & Sliders",
    },
  ];

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleExecuteStep = () => {
    if (currentStep.actionPayload) {
      currentStep.actionPayload();
    }
    onNavigateTab(currentStep.targetTab);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Tour Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 p-6 rounded-2xl border border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Compass className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Hackathon Judge Evaluation Flow
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              5-Minute Guided AI Platform Tour
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Step through the exact core capabilities of CivicPulse AI from both the citizen and city administrator perspectives.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetData}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo State
            </button>
          </div>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-white">
              Step {currentStep.stepNumber} of {TOUR_STEPS.length}: {currentStep.title}
            </span>
            <span className="font-mono text-amber-400">
              {Math.round(((currentStepIndex + 1) / TOUR_STEPS.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden flex gap-1 p-0.5">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-full flex-1 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'bg-amber-400 shadow-md shadow-amber-400/50'
                    : idx < currentStepIndex
                    ? 'bg-amber-600'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Current Step Card */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 px-2.5 py-1 rounded bg-amber-950/80 border border-amber-800/80">
            {currentStep.badge}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Navigation Target: {currentStep.targetTab.toUpperCase()}
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {currentStep.title}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mt-2">
            {currentStep.explanation}
          </p>
        </div>

        {/* Key Differentiators */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            What Judges Should Look For In This Step:
          </span>
          <div className="space-y-2">
            {currentStep.keyDifferentiators.map((diff, dIdx) => (
              <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{diff}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button & Navigation Stepper */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-xl border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
            >
              Previous Step
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex === TOUR_STEPS.length - 1}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-xl border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
            >
              Next Step
            </button>
          </div>

          <button
            onClick={handleExecuteStep}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
          >
            <span>{currentStep.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
