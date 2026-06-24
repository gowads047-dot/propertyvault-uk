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
  property_id: string | null;
  user_id: string;
  // new columns (added via rentura-patch.sql)
  first_name: string;
  last_name: string;
  tenancy_start: string | null;
  tenancy_end: string | null;
  status: "active" | "pending" | "notice" | "former";
  deposit_held: boolean;
  // legacy columns kept for dashboard compatibility
  name?: string;
  move_in_date?: string | null;
  move_out_date?: string | null;
  is_current?: boolean;
  email: string | null;
  phone: string | null;
  monthly_rent: number | null;
  deposit_amount: number | null;
  deposit_scheme: string | null;
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

export type MaintenanceCategory = "plumbing" | "electrical" | "structural" | "appliance" | "damp" | "roofing" | "other";
export type MaintenanceUrgency = "emergency" | "urgent" | "routine";
export type MaintenanceStatus = "open" | "in_progress" | "resolved";

export interface RenturaMaintenance {
  id: string;
  property_id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: MaintenanceCategory;
  urgency: MaintenanceUrgency;
  status: MaintenanceStatus;
  contractor_name: string | null;
  contractor_company: string | null;
  contractor_phone: string | null;
  contractor_email: string | null;
  estimated_cost: number | null;
  quoted_cost: number | null;
  actual_cost: number | null;
  reported_date: string;
  scheduled_date: string | null;
  resolved_date: string | null;
  is_improvement: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
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
