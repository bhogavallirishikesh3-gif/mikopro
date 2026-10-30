import React, { useState } from 'react';
import { 
  Cpu, 
  Sliders, 
  GitMerge, 
  Binary, 
  Search, 
  ShieldAlert, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw,
  Code2
} from 'lucide-react';
import { CivicIssue, PrioritizationWeights } from '../../types';
import { computeSemanticSimilarity } from '../../services/aiService';

interface PipelineVisualizerProps {
  issues: CivicIssue[];
  weights: PrioritizationWeights;
  onUpdateWeights: (newWeights: PrioritizationWeights) => void;
  onResetWeights: () => void;
}

const SAMPLE_COMPARISONS = [
  {
    textA: "Severe 8-inch pothole with exposed rebar in Lincoln High crosswalk",
    textB: "Rim damage pothole on 8th & Lincoln Ave right where kids cross",
    geoDistance: 18,
    category: "Road & School Safety",
  },
  {
    textA: "Water main geyser cracking asphalt on Market & 7th",
    textB: "Clean potable water erupting through street seam near 7th St",
    geoDistance: 12,
    category: "Water Utility",
  },
  {
    textA: "Live sparking electrical wire on sidewalk near bus stop",
    textB: "Four consecutive streetlights out pitch black on Folsom St",
    geoDistance: 1200,
    category: "Distinct Incidents",
  },
];

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  issues,
  weights,
  onUpdateWeights,
  onResetWeights,
}) => {
  const [activeTab, setActiveTab] = useState<'prioritization' | 'similarity' | 'nlp_pipeline'>('prioritization');

  // Recalculate priority scores for issues based on current weights
  const reRankedIssues = [...issues].map((issue) => {
    const vulnerableZoneBonus = Math.round(
      (issue.nearSchoolZone ? 18 * weights.schoolZoneMultiplier : 0) +
      (issue.nearHospitalZone ? 15 * weights.hospitalZoneMultiplier : 0)
    );
    const dupVelocity = Math.min(25, Math.round(issue.duplicateCount * 7 * weights.duplicateVelocityWeight));
    const isWeather = issue.category === 'pothole' || issue.category === 'water_leak' || issue.category === 'downed_wire';
    const weatherBonus = isWeather ? Math.round(12 * weights.weatherImpactWeight) : 4;
    const base = issue.explainableFactors.baseSeverity * weights.baseSeverityWeight;
    const structural = issue.explainableFactors.structuralHazardBonus;

    const dynamicScore = Math.min(100, Math.max(10, Math.round(base + vulnerableZoneBonus + dupVelocity + weatherBonus + structural)));

    return {
      ...issue,
      dynamicScore,
      scoreDelta: dynamicScore - issue.priorityScore,
    };
  }).sort((a, b) => b.dynamicScore - a.dynamicScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Visualizer Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                AI Pipeline &amp; Algorithmic Logic Studio
              </h1>
              <p className="text-xs text-slate-400">
                Transparent explainability for vector similarity thresholds, multi-factor priority scoring, and NLP entity normalization.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab('prioritization')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'prioritization'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Prioritization Weights
          </button>
          <button
            onClick={() => setActiveTab('similarity')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'similarity'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semantic Similarity
          </button>
          <button
            onClick={() => setActiveTab('nlp_pipeline')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'nlp_pipeline'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            NLP &amp; Vision Extraction
          </button>
        </div>
      </div>

      {/* TAB 1: PRIORITIZATION WEIGHTS */}
      {activeTab === 'prioritization' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sliders Configuration Column (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Municipal Weight Matrix
              </span>
              <button
                onClick={onResetWeights}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Defaults
              </button>
            </div>

            <div className="space-y-4">
              {/* School Zone Multiplier */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">School Zone Multiplier</span>
                  <span className="font-mono text-cyan-400 font-bold">{weights.schoolZoneMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.1"
                  value={weights.schoolZoneMultiplier}
                  onChange={(e) => onUpdateWeights({ ...weights, schoolZoneMultiplier: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Boosts priority for hazards within 250m of active elementary, middle, or high schools.
                </p>
              </div>

              {/* Hospital Zone Multiplier */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Hospital Corridor Multiplier</span>
                  <span className="font-mono text-cyan-400 font-bold">{weights.hospitalZoneMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.1"
                  value={weights.hospitalZoneMultiplier}
                  onChange={(e) => onUpdateWeights({ ...weights, hospitalZoneMultiplier: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Weights impacts on critical ambulance thoroughfares and emergency clinic zones.
                </p>
              </div>

              {/* Duplicate Velocity Weight */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Duplicate Report Velocity Weight</span>
                  <span className="font-mono text-cyan-400 font-bold">{weights.duplicateVelocityWeight.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={weights.duplicateVelocityWeight}
                  onChange={(e) => onUpdateWeights({ ...weights, duplicateVelocityWeight: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Multiplies urgency as multiple citizens report the same hazard in short time windows.
                </p>
              </div>

              {/* Weather Forecast Risk Factor */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Imminent Storm/Freeze Modifier</span>
                  <span className="font-mono text-cyan-400 font-bold">{weights.weatherImpactWeight.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={weights.weatherImpactWeight}
                  onChange={(e) => onUpdateWeights({ ...weights, weatherImpactWeight: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Escalates road and water leaks when freeze-thaw or rainfall is projected in the next 12 hours.
                </p>
              </div>

              {/* Base Severity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Base Category Severity Scale</span>
                  <span className="font-mono text-cyan-400 font-bold">{weights.baseSeverityWeight.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={weights.baseSeverityWeight}
                  onChange={(e) => onUpdateWeights({ ...weights, baseSeverityWeight: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Formula Callout */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-cyan-400 font-bold uppercase text-[10px]">Explainable Scoring Equation:</div>
              <div className="text-slate-300 text-[11px] leading-relaxed">
                Score = (Base × {weights.baseSeverityWeight.toFixed(1)}) + (SchoolZone × {weights.schoolZoneMultiplier.toFixed(1)}) + (DupVelocity × {weights.duplicateVelocityWeight.toFixed(1)}) + (WeatherRisk × {weights.weatherImpactWeight.toFixed(1)}) + HazardBonus
              </div>
            </div>
          </div>

          {/* Dynamic Re-Ranking Queue Table (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Live Dynamically Re-Sorted Incident Queue
                </span>
                <p className="text-[11px] text-slate-400">
                  Adjust sliders on the left to watch municipal dispatch priority scores re-calculate in real time.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {reRankedIssues.map((issue, rankIdx) => (
                <div
                  key={issue.id}
                  className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center font-mono font-bold text-xs text-slate-400 border border-slate-800">
                      #{rankIdx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {issue.title}
                        </span>
                        {issue.nearSchoolZone && (
                          <span className="text-[10px] font-medium bg-rose-950/80 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded">
                            School Zone
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {issue.coordinate.address} · {issue.department}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-mono font-extrabold text-cyan-400">
                      {issue.dynamicScore} pts
                    </div>
                    {issue.scoreDelta !== 0 && (
                      <span className={`text-[10px] font-mono font-bold ${
                        issue.scoreDelta > 0 ? 'text-emerald-400' : 'text-slate-500'
                      }`}>
                        {issue.scoreDelta > 0 ? `+${issue.scoreDelta}` : issue.scoreDelta} delta
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEMANTIC SIMILARITY */}
      {activeTab === 'similarity' && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-cyan-400" />
                Semantic Vector Similarity &amp; Duplicate Detection Lab
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Compares unstructured citizen reports using token overlap and spatial radius bounding to automatically merge duplicates before they clog 311 queues.
              </p>
            </div>

            {/* Threshold Slider */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
              <span className="text-xs text-slate-300 font-semibold whitespace-nowrap">
                Similarity Cutoff:
              </span>
              <input
                type="range"
                min="0.60"
                max="0.95"
                step="0.02"
                value={weights.similarityThreshold}
                onChange={(e) => onUpdateWeights({ ...weights, similarityThreshold: parseFloat(e.target.value) })}
                className="accent-cyan-400 w-32 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-cyan-400">
                {(weights.similarityThreshold * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Test Comparisons */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Field Text Pairs &amp; Clustering Decisions
            </span>

            {SAMPLE_COMPARISONS.map((sample, idx) => {
              const similarity = computeSemanticSimilarity(sample.textA, sample.textB);
              const isMatch = similarity >= weights.similarityThreshold && sample.geoDistance <= 250;

              return (
                <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">
                      Scenario #{idx + 1}: {sample.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Geographic Separation: {sample.geoDistance}m
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Incoming Citizen Report A:</div>
                      <div className="text-slate-200">"{sample.textA}"</div>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Existing Field Report B:</div>
                      <div className="text-slate-200">"{sample.textB}"</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">
                        Computed Semantic Similarity: <strong className="font-mono text-cyan-300">{(similarity * 100).toFixed(0)}%</strong>
                      </span>
                      <span>·</span>
                      <span className="text-slate-400">
                        Spatial Boundary Check: <strong className="font-mono text-slate-200">{sample.geoDistance <= 250 ? 'PASS (<250m)' : 'FAIL (>250m)'}</strong>
                      </span>
                    </div>

                    <div>
                      {isMatch ? (
                        <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-800 text-amber-300 font-bold text-[11px] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          TRIGGER AUTO-MERGE &amp; UPVOTE PROPOSAL
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 text-[11px] font-semibold">
                          DISTINCT INCIDENT TICKET
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: NLP & MULTIMODAL EXTRACTION */}
      {activeTab === 'nlp_pipeline' && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              Multimodal Ingestion &amp; Structured JSON Municipal Output
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Transforms noisy raw voice audio, photo evidence, and panic text into standardized Open311 / municipal work orders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Stage 1 · Ingestion</span>
              <h3 className="text-xs font-bold text-white">Raw Citizen Data</h3>
              <p className="text-xs text-slate-400">
                Voice audio transcription, mobile camera photo, GPS latitude/longitude lock, and unstructured description.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Stage 2 · Extraction</span>
              <h3 className="text-xs font-bold text-white">NER &amp; Hazard Vision</h3>
              <p className="text-xs text-slate-400">
                Extracts cross-streets, infrastructure objects (rebar, power cable, asphalt void), and panic urgency factors.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Stage 3 · GIS Enrichment</span>
              <h3 className="text-xs font-bold text-white">Spatial Polygon Match</h3>
              <p className="text-xs text-slate-400">
                Buffers against municipal GIS layers: School safety corridors, hospital transit arteries, flood plains.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Stage 4 · Routing</span>
              <h3 className="text-xs font-bold text-white">Automated SLA Dispatch</h3>
              <p className="text-xs text-slate-400">
                Assigns department (DPW, Water, Grid), calculates SLA window, checks duplicate clusters, alerts nearby crew.
              </p>
            </div>
          </div>

          {/* Example JSON Payload Output */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Standardized Municipal Work Order JSON Payload
            </span>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              <pre>{JSON.stringify({
                tracking_id: "CP-2026-8941",
                timestamp: "2026-10-30T07:16:00Z",
                category: "pothole_crater",
                urgency: "critical",
                priority_score: 92,
                gis_corridor: {
                  school_zone: "Lincoln Community High School",
                  distance_meters: 45,
                  weight_multiplier: 1.5
                },
                vision_analysis: {
                  void_diameter_cm: 65,
                  rebar_exposure: true,
                  tire_strike_hazard: "extreme"
                },
                department_routing: "Department of Public Works (Streets)",
                target_sla_hours: 4,
                suggested_crew_equipment: ["Infrared asphalt heater", "Polymer binder"]
              }, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
