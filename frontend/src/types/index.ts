export interface SourceCitation {
  title: string;
  guest: string;
  company?: string;
  section?: string;
  timestamp: string;
  url?: string;
  snippet: string;
  score: number;
}

export interface Artifact {
  id?: string;
  type: 'html' | 'markdown' | 'code';
  title: string;
  content: string;
  language?: string;
  artifact_metadata?: Record<string, any>;
  created_at?: string;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  provider?: string;
  sources?: SourceCitation[];
  artifact_id?: string;
  created_at: string;
  message_metadata?: Record<string, any>;
}

export interface Session {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  session_metadata?: Record<string, any>;
  messages?: Message[];
}

export interface ProviderDetail {
  available: boolean;
  default_model: string;
  base_url?: string;
  models?: string[];
  key_configured?: boolean;
  description?: string;
}

export interface ModelsStatus {
  default_provider: string;
  providers: {
    ollama?: ProviderDetail;
    anthropic?: ProviderDetail;
    mock?: ProviderDetail;
  };
}
