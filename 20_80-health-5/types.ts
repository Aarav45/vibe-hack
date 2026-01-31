
export interface User {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string; // Formatted as +91 XXXXX XXXXX
  city: string;
  state: string;
  password: string; // btoa hashed
  createdAt: string;
  lastLogin: string;
}

export interface Psychiatrist {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  experience: string;
  contactNumber: string;
  email: string;
  address: string;
  hospitalAffiliation?: string;
  consultationFee: string; // e.g., "₹1200"
  acceptingNewPatients: boolean;
  languages: string[];
  availableDays: string;
  rating: number;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  address: string;
  timings?: string;
  entryFee?: string;
  ticketRange?: string;
  // Added upcomingEvents property as used in placesService.ts
  upcomingEvents?: string;
  rating: number;
  // Made googleMapsLink optional as some entries (like events) in placesService.ts don't have it
  googleMapsLink?: string;
  website?: string;
  highlights?: string[];
  amenities?: string[];
  image: string; // emoji icon
}

export interface CityPlacesData {
  tier: 1 | 2 | 3;
  parks: Place[];
  cinemas: Place[];
  events: Place[];
  sightseeing: Place[];
}

export interface MoodEntry {
  date: string;
  mood: number;
  note: string;
  timestamp: number;
  detectionMethod?: 'ai-vision' | 'manual';
  userId?: string;
}

export interface MoodData {
  emoji: string;
  color: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: number;
}

export type TabType = 'tracker' | 'dashboard' | 'chatbot' | 'insights' | 'resources' | 'profile' | 'explore';

export interface Milestone {
  id: string;
  icon: string;
  title: string;
  desc: string;
  achieved: boolean;
}
