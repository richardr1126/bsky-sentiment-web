export interface SentimentData {
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  probabilities: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface Post {
  uri: string;
  cid: string;
  author: string; // DID of the author
  text: string;
  sentiment?: SentimentData;
  processed_at?: number;
  processor?: string;
}

export interface SentimentStats {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}
