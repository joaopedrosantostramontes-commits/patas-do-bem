export type AnimalSpecies = "dog" | "cat" | "other";

export type CampaignCategory = 
  | "surgery" 
  | "treatment" 
  | "food" 
  | "shelter" 
  | "emergency";

export interface Campaign {
  id: string;
  title: string;
  animalName: string;
  species: AnimalSpecies;
  age: string;
  breed: string;
  location: string;
  rescuerName: string;
  rescuerType: "independent" | "ong";
  category: CampaignCategory;
  categoryLabel: string;
  imageUrl: string;
  summary: string;
  story: string;
  targetAmount: number;
  raisedAmount: number;
  supportersCount: number;
  urgency: "high" | "medium" | "low";
  createdAt: string;
  updates: Array<{
    date: string;
    description: string;
  }>;
}

export interface Metric {
  label: string;
  value: string;
  description: string;
  isFictional: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: "doador" | "protetor" | "plataforma";
}

// Re-export dos tipos relacionais do banco de dados (Supabase)
export * from "./database";

