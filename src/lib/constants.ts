import type { TopicCategory } from '@/lib/types';

// Topic name mappings and metadata - complete taxonomy with all 40 topics
export const TOPIC_MAPPINGS: Record<string, { displayName: string; description: string; category: string }> = {
  // TREATMENT & MEDICATIONS (8 topics)
  'big3_antibiotics': {
    displayName: 'Big 3 Antibiotics',
    description: 'The standard oral antibiotic combination that most patients start with - usually taken for 12+ months after cultures turn negative.',
    category: 'treatment_medications'
  },
  'iv_antibiotics': {
    displayName: 'IV Antibiotics & PICC Lines',
    description: 'IV antibiotics given through a PICC line, typically for resistant infections or when oral medications aren\'t working.',
    category: 'treatment_medications'
  },
  'inhaled_medications': {
    displayName: 'Inhaled Medications',
    description: 'Antibiotics you breathe in through a nebulizer, like Arikayce. Often added when standard treatment needs extra help.',
    category: 'treatment_medications'
  },
  'newer_antibiotics': {
    displayName: 'Newer & Alternative Antibiotics',
    description: 'Newer or alternative antibiotics used when standard treatments don\'t work or for drug-resistant infections.',
    category: 'treatment_medications'
  },
  'species_specific_treatment': {
    displayName: 'Species-Specific Treatment',
    description: 'Different NTM species (like MAC vs. abscessus) require different treatment approaches and durations.',
    category: 'treatment_medications'
  },
  'treatment_monitoring': {
    displayName: 'Treatment Monitoring',
    description: 'Regular blood tests, hearing tests, and other monitoring needed while on NTM medications to watch for side effects.',
    category: 'treatment_medications'
  },
  'surgical_treatment': {
    displayName: 'Surgical Options',
    description: 'Lung surgery options like removing infected lung sections when medications alone aren\'t sufficient.',
    category: 'treatment_medications'
  },
  'alternative_therapies': {
    displayName: 'Alternative & Supportive Therapies',
    description: 'Vitamins, supplements, and other supportive approaches people use alongside medical treatment.',
    category: 'treatment_medications'
  },

  // HEALTH COMPLICATIONS (6 topics)
  'hearing_complications': {
    displayName: 'Hearing Loss & Tinnitus',
    description: 'Hearing problems from medications - hearing loss, ringing in ears, or changes in hearing that need monitoring.',
    category: 'health_complications'
  },
  'hemoptysis_bleeding': {
    displayName: 'Hemoptysis (Coughing Blood)',
    description: 'Blood in sputum or coughing up blood - when to worry, when to call the doctor, and how to manage it.',
    category: 'health_complications'
  },
  'medication_side_effects': {
    displayName: 'Medication Side Effects',
    description: 'Side effects from NTM medications like nausea, changes in skin color, liver problems, or taste changes.',
    category: 'health_complications'
  },
  'coinfections': {
    displayName: 'Co-infections',
    description: 'Other lung infections that can happen along with NTM, like aspergillus (fungal) or pseudomonas (bacterial).',
    category: 'health_complications'
  },
  'digestive_issues': {
    displayName: 'GERD & Digestive Issues',
    description: 'Acid reflux and stomach problems that are common with NTM and can affect medication absorption.',
    category: 'health_complications'
  },
  'other_complications': {
    displayName: 'Other Medical Complications',
    description: 'Other health issues that can develop, like heart problems, severe fatigue, or unexplained weight loss.',
    category: 'health_complications'
  },

  // AIRWAY CLEARANCE (5 topics)
  'nebulizers': {
    displayName: 'Nebulizers',
    description: 'Machines that turn liquid medications into mist you can breathe in - used for saline, albuterol, or inhaled antibiotics.',
    category: 'airway_clearance'
  },
  'vest_therapy': {
    displayName: 'Airway Clearance Vests',
    description: 'Vibrating vests that help shake mucus loose from your lungs - worn for 20-30 minutes multiple times daily.',
    category: 'airway_clearance'
  },
  'aerobika_opep': {
    displayName: 'Aerobika & OPEP Devices',
    description: 'Small handheld devices that create vibrations while you breathe out to help move mucus - often used with nebulizers.',
    category: 'airway_clearance'
  },
  'manual_techniques': {
    displayName: 'Manual Airway Clearance',
    description: 'Breathing techniques and positions you can do without equipment to help clear mucus from your lungs.',
    category: 'airway_clearance'
  },
  'saline_therapy': {
    displayName: 'Saline Therapy',
    description: 'Salt water solutions you breathe in through a nebulizer to help thin mucus and make it easier to cough up.',
    category: 'airway_clearance'
  },

  // EQUIPMENT CARE (4 topics)
  'equipment_sterilization': {
    displayName: 'Equipment Sterilization',
    description: 'How to properly clean and sterilize your nebulizer parts, tubing, and other equipment to prevent reinfection.',
    category: 'equipment_care'
  },
  'equipment_maintenance': {
    displayName: 'Equipment Maintenance & Replacement',
    description: 'When to replace equipment parts like nebulizer tubing, filters, and other components to keep everything working properly.',
    category: 'equipment_care'
  },
  'travel_equipment': {
    displayName: 'Travel & Portable Equipment',
    description: 'Portable equipment options for travel and tips for getting through airport security with medical devices.',
    category: 'equipment_care'
  },
  'home_iv_care': {
    displayName: 'Home IV & PICC Care',
    description: 'How to care for PICC lines at home, including flushing, dressing changes, and managing IV supplies.',
    category: 'equipment_care'
  },

  // TESTING & MONITORING (4 topics)
  'sputum_cultures': {
    displayName: 'Sputum Cultures & Results',
    description: 'Monthly sputum tests to track infection - how to collect good samples and what the results mean.',
    category: 'testing_monitoring'
  },
  'imaging_scans': {
    displayName: 'CT Scans & Chest Imaging',
    description: 'Chest CT scans and X-rays to monitor lung changes, nodules, cavities, and track treatment progress.',
    category: 'testing_monitoring'
  },
  'bronchoscopy': {
    displayName: 'Bronchoscopy',
    description: 'A procedure where a thin tube with a camera goes into your lungs to look around and collect samples.',
    category: 'testing_monitoring'
  },
  'resistance_testing': {
    displayName: 'Drug Sensitivity & Resistance Testing',
    description: 'Tests to find out which medications your specific NTM infection is sensitive to and which ones won\'t work.',
    category: 'testing_monitoring'
  },

  // SAFETY & ENVIRONMENT (4 topics)
  'water_safety': {
    displayName: 'Water Safety',
    description: 'Making your home water safer - shower filters, water heater settings, and avoiding water sources that might contain NTM.',
    category: 'safety_environment'
  },
  'environmental_exposures': {
    displayName: 'Environmental Exposures',
    description: 'Places and activities to be careful with - hot tubs, gardening, dusty areas, and other environmental risks.',
    category: 'safety_environment'
  },
  'travel_safety': {
    displayName: 'Travel Safety',
    description: 'Staying safe while traveling - hotel room precautions, international travel considerations, and vacation planning.',
    category: 'safety_environment'
  },
  'infection_prevention': {
    displayName: 'Infection Prevention',
    description: 'Protecting yourself from other respiratory infections that could make NTM worse - when to wear masks, crowd avoidance.',
    category: 'safety_environment'
  },

  // DAILY LIVING (4 topics)
  'work_employment': {
    displayName: 'Work & Employment',
    description: 'Working with NTM - job accommodations, disability considerations, managing fatigue, and return-to-work planning.',
    category: 'daily_living'
  },
  'exercise_activity': {
    displayName: 'Exercise & Physical Activity',
    description: 'Staying active with NTM - safe exercise options, managing shortness of breath, and modifying activities as needed.',
    category: 'daily_living'
  },
  'family_relationships': {
    displayName: 'Family & Relationships',
    description: 'How NTM affects family life, getting support from loved ones, and helping family members understand the disease.',
    category: 'daily_living'
  },
  'nutrition_lifestyle': {
    displayName: 'Nutrition & Daily Routine',
    description: 'Eating well with NTM, managing weight changes, dealing with appetite issues, and maintaining daily routines.',
    category: 'daily_living'
  },

  // SUPPORT & RESOURCES (5 topics)
  'emotional_support': {
    displayName: 'Emotional Support & Mental Health',
    description: 'Dealing with the emotional side of NTM - anxiety, depression, coping strategies, and mental health support.',
    category: 'support_resources'
  },
  'patient_stories': {
    displayName: 'Patient Stories & Experiences',
    description: 'Real stories from other patients about their NTM journey - treatment experiences, challenges, and successes.',
    category: 'support_resources'
  },
  'medical_centers': {
    displayName: 'Doctors & Medical Centers',
    description: 'Finding the right doctors and medical centers that specialize in NTM treatment and have experience with the disease.',
    category: 'support_resources'
  },
  'insurance_costs': {
    displayName: 'Insurance & Financial Issues',
    description: 'Dealing with insurance coverage for treatments, managing high medication costs, and financial assistance options.',
    category: 'support_resources'
  },
  'research_trials': {
    displayName: 'Research & Clinical Trials',
    description: 'Information about research studies, clinical trials for new treatments, and staying updated on NTM research.',
    category: 'support_resources'
  }
};

