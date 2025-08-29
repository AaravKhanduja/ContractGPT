export type AIProvider = 'openai' | 'ollama';

export interface AIConfig {
  provider: AIProvider;
  endpoint: string;
  model: string;
  apiKey?: string;
  timeout?: number;
}

// Development configuration - only Ollama
export const getDevAIConfig = (): AIConfig => {
  return {
    provider: 'ollama',
    endpoint: process.env.OLLAMA_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama3.2:3b',
    timeout: 60000, // Ollama can be slower
  };
};

// Production configuration - only OpenAI
export const getProdAIConfig = (): AIConfig => {
  return {
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: process.env.OPENAI_MODEL || 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
  };
};

export const getAIConfig = (): AIConfig => {
  const config = process.env.NODE_ENV === 'production' ? getProdAIConfig() : getDevAIConfig();

  return config;
};
