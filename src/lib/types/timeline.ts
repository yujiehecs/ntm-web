// Timeline data types for patient journey visualization

export interface TimelineEvent {
  event_number: number;
  event_type: string;
  date: string | null;
  description: string;
  medications: string[];
  culture_result: string | null;
  side_effects: string[];
  notes: string;
}

export interface Demographics {
  age_group: string;
  location: string;
  diagnosis_year: string;
}

export interface Disease {
  species: string;
  species_short: string;
  disease_type: string;
  severity: string;
  comorbidities: string[];
}

export interface Outcome {
  category: string;
  description: string;
  months_since_completion: number | null;
}

export interface Classification {
  story_types: string[];
  complexity: string;
  educational_value: string;
  common_pattern: boolean;
}

export interface TimelineData {
  duration_months: number | null;
  event_count: number;
  events: TimelineEvent[];
}

export interface Source {
  thread_slug: string;
  original_id: string;
  thread_url: string;
}

export interface PatientTimeline {
  id: string;
  patient_label: string;
  demographics: Demographics;
  disease: Disease;
  outcome: Outcome;
  classification: Classification;
  timeline: TimelineData;
  key_insight: string;
  source: Source;
}

export interface TimelinesData {
  version: string;
  description: string;
  extraction_date: string;
  total_timelines: number;
  data_notes: string;
  timelines: PatientTimeline[];
}

export interface TimelineFilters {
  outcomes: string[];
  species: string[];
  complexity: string[];
  storyTypes: string[];
}
