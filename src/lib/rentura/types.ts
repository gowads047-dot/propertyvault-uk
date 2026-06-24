export type TrustLevel = "verified" | "confirmed" | "suggested";
export type PropertyType = "house" | "flat" | "hmo" | "commercial" | "other";
export type EventType =
  | "payment" | "maintenance_logged" | "maintenance_resolved"
  | "maintenance_cost" | "tenant_in" | "tenant_out"
  | "compliance" | "mortgage" | "rent_review" | "arrears" | "note" | "property_created";

export interface RenturaProperty {
  id: string;
  user_id: string;
  address: string;
  nickname: string | null;
  property_type: PropertyType;
  bedrooms: number | null;
  purchase_date: string | null;
  purchase_price: number | null;
  current_value: number | null;
  created_at: string;
  updated_at: string;
}

export interface RenturaEvent {
  id: string;
  property_id: string;
  user_id: string;
  event_type: EventType;
  title: string;
  description: string | null;
  amount: number | null;
  trust_level: TrustLevel;
  metadata: Record<string, unknown>;
  event_date: string;
  created_at: string;
}

export interface RenturaTenant {
  id: string;
  property_id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  monthly_rent: number | null;
  move_in_date: string | null;
  move_out_date: string | null;
  deposit_amount: number | null;
  deposit_scheme: string | null;
  is_current: boolean;
  created_at: string;
}

export interface RenturaMortgage {
  id: string;
  property_id: string;
  user_id: string;
  lender: string | null;
  product_name: string | null;
  interest_rate: number | null;
  monthly_payment: number | null;
  remaining_balance: number | null;
  fixed_term_expiry: string | null;
  erc_expiry: string | null;
  svr_rate: number | null;
  trust_level: TrustLevel;
  is_current: boolean;
  created_at: string;
}

export interface RenturaCompliance {
  id: string;
  property_id: string;
  user_id: string;
  certificate_type: string;
  issue_date: string | null;
  expiry_date: string | null;
  trust_level: TrustLevel;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyWithDetails extends RenturaProperty {
  tenants: RenturaTenant[];
  mortgages: RenturaMortgage[];
  compliance: RenturaCompliance[];
  events: RenturaEvent[];
}

export interface Alert {
  property_id: string;
  property_address: string;
  type: "compliance" | "mortgage" | "arrears" | "void" | "rent_review";
  urgency: "urgent" | "action" | "info";
  title: string;
  detail: string;
  days_remaining?: number;
  action_label?: string;
}
