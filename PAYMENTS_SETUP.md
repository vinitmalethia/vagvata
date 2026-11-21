# Secure payment setup

The payment backend runs in Firebase Cloud Functions. Razorpay credentials are read only by Functions from Google Secret Manager; never put them in `src/`, Vercel `VITE_` variables, Git, or chat.

## Firebase and Razorpay setup

1. Ensure project `vagvat-98c70` has Firestore, Cloud Functions, and the Blaze billing plan enabled. Set budget alerts before deployment.
2. Register the web app in Firebase App Check with reCAPTCHA v3, then add its **site key** as `VITE_FIREBASE_APPCHECK_SITE_KEY` in Vercel for Production and Preview. The callable payment functions require valid App Check tokens.
3. Add the Razorpay **test-mode** values to Firebase Secret Manager. Run each command below and enter its value only at the interactive prompt (do not put values in the command, terminal history, chat, or Git):

   ```sh
   firebase functions:secrets:set RAZORPAY_KEY_ID --project vagvat-98c70
   firebase functions:secrets:set RAZORPAY_KEY_SECRET --project vagvat-98c70
   firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET --project vagvat-98c70
   ```
4. Deploy `firestore.rules` and the Functions with `firebase deploy --only firestore:rules,functions --project vagvat-98c70`.
5. In Razorpay Test Mode, configure a webhook to the deployed `razorpayWebhook` function URL and subscribe to `payment.captured`. Use the same webhook secret as `RAZORPAY_WEBHOOK_SECRET`.
6. Enable automatic payment capture in Razorpay. The order is confirmed only after the backend verifies the signature and confirms that Razorpay reports the matching amount as captured.
7. Complete successful and failed **test-mode** checkout transactions before switching the three Secrets to the Live pair. Do not enable live checkout until this passes.
8. After switching Secrets to Live values, set `VITE_ENABLE_ONLINE_PAYMENTS=true` in Vercel and redeploy. The public Razorpay Key ID is returned by the server when checkout starts; no payment secret is exposed to the browser.

If App Check, Functions, secrets, or the live-payment flag is missing, production checkout remains unavailable. Unpaid test orders can be enabled separately with `VITE_ENABLE_TEST_ORDERS=true` for a preview deployment.
