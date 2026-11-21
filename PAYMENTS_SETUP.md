# Razorpay Payment Integration - Vagvat Ayurveda

This repository supports two ways to accept payments via Razorpay:

---

## ⚡ Option 1: Quick Setup (Direct Razorpay Checkout)

Ideal for getting payments running immediately without deploying extra cloud infrastructure.

1. **Obtain your Razorpay Key ID**:
   - Log into the [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys).
   - In Test Mode (or Live Mode), go to **Settings → API Keys → Generate Key**.
   - Copy the **Key ID** (e.g. `rzp_test_...` or `rzp_live_...`).

2. **Set the Environment Variable**:
   In your root `.env` file (or Vercel / Netlify dashboard under Environment Variables):
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
   VITE_ENABLE_ONLINE_PAYMENTS=true
   ```

3. **How it works**:
   - When customers click **"Proceed to Payment"**, the official Razorpay Checkout modal opens.
   - Customers can pay via **UPI (Google Pay, PhonePe, Paytm, BHIM)**, **Debit/Credit Cards**, **Net Banking**, and **Wallets**.
   - Upon successful payment, Razorpay returns a verified `payment_id` (`pay_...`).
   - The order is confirmed in the customer's browser, synced to Cloud Firestore under `/orders/{orderId}`, and stored locally for the Admin Dashboard.

---

## 🛡️ Option 2: Full Server-Verified Setup (Cloudflare Worker + Spark)

For high-volume production stores wanting server-side Razorpay order pre-generation, HMAC signature verification, and automated webhook reconciliation on the free Firebase Spark plan:

The backend runs in `worker/` using a Cloudflare Worker + Cloudflare D1 database:

1. **Cloudflare Setup**:
   - Add `vagvatayurveda.com` as an active Cloudflare DNS zone.
   - Create a Cloudflare D1 database named `vagvat-checkout`:
     ```sh
     cd worker
     npm install
     npx wrangler d1 create vagvat-checkout
     ```
   - Paste the database ID into `worker/wrangler.jsonc` in place of `REPLACE_WITH_D1_DATABASE_ID`.
   - Run the migration:
     ```sh
     npx wrangler d1 migrations apply vagvat-checkout --remote
     ```

2. **Add Worker Secrets**:
   Store secrets securely via Wrangler CLI or Cloudflare Dashboard:
   ```sh
   npx wrangler secret put RAZORPAY_KEY_ID
   npx wrangler secret put RAZORPAY_KEY_SECRET
   npx wrangler secret put RAZORPAY_WEBHOOK_SECRET
   npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_JSON
   ```
   *(Optional)* If using Cloudflare Turnstile bot protection:
   ```sh
   npx wrangler secret put TURNSTILE_SECRET_KEY
   ```

3. **Deploy Worker**:
   ```sh
   npx wrangler deploy
   ```

4. **Connect Storefront**:
   Add this to your storefront environment (Vercel / `.env`):
   ```env
   VITE_PAYMENT_API_URL=https://api.vagvatayurveda.com
   VITE_ENABLE_ONLINE_PAYMENTS=true
   ```

5. **Configure Razorpay Webhook**:
   - In Razorpay Dashboard → **Settings → Webhooks → Add New Webhook**.
   - URL: `https://api.vagvatayurveda.com/webhooks/razorpay`
   - Secret: Same as `RAZORPAY_WEBHOOK_SECRET`
   - Active Events: Select `payment.captured`.

---

## 🧪 Testing Razorpay Payments

Razorpay provides standard test credentials:
- **UPI**: Enter `success@razorpay` to simulate a successful payment, or `failure@razorpay` for failure.
- **Cards**: Use test card numbers documented at [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/).
- **Netbanking**: Select any bank and click "Success" on the simulated bank page.
