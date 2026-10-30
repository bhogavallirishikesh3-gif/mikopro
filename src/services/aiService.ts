import { CivicIssue, DuplicateMatch, ExplainableFactors, HotspotCluster, IssueCategory, PrioritizationWeights, UrgencyLevel } from '../types';

// Haversine formula to compute distance in meters between two coordinates
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Tokenize text into words / n-grams for semantic matching
function tokenize(str: string): Set<string> {
  const words = str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
  return new Set(words);
}

// Jaccard + token overlap similarity for instant semantic distance approximation
export function computeSemanticSimilarity(textA: string, textB: string): number {
  const setA = tokenize(textA);
  const setB = tokenize(textB);

  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const word of setA) {
    if (setB.has(word)) {
      intersection++;
    }
  }

  const union = new Set([...setA, ...setB]).size;
  const jaccard = intersection / union;

  // Bonus for domain keywords match
  const criticalKeywords = ['pothole', 'hole', 'water', 'leak', 'wire', 'spark', 'electric', 'light', 'dark', 'crosswalk', 'signal', 'curb', 'tree', 'sidewalk'];
  let keywordOverlap = 0;
  for (const kw of criticalKeywords) {
    if (setA.has(kw) && setB.has(kw)) {
      keywordOverlap += 0.15;
    }
  }

  return Math.min(0.98, Number((jaccard * 0.7 + keywordOverlap).toFixed(2)));
}

// Known civic landmarks for proximity detection
const CIVIC_ANCHORS = [
  { name: 'Lincoln Community High School', type: 'school', lat: 37.7760, lng: -122.4172, radius: 250 },
  { name: 'St. Jude Elementary School', type: 'school', lat: 37.7720, lng: -122.4140, radius: 200 },
  { name: 'Central Metro Medical Hub', type: 'hospital', lat: 37.7795, lng: -122.4130, radius: 300 },
  { name: 'Mission Senior Care Pavilion', type: 'hospital', lat: 37.7745, lng: -122.4240, radius: 200 },
];

export interface TriageAnalysisResult {
  category: IssueCategory;
  urgency: UrgencyLevel;
  priorityScore: number;
  safetyHazards: string[];
  department: string;
  slaHours: number;
  nearSchoolZone: boolean;
  schoolName?: string;
  nearHospitalZone: boolean;
  hospitalName?: string;
  duplicateMatches: DuplicateMatch[];
  explainableFactors: ExplainableFactors;
  reasoningBrief: string;
}

