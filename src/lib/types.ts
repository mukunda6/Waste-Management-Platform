

export type IssueStatus = 'Submitted' | 'In Progress' | 'Resolved';
export type SlaStatus = 'On Time' | 'At Risk' | 'Deadline Missed' | 'Extended' | 'Escalated';

export type IssueCategory = 
  | 'Garbage Not Collected'
  | 'Overflowing Bins'
  | 'Illegal Dumping'
  | 'Non-segregation of Waste'
  | 'Collection Vehicle Late'
  | 'Public Area Unclean'
  | 'Water Supply'
  | 'Drainage'
  | 'Roads & Footpaths'
  | 'Streetlights'
  | 'Parks & Trees'
  | 'Stray Animals';

export type EmergencyCategory =
  | 'Hazardous Waste Spillage'
  | 'Biomedical Waste Dumped'
  | 'Dead Animal'
  | 'Chemical Leak'
  | 'Major Garbage Fire';

export type UserRole = 'Citizen' | 'Admin' | 'Head' | 'Worker';

export interface AppUser {
    uid: string;
    name: string; // This will now be the translated name
    nameKey: string; // Key for translation
    email: string;
    role: UserRole;
    avatarUrl: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory | EmergencyCategory;
  status: IssueStatus;
  city?: string;
  slaStatus: SlaStatus;
  slaDeadline: string; // ISO string
  location: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  imageHint: string;
  submittedBy: {
    uid:string;
    name: string; // This will now be the translated name
    nameKey: string; // Key for translation
    email: string;
  };
  submittedAt: string;
  assignedTo?: string; // Worker ID
  updates: {
    status: IssueStatus;
    updatedAt: string;
    description: string;
    imageUrl?: string;
    imageHint?: string;
    isSlaUpdate?: boolean; // To differentiate SLA remarks from regular updates
  }[];
  isEmergency?: boolean;
}

export interface Worker {
  id: string;
  name: string; // This will now be the translated name
  nameKey: string; // Key for translation
  area: string;
  avatarUrl: string;
}
