// Glossary data types for NTM medical terminology

export interface GlossaryDefinition {
  text: string;
  source_thread: string;
  context: string;
}

export interface UsageExample {
  text: string;
  source_thread: string;
  context: string;
}

export interface GlossaryTerm {
  title: string;
  category: string;
  canonical: string;
  variants: string[];
  type: string;
  related_terms: string[];
  manual_definition?: string;
  definitions?: GlossaryDefinition[];
  usage_examples?: UsageExample[];
  keywords?: string[];
  definition_short?: string;
  definition_long?: string;
  extracted_definitions?: GlossaryDefinition[];
  extracted_examples?: UsageExample[];
  usage_notes?: string;
}

export interface GlossaryStatistics {
  total_terms: number;
  terms_with_manual_definitions: number;
  terms_with_extracted_data: number;
  terms_with_examples: number;
  categories: Record<string, number>;
}

export interface GlossaryData {
  version: string;
  generated_date: string;
  description: string;
  statistics: GlossaryStatistics;
  terms: Record<string, GlossaryTerm>;
}

// UI-specific types
export interface GlossaryCategory {
  name: string;
  count: number;
}

export interface GlossaryTermCardProps {
  term: GlossaryTerm;
  termTitle: string;
  onClick?: () => void;
}

export interface GlossaryViewProps {
  data: GlossaryData;
  searchQuery?: string;
  selectedCategory?: string;
}
