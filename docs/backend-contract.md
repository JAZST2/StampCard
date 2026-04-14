# Backend Contract (MVP)

## Purpose
Define exact request/response behavior for each backend action so UI and backend stay aligned.

## 1) `sendOtp`
### Who can call
- Public/authenticated user

### Input
- `email: string` (required)

### Validation rules
- Must be valid email format

### Success output
- `200 OK` with no payload, or `{ success: true }`

### Error output
- `INVALID_EMAIL`
- `OTP_SEND_FAILED`

### DB side effects
- Managed by Supabase Auth (OTP challenge created)

---

## 2) `verifyOtp`
### Who can call
- Public/authenticated user

### Input
- `email: string` (required)
- `token: string` (required)

### Validation rules
- Token must be valid and not expired

### Success output
- `{ user, session }`

### Error output
- `OTP_INVALID`
- `OTP_EXPIRED`
- `VERIFY_FAILED`

### DB side effects
- Supabase session established
- App should upsert `public.users` profile row

---

## 3) `joinStampCard`
### Who can call
- Authenticated customer

### Input
- `userId: uuid` (required; should match `auth.uid()`)
- `stampCardId: uuid` (required)

### Validation rules
- `userId` must equal authenticated user
- `stampCardId` must exist

### Success output
- `{ userStampCardId, userId, stampCardId, currentStamps }`

### Error output
- `UNAUTHORIZED`
- `STAMP_CARD_NOT_FOUND`
- `ALREADY_JOINED` (or idempotent success)

### DB side effects
- Insert into `user_stamp_cards` if not exists (idempotent)

---

## 4) `addStampAtomic`
### Who can call
- Authenticated business owner/staff (owner in MVP)

### Input
- `businessId: uuid` (required)
- `userId: uuid` (required)
- `stampCardId: uuid` (required)

### Validation rules
- Caller must own `businessId`
- `stampCardId` must belong to `businessId`
- `userId` must be valid customer

### Success output
- `{ userStampCardId, currentStamps, pendingRewardClaimId | null }`

### Error output
- `NOT_OWNER`
- `BUSINESS_NOT_FOUND`
- `STAMP_CARD_NOT_FOUND`
- `ADD_STAMP_FAILED`

### DB side effects
- Ensure `user_stamp_cards` row exists
- Increment `current_stamps`
- Insert one `transactions(type='earn')`
- If milestone hit, insert one `reward_claims(status='pending')`

---

## 5) `confirmRewardClaim`
### Who can call
- Authenticated business owner/staff (owner in MVP)

### Input
- `rewardClaimId: uuid` (required)

### Validation rules
- Claim must exist
- Caller must own the claim's business
- Claim status must be `pending`

### Success output
- `{ rewardClaimId, status: 'claimed', claimedAt }`

### Error output
- `CLAIM_NOT_FOUND`
- `NOT_OWNER`
- `CLAIM_NOT_PENDING`
- `CLAIM_CONFIRM_FAILED`

### DB side effects
- Update `reward_claims` -> `claimed`, `claimed_at=now()`
- Update `user_stamp_cards.last_reward_claimed_at`
- Insert one `transactions(type='redeem')`

## Cross-Cutting Rules
- All sensitive writes happen on backend (RPC/Edge Function), not directly from client.
- Client QR payload is only an identifier; backend performs full validation.
- Every earn/redeem must create a `transactions` row for auditability.
