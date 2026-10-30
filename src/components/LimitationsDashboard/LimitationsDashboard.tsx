import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ArrowUpRight, 
  Server, 
  Layers, 
  Radio, 
  FileCode, 
  Lock, 
  Globe2,
  Cpu
} from 'lucide-react';

export const LimitationsDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ShieldAlert className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Limitations, Transparency &amp; Real-World Architecture Dashboard
          </h1>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          An honest, production-ready engineering evaluation detailing what is live AI vs. deterministic heuristic logic, edge case handling, and our municipal deployment roadmap.
        </p>
      </div>

      {/* 1. What is Live AI vs Deterministic Rules vs Simulated */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            1. Architecture Reality Matrix: Live AI vs. Deterministic Rules vs. Simulation
          </h2>
          <span className="text-[11px] font-mono text-slate-400">Zero Black-Box Deception</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Card 1 */}
          <div className="p-4 bg-slate-900/90 rounded-xl border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-cyan-300 uppercase text-[10px] tracking-wider">
                Live AI &amp; Semantic Logic
              </span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 font-mono text-[10px]">
                Active
              </span>
            </div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Semantic Duplicate Matching:</strong> Sub-second text embedding distance and token overlap analysis against active field tickets.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Emergency Action Brief Generation:</strong> Synthesizes multiple disparate citizen reports into unified incident briefs and equipment manifests.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Multi-Modal Vision Classification:</strong> Categorizes infrastructure damage (rebar exposure, asphalt cratering, electrical arcing).</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-4 bg-slate-900/90 rounded-xl border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-blue-300 uppercase text-[10px] tracking-wider">
                Deterministic GIS Rules
              </span>
              <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 font-mono text-[10px]">
                Exact Math
              </span>
            </div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span><strong>Haversine Geo-Proximity:</strong> Exact mathematical distance calculation (radius R = 6,371 km) for 250m duplicate radii and school buffers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span><strong>Department SLA Allocation:</strong> Deterministic regulatory dispatch rules (e.g., downed power lines must be assigned 1-hour SLA by municipal code).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span><strong>Score Multipliers:</strong> Transparent linear weighted arithmetic ($Score = \sum w_i x_i$) to prevent black-box discrimination.</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                Prototype Simulation
              </span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                Demo State
              </span>
            </div>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-start gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span><strong>Vehicle Telemetry:</strong> Crew GPS coordinates are simulated field units rather than live AVL/CanBus hardware trackers.</span>
              </li>
              <li className="flex items-start gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span><strong>Push Notifications:</strong> In-app visual timeline updates simulate WebPush and Twilio SMS citizen dispatches.</span>
              </li>
              <li className="flex items-start gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span><strong>Weather Telemetry:</strong> Incoming storm risk modifier uses simulated Doppler forecasts.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Critical Edge Cases & Fail-Safe Handling */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          2. Edge Cases, Adversarial Submissions &amp; Fail-Safe Guards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-rose-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              Imminent Life-Safety &amp; 911 Automatic Redirect
            </span>
            <p className="text-slate-300">
              If an incoming report contains tokens indicating active structure fires, violent crime, or gas explosions, CivicPulse immediately interdicts the submission flow with an emergency modal instructing the citizen to dial 911, preventing civic 311 delay.
            </p>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Sarcasm, Slang &amp; Neighborhood Dialect Normalization
            </span>
            <p className="text-slate-300">
              Citizens frequently express frustration ("This crater could swallow an aircraft carrier"). Our NLP pipeline strips hyperbolic sentiment to extract core physical measurements (diameter, depth, vehicle impact) without penalizing urgency.
            </p>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-blue-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              Automated PII &amp; License Plate Redaction
            </span>
            <p className="text-slate-300">
              Citizen photos uploaded to public status timelines pass through an automated blurring pass on client-side canvas before storage, obscuring faces and vehicle license plates to protect privacy.
            </p>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Duplicate Manipulation &amp; Upvote Sybil Resistance
            </span>
            <p className="text-slate-300">
              To prevent bad actors from gaming priority scores by submitting 50 duplicate reports from the same IP/device, velocity bonuses cap at +20 points max, requiring distinct geolocation coordinate hashes.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Real-World Integration Roadmap */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-emerald-400" />
          3. Real-World Municipal Integration Roadmap
        </h2>

        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <div className="font-bold text-cyan-400">Open311 Standard API</div>
              <p className="text-slate-400 text-[11px]">
                Bi-directional sync with legacy municipal work order systems (Accela, Cityworks, Cartegraph, Tyler Tech) using GeoReport v2 standard REST endpoints.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <div className="font-bold text-cyan-400">Edge Dashcam Fusion</div>
              <p className="text-slate-400 text-[11px]">
                Mounting lightweight vision models on municipal transit buses and sanitation trucks to autonomously catalog road decay during regular routes.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <div className="font-bold text-cyan-400">45+ Dialect Multilingualism</div>
              <p className="text-slate-400 text-[11px]">
                Direct audio transcription supporting immigrant communities (Spanish, Cantonese, Vietnamese, Tagalog) with immediate semantic translation into municipal English schemas.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <div className="font-bold text-cyan-400">IoT Sensor Grounding</div>
              <p className="text-slate-400 text-[11px]">
                Acoustic hydrophone integration in water mains to corroborate citizen surface puddle reports against real-time subterranean pressure drops.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
