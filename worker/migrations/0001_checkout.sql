CREATE TABLE IF NOT EXISTS checkout_sessions (
  internal_order_id TEXT PRIMARY KEY,
  razorpay_order_id TEXT UNIQUE,
  payload_json TEXT NOT NULL,
  amount_paise INTEGER NOT NULL,
  status TEXT NOT NULL,
  payment_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS checkout_sessions_gateway_order_idx
  ON checkout_sessions (razorpay_order_id);

CREATE INDEX IF NOT EXISTS checkout_sessions_created_at_idx
  ON checkout_sessions (created_at);

CREATE TABLE IF NOT EXISTS webhook_events (
  event_id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  processed_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS webhook_events_processed_at_idx
  ON webhook_events (processed_at);
