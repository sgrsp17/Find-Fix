export type UserRole = 'client' | 'professional' | 'staff';

export type Urgency = 'low' | 'medium' | 'high';

export interface RepairDiagnosis {
  probableCauses: string[];
  urgency: Urgency;
  priceRange: { min: number; max: number; currency: 'EUR' };
}
