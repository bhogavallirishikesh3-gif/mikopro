export type IssueCategory =
  | 'pothole'
  | 'water_leak'
  | 'downed_wire'
  | 'traffic_signal'
  | 'hazardous_debris'
  | 'streetlight'
  | 'flooding'
  | 'sidewalk';

export type UrgencyLevel = 'critical' | 'high' | 'moderate' | 'low';

export type IssueStatus =
  | 'submitted'
  | 'triaged'
  | 'dispatched'
  | 'in_progress'
  | 'resolved';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  status: IssueStatus;
}

export interface DuplicateMatch {
  issueId: string;
  title: string;
  address: string;
  similarityScore: number; // 0.00 to 1.00
  distanceMeters: number;
  existingUpvotes: number;
  reportedAt: string;
}

export interface ExplainableFactors {
  baseSeverity: number; // 0-30
  vulnerableZoneBonus: number; // 0-25 (school / hospital / senior center)
  duplicateVelocityBonus: number; // 0-20 (how many citizen reports in 3h)
  weatherRiskModifier: number; // 0-15 (rain/freeze imminent multiplier)
  structuralHazardBonus: number; // 0-10 (high-voltage, flooding, gas)
  calculatedScore: number; // 0-100
}

export interface CivicIssue {
  id: string;
  trackingNumber: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  urgency: UrgencyLevel;
  priorityScore: number; // 0-100
  coordinate: {
    lat: number;
    lng: number;
    address: string;
  };
  nearSchoolZone: boolean;
  schoolName?: string;
  nearHospitalZone: boolean;
  hospitalName?: string;
  photos: string[];
  resolvedPhoto?: string;
  audioTranscript?: string;
  safetyHazards: string[];
  department: string;
  slaHours: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  citizenName?: string;
  duplicateCount: number;
  duplicateMatches: DuplicateMatch[];
  isMergedInto?: string;
  assignedCrew?: {
    crewId: string;
    name: string;
    unitType: string;
    etaMinutes: number;
  };
  timeline: TimelineEvent[];
  explainableFactors: ExplainableFactors;
  clusterId?: string;
}

export interface HotspotCluster {
  id: string;
  title: string;
  locationName: string;
  center: {
    lat: number;
    lng: number;
  };
  radiusMeters: number;
  issueIds: string[];
  severity: UrgencyLevel;
  rootCauseHypothesis: string;
  aiActionBrief: {
    incidentOverview: string;
    recommendedCrew: string;
    equipmentRequired: string[];
    trafficImpact: 'Full Road Closure' | 'Single Lane Restriction' | 'Pedestrian Detour' | 'None';
    estimatedResolutionHours: number;
    safetyPrecautions: string[];
  };
  status: 'active_investigation' | 'crew_dispatched' | 'monitoring' | 'resolved';
}

export interface MunicipalCrew {
  id: string;
  name: string;
  unitCode: string;
  type: 'Road Maintenance' | 'Power & Electrical Grid' | 'Water & Sewer Works' | 'Public Safety Triage';
  status: 'available' | 'dispatched' | 'on_site' | 'maintenance';
  location: {
    lat: number;
    lng: number;
  };
  assignedIssueId?: string;
  leadTechnician: string;
  vehiclePlate: string;
}

export interface PrioritizationWeights {
  baseSeverityWeight: number; // standard 1.0
  schoolZoneMultiplier: number; // standard 1.5
  hospitalZoneMultiplier: number; // standard 1.4
  duplicateVelocityWeight: number; // standard 1.2
  weatherImpactWeight: number; // standard 1.3
  similarityThreshold: number; // 0.70 - 0.95
}
