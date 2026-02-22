export interface ParticipantsPayments {
  id: number;
  registration_id: number;
  status: string;
  payment_screenshot: "no_payment" | "payment_done" | "verified_payment";
  created_at: Date;
  paid_at: Date;
  transaction_id?: string;
}
