export interface PersonLocation {
  name: string;
  latitude: number;
  longitude: number;
  region: string;
  district: string;
}

export interface Person {
  id: string;
  full_name: string;
  age: number | null;
  gender: "male" | "female" | "other" | "unknown";
  /** Local path ("/photos/x.jpg", preferred) or remote https URL (proxied at runtime). */
  photo_path: string;
  last_seen_date: string; // ISO date
  location: PersonLocation;
  status: "missing" | "found_alive" | "found_deceased" | "unknown";
  circumstances: string;
  tags: string[];
  verified: boolean;
  sources: string[];
  is_public: boolean;
  created_at: string;
  /** Internal only — stripped from every public build. */
  moderator_notes?: string;
}