export const CATEGORIES: Record<string, { displayName: string; description: string; emoji: string }> = {
  treatment_medications: {
    displayName: 'Treatment & Medications',
    description: 'Antibiotic protocols, treatment regimens, surgical options, and monitoring',
    emoji: '💊'
  },
  health_complications: {
    displayName: 'Health Complications',
    description: 'Medication side effects, hearing issues, bleeding, and other complications',
    emoji: '⚠️'
  },
  airway_clearance: {
    displayName: 'Airway Clearance',
    description: 'Nebulizers, vests, manual techniques, and mucus clearance methods',
    emoji: '🫁'
  },
  equipment_care: {
    displayName: 'Equipment Care',
    description: 'Sterilization, maintenance, travel equipment, and home IV care',
    emoji: '🔧'
  },
  testing_monitoring: {
    displayName: 'Testing & Monitoring',
    description: 'Sputum cultures, imaging scans, bronchoscopy, and resistance testing',
    emoji: '🔬'
  },
  safety_environment: {
    displayName: 'Safety & Environment',
    description: 'Water safety, environmental exposures, travel safety, and infection prevention',
    emoji: '🛡️'
  },
  daily_living: {
    displayName: 'Daily Living',
    description: 'Work, exercise, family relationships, and nutrition management',
    emoji: '🏠'
  },
  support_resources: {
    displayName: 'Support & Resources',
    description: 'Emotional support, patient stories, medical centers, insurance, and research',
    emoji: '🤝'
  }
};

export const APP_CONFIG = {
  name: 'NTM Community Insights',
  description: 'Discover organized community knowledge from manually-curated NTM forum discussions',
  version: '1.0.0',
  author: 'NTM Community',
  repository: 'https://github.com/ntm-community/insights',
  totalThreads: 959,
  totalTopics: 40,
  totalCategories: 8,
  lastUpdated: '2025-11-16'
};

export const UI_CONFIG = {
  itemsPerPage: 12,
  maxSearchResults: 50,
  defaultSortBy: 'latest',
  defaultTimeRange: 'all'
};

export const FILTER_OPTIONS = {
  timeRange: [
    { value: 'all', label: 'All Time' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
    { value: '2years', label: 'Last 2 Years' }
  ],
  sortBy: [
    { value: 'latest', label: 'Latest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'mostActive', label: 'Most Active' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ]
};

export const EXTERNAL_LINKS = {
  ntmForum: 'https://ntmforum.org',
  ntmInfo: 'https://ntminfo.org',
  originalThread: (threadFile: string) =>
    `https://ntmforum.org/thread/${threadFile.replace('.md', '')}`,
};