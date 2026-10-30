/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { CitizenPortal } from './components/CitizenPortal/CitizenPortal';
import { AdminCommandCenter } from './components/AdminCommandCenter/AdminCommandCenter';
import { PipelineVisualizer } from './components/PipelineVisualizer/PipelineVisualizer';
import { JudgeTour } from './components/JudgeTour/JudgeTour';
import { LimitationsDashboard } from './components/LimitationsDashboard/LimitationsDashboard';
import { INITIAL_ISSUES, INITIAL_HOTSPOTS, INITIAL_CREWS, INITIAL_WEIGHTS } from './data/mockData';
import { CivicIssue, HotspotCluster, MunicipalCrew, PrioritizationWeights, IssueStatus } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('citizen');
  const [issues, setIssues] = useState<CivicIssue[]>(INITIAL_ISSUES);
  const [hotspots, setHotspots] = useState<HotspotCluster[]>(INITIAL_HOTSPOTS);
  const [crews, setCrews] = useState<MunicipalCrew[]>(INITIAL_CREWS);
  const [weights, setWeights] = useState<PrioritizationWeights>(INITIAL_WEIGHTS);
  
  const [selectedIssueId, setSelectedIssueId] = useState<string | undefined>('issue-101');
  const [selectedTrackId, setSelectedTrackId] = useState<string | undefined>('issue-101');

  // Reset to clean initial demo state
  const handleResetData = () => {
    setIssues(INITIAL_ISSUES);
    setHotspots(INITIAL_HOTSPOTS);
    setCrews(INITIAL_CREWS);
    setWeights(INITIAL_WEIGHTS);
    setSelectedIssueId('issue-101');
    setSelectedTrackId('issue-101');
  };

  // Citizen submits new report
  const handleSubmitIssue = (newIssue: CivicIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
    setSelectedIssueId(newIssue.id);
    setSelectedTrackId(newIssue.id);
  };

  // Upvote an existing duplicate report
  const handleUpvoteDuplicate = (issueId: string) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const newDupCount = issue.duplicateCount + 1;
          const newPriority = Math.min(100, issue.priorityScore + 3);
          const newTimeline = [
            ...issue.timeline,
            {
              id: `t-dup-${Date.now()}`,
              timestamp: 'Just now',
              title: 'Citizen Duplicate Corroboration',
              description: `Citizen verified and upvoted this incident (+3 priority boost). Total reports: ${newDupCount + 1}.`,
              actor: 'Citizen Verified App',
              status: issue.status,
            },
          ];

          return {
            ...issue,
            duplicateCount: newDupCount,
            priorityScore: newPriority,
            timeline: newTimeline,
          };
        }
        return issue;
      })
    );
  };

  // Dispatch crew to an incident
  const handleDispatchCrew = (issueId: string, crewId: string) => {
    const assignedCrewObj = crews.find((c) => c.id === crewId);
    if (!assignedCrewObj) return;

    // Update Crew
    setCrews((prev) =>
      prev.map((c) => (c.id === crewId ? { ...c, status: 'dispatched', assignedIssueId: issueId } : c))
    );

    // Update Issue
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            status: 'dispatched',
            assignedCrew: {
              crewId: assignedCrewObj.id,
              name: assignedCrewObj.name,
              unitType: assignedCrewObj.type,
              etaMinutes: 14,
            },
            timeline: [
              ...issue.timeline,
              {
                id: `t-dispatch-${Date.now()}`,
                timestamp: 'Just now',
                title: 'Crew Dispatched to Site',
                description: `${assignedCrewObj.unitCode} (${assignedCrewObj.name}) dispatched with full equipment manifest.`,
                actor: 'Command Dispatcher',
                status: 'dispatched',
              },
            ],
          };
        }
        return issue;
      })
    );
  };

  // Update status (e.g. In Progress, Resolved)
  const handleUpdateStatus = (issueId: string, newStatus: IssueStatus) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            status: newStatus,
            resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : issue.resolvedAt,
            resolvedPhoto:
              newStatus === 'resolved'
                ? 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
                : issue.resolvedPhoto,
            timeline: [
              ...issue.timeline,
              {
                id: `t-status-${Date.now()}`,
                timestamp: 'Just now',
                title: `Status Updated to ${newStatus.replace('_', ' ').toUpperCase()}`,
                description: `Field technician updated status to ${newStatus}.`,
                actor: 'Field Operations',
                status: newStatus,
              },
            ],
          };
        }
        return issue;
      })
    );
  };

  // Priority score override
  const handleUpdatePriority = (issueId: string, newScore: number) => {
    setIssues((prev) =>
      prev.map((issue) => (issue.id === issueId ? { ...issue, priorityScore: newScore } : issue))
    );
  };

  // Resolve Hotspot Cluster
  const handleResolveHotspot = (hotspotId: string) => {
    setHotspots((prev) =>
      prev.map((h) => (h.id === hotspotId ? { ...h, status: 'crew_dispatched' } : h))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation & Telemetry Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        issues={issues}
        hotspots={hotspots}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'citizen' && (
          <CitizenPortal
            issues={issues}
            weights={weights}
            onSubmitIssue={handleSubmitIssue}
            onUpvoteDuplicate={handleUpvoteDuplicate}
            selectedTrackId={selectedTrackId}
            onSelectTrackId={setSelectedTrackId}
          />
        )}

        {activeTab === 'admin' && (
          <AdminCommandCenter
            issues={issues}
            hotspots={hotspots}
            crews={crews}
            selectedIssueId={selectedIssueId}
            onSelectIssue={(issue) => setSelectedIssueId(issue.id)}
            onDispatchCrew={handleDispatchCrew}
            onUpdatePriority={handleUpdatePriority}
            onUpdateStatus={handleUpdateStatus}
            onResolveHotspot={handleResolveHotspot}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineVisualizer
            issues={issues}
            weights={weights}
            onUpdateWeights={setWeights}
            onResetWeights={() => setWeights(INITIAL_WEIGHTS)}
          />
        )}

        {activeTab === 'tour' && (
          <JudgeTour
            onNavigateTab={setActiveTab}
            onSelectTrackIssue={(id) => {
              setSelectedTrackId(id);
              setSelectedIssueId(id);
            }}
            onResetData={handleResetData}
          />
        )}

        {activeTab === 'honesty' && <LimitationsDashboard />}
      </main>

      {/* Persistent Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">CivicPulse AI</span>
            <span>·</span>
            <span>Municipal Incident Orchestration &amp; Triage Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>Open311 GeoReport v2 Ready</span>
            <span>·</span>
            <span className="text-cyan-400">Low-Latency Triage Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
