# Debug Checklist Per Feature (MVP)

## How to use this
For each bug, follow:
1. Confirm trigger happened in UI
2. Confirm backend action called with expected payload
3. Confirm DB side effects
4. Check auth + RLS
5. Check function validation rules

---

## A) Auth: OTP Login
### Trigger
- User submits email and OTP

### Expected backend calls
- `sendOtp(email)`
- `verifyOtp(email, token)`

### Expected DB/session state
- Active session in client store
- `public.users` row exists for authenticated user

### If failed, check in order
1. Email/token values
2. Supabase auth errors (`invalid`, `expired`)
3. Session restore logic (`getSession`, auth listener)
4. `users` upsert error

---

## B) Join Stamp Card
### Trigger
- Customer scans JOIN QR

### Expected backend call
- `joinStampCard(userId, stampCardId)` (or equivalent insert flow)

### Expected DB changes
- One row in `user_stamp_cards` for `(user_id, stamp_card_id)`
- `current_stamps` initialized (usually `0`)

### If failed, check in order
1. QR payload has correct `stampCardId`
2. `auth.uid()` equals `userId`
3. RLS insert policy for `user_stamp_cards`
4. Unique constraint conflict handling (idempotent join)

---

## C) Add Stamp
### Trigger
- Business scans customer QR and taps add stamp

### Expected backend call
- `addStampAtomic(businessId, userId, stampCardId)`

### Expected DB changes
- `user_stamp_cards.current_stamps` +1
- New `transactions` row (`type='earn'`)
- If milestone reached: new `reward_claims` row (`status='pending'`)

### If failed, check in order
1. Payload IDs (`businessId`, `userId`, `stampCardId`)
2. Caller ownership of business
3. `stampCardId` belongs to business
4. Function execution errors
5. RLS policies and grants on function

---

## D) Claim Reward
### Trigger
- Customer shows claim QR, business scans and confirms claim

### Expected backend call
- `confirmRewardClaim(rewardClaimId)`

### Expected DB changes
- `reward_claims.status` -> `claimed`
- `reward_claims.claimed_at` set
- `user_stamp_cards.last_reward_claimed_at` set
- New `transactions` row (`type='redeem'`)

### If failed, check in order
1. `rewardClaimId` exists
2. Claim status is `pending`
3. Caller owns claim's business
4. Replay protection error (`CLAIM_NOT_PENDING`) on already used QR

---

## E) RLS/Authorization Bugs
### Symptoms
- Works in SQL editor as admin but fails in app

### Checks
1. User actually authenticated
2. Correct `auth.uid()` for actor
3. Target table RLS policy allows operation
4. Operation should be via function instead of direct table write

---

## F) Fast Incident Triage Template
- Actor: `customer` or `business`
- Action attempted:
- Payload IDs:
- Expected result:
- Actual result/error:
- DB rows before:
- DB rows after:
- Root cause:
- Fix applied:
