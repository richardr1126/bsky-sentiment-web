export interface SentimentData {
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  probabilities: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface TopicData {
  topics: string[]; // List of identified topics
  top_topic: string; // Topic with highest confidence
  top_confidence: number;
}

export interface Post {
  uri: string;
  cid: string;
  author: string; // DID of the author
  text: string;
  created_at: string; // ISO 8601 timestamp
  sentiment?: SentimentData;
  topics?: TopicData;
  processed_at?: number;
  processor?: string;
}

export interface SentimentStats {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}

export interface TopicStats {
  [topic: string]: number;
  total: number;
}
