import React from 'react';
import { 
  Building2, 
  MapPin, 
  Radio, 
  Cpu, 
  Compass, 
  ShieldAlert, 
  RotateCcw,
  AlertTriangle,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { CivicIssue, HotspotCluster } from '../types';

export type ActiveTab = 'citizen' | 'admin' | 'pipeline' | 'tour' | 'honesty';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  issues: CivicIssue[];
  hotspots: HotspotCluster[];
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  issues,
  hotspots,
  onResetData,
}) => {
  const criticalCount = issues.filter((i) => i.urgency === 'critical' && i.status !== 'resolved').length;
  const inProgressCount = issues.filter((i) => i.status === 'in_progress' || i.status === 'dispatched').length;
  const resolvedCount = issues.filter((i) => i.status === 'resolved').length;

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Telemetry */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-950/50 border border-cyan-400/30">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  CivicPulse <span className="text-cyan-400">AI</span>
                </span>
                <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
                  Municipal Core v2.4
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Metro City Grid
                </span>
                <span>·</span>
                <span className="text-rose-400 font-medium flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {criticalCount} Critical
                </span>
                <span>·</span>
                <span className="text-amber-400 font-medium">
                  {hotspots.length} Hotspots
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('citizen')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'citizen'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Citizen Portal
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Admin Command
              {criticalCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                  {criticalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              AI Logic Engine
            </button>

            <button
              onClick={() => setActiveTab('tour')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'tour'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-amber-300 hover:text-amber-200 hover:bg-amber-950/40'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              5-Min Judge Tour
            </button>

            <button
              onClick={() => setActiveTab('honesty')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'honesty'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Limitations & Honesty
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onResetData}
              title="Reset sample data and scenario state"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800/80 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('citizen')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'citizen' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            Citizen
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'admin' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            Admin Map ({criticalCount})
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'pipeline' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            AI Engine
          </button>
          <button
            onClick={() => setActiveTab('tour')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'tour' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-amber-400'
            }`}
          >
            Judge Tour
          </button>
          <button
            onClick={() => setActiveTab('honesty')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'honesty' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            Honesty
          </button>
        </div>
      </div>
    </header>
  );
};