export function performAiTriage(
  title: string,
  description: string,
  coords: { lat: number; lng: number; address: string },
  existingIssues: CivicIssue[],
  weights: PrioritizationWeights
): TriageAnalysisResult {
  const fullText = `${title} ${description}`.toLowerCase();

  // 1. Category Detection
  let category: IssueCategory = 'pothole';
  if (/wire|spark|electric|pole|shock|transformer|arcing/i.test(fullText)) {
    category = 'downed_wire';
  } else if (/water|leak|pipe|flood|geyser|burst|sewer|hydrant/i.test(fullText)) {
    category = fullText.includes('flood') ? 'flooding' : 'water_leak';
  } else if (/signal|crosswalk|red light|traffic light|green light|countdown/i.test(fullText)) {
    category = 'traffic_signal';
  } else if (/street\s*light|lamp|dark|pitch black|illumination|bulb/i.test(fullText)) {
    category = 'streetlight';
  } else if (/curb|sidewalk|pavement|tripping|wheelchair|concrete|ramp/i.test(fullText)) {
    category = 'sidewalk';
  } else if (/debris|glass|couch|dumping|trash|branch|tree fall|obstruction/i.test(fullText)) {
    category = 'hazardous_debris';
  } else if (/pothole|crater|asphalt|tire|road hole|bump/i.test(fullText)) {
    category = 'pothole';
  }

  // 2. Department & Base SLA
  let department = 'Department of Public Works (Streets)';
  let baseSla = 24;
  let baseSeverity = 15;

  switch (category) {
    case 'downed_wire':
      department = 'Bureau of Electricity & Grid Infrastructure';
      baseSla = 1;
      baseSeverity = 30;
      break;
    case 'water_leak':
    case 'flooding':
      department = 'Water & Sewer Authority Emergency Works';
      baseSla = 2;
      baseSeverity = 26;
      break;
    case 'traffic_signal':
      department = 'Department of Transportation (Signals)';
      baseSla = 4;
      baseSeverity = 22;
      break;
    case 'pothole':
      department = 'Department of Public Works (Streets)';
      baseSla = 12;
      baseSeverity = 18;
      break;
    case 'hazardous_debris':
      department = 'Bureau of Sanitation & Rapid Clean';
      baseSla = 8;
      baseSeverity = 17;
      break;
    case 'streetlight':
      department = 'Bureau of Street Lighting';
      baseSla = 24;
      baseSeverity = 14;
      break;
    case 'sidewalk':
      department = 'Department of Public Works (Sidewalks & ADA)';
      baseSla = 36;
      baseSeverity = 15;
      break;
  }

  // 3. Proximity Checks (School & Hospital Zones)
  let nearSchoolZone = false;
  let schoolName: string | undefined;
  let nearHospitalZone = false;
  let hospitalName: string | undefined;

  for (const anchor of CIVIC_ANCHORS) {
    const dist = calculateDistanceMeters(coords.lat, coords.lng, anchor.lat, anchor.lng);
    if (dist <= anchor.radius) {
      if (anchor.type === 'school') {
        nearSchoolZone = true;
        schoolName = anchor.name;
      } else if (anchor.type === 'hospital') {
        nearHospitalZone = true;
        hospitalName = anchor.name;
      }
    }
  }

  // 4. Duplicate Detection (Scan within 200m radius)
  const duplicateMatches: DuplicateMatch[] = [];
  for (const issue of existingIssues) {
    const dist = calculateDistanceMeters(coords.lat, coords.lng, issue.coordinate.lat, issue.coordinate.lng);
    if (dist <= 250) {
      const similarity = computeSemanticSimilarity(fullText, `${issue.title} ${issue.description}`);
      if (similarity >= weights.similarityThreshold) {
        duplicateMatches.push({
          issueId: issue.id,
          title: issue.title,
          address: issue.coordinate.address,
          similarityScore: similarity,
          distanceMeters: dist,
          existingUpvotes: issue.duplicateCount + 1,
          reportedAt: issue.createdAt,
        });
      }
    }
  }

  // 5. Safety Hazard Extraction
  const safetyHazards: string[] = [];
  if (category === 'downed_wire' || fullText.includes('spark') || fullText.includes('shock')) {
    safetyHazards.push('High-voltage electrocution risk');
  }
  if (fullText.includes('tire') || fullText.includes('rim') || category === 'pothole') {
    safetyHazards.push('Vehicle wheel/tire blowout hazard');
  }
  if (nearSchoolZone) {
    safetyHazards.push(`High pedestrian child density (${schoolName})`);
  }
  if (nearHospitalZone) {
    safetyHazards.push(`Emergency vehicle / ambulance response route (${hospitalName})`);
  }
  if (category === 'water_leak' || fullText.includes('sinkhole') || fullText.includes('bulge')) {
    safetyHazards.push('Sub-surface road substrate undermining / sinkhole collapse');
  }
  if (category === 'traffic_signal' || fullText.includes('crosswalk')) {
    safetyHazards.push('Uncontrolled pedestrian crossing conflict');
  }
  if (safetyHazards.length === 0) {
    safetyHazards.push('General municipal right-of-way obstruction');
  }

  // 6. Explainable Priority Calculation
  const vulnerableZoneBonus = Math.round(
    (nearSchoolZone ? 18 * weights.schoolZoneMultiplier : 0) +
    (nearHospitalZone ? 15 * weights.hospitalZoneMultiplier : 0)
  );
  
  // Velocity bonus if duplicates exist nearby
  const duplicateVelocityBonus = Math.min(
    25,
    Math.round(duplicateMatches.length * 8 * weights.duplicateVelocityWeight)
  );

  // Weather risk modifier (e.g. rain storm forecasted adds to water/pothole risks)
  const isWeatherSensitive = category === 'pothole' || category === 'water_leak' || category === 'flooding' || category === 'downed_wire';
  const weatherRiskModifier = isWeatherSensitive ? Math.round(12 * weights.weatherImpactWeight) : 4;

  const structuralHazardBonus = category === 'downed_wire' ? 15 : category === 'water_leak' ? 12 : 5;

  const rawScore =
    baseSeverity * weights.baseSeverityWeight +
    vulnerableZoneBonus +
    duplicateVelocityBonus +
    weatherRiskModifier +
    structuralHazardBonus;

  const calculatedScore = Math.min(100, Math.max(10, Math.round(rawScore)));

  // Urgency classification
  let urgency: UrgencyLevel = 'moderate';
  if (calculatedScore >= 85) urgency = 'critical';
  else if (calculatedScore >= 70) urgency = 'high';
  else if (calculatedScore >= 45) urgency = 'moderate';
  else urgency = 'low';

  const explainableFactors: ExplainableFactors = {
    baseSeverity,
    vulnerableZoneBonus,
    duplicateVelocityBonus,
    weatherRiskModifier,
    structuralHazardBonus,
    calculatedScore,
  };

  const reasoningBrief = `${category.replace('_', ' ').toUpperCase()} triage score ${calculatedScore}/100. ${
    nearSchoolZone ? `[School Zone 1.5x active] ` : ''
  }${nearHospitalZone ? `[Hospital Corridor 1.4x active] ` : ''}${
    duplicateMatches.length > 0 ? `[${duplicateMatches.length} existing duplicate(s) clustered] ` : ''
  }Assigned to ${department} with ${baseSla}h SLA target.`;

  return {
    category,
    urgency,
    priorityScore: calculatedScore,
    safetyHazards,
    department,
    slaHours: baseSla,
    nearSchoolZone,
    schoolName,
    nearHospitalZone,
    hospitalName,
    duplicateMatches,
    explainableFactors,
    reasoningBrief,
  };
}

// Function to generate automated AI Action Brief for clusters
export function generateClusterBrief(cluster: HotspotCluster, issues: CivicIssue[]): string {
  return `AI SYNTHESIS BRIEF FOR ${cluster.title.toUpperCase()}:
Clustered ${issues.length} concurrent field reports spanning ${cluster.radiusMeters}m radius. 
Primary hypothesis: ${cluster.rootCauseHypothesis}.
Recommended Equipment: ${cluster.aiActionBrief.equipmentRequired.join(', ')}.
Traffic Advisory: ${cluster.aiActionBrief.trafficImpact}.
Target Dispatch Unit: ${cluster.aiActionBrief.recommendedCrew}.`;
}
