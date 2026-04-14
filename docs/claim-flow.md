# Reward Claim Flow

## Goal
Allow one-time reward redemption with replay protection.

## Customer Side
1. Customer sees pending reward.
2. App generates claim QR payload:
   - `rewardClaimId`
   - `userId`
3. Customer presents QR to business.

## Business Side
1. Business scans claim QR.
2. App sends `rewardClaimId` to backend function `confirm_reward_claim`.

## Backend Validation
1. Claim exists.
2. Caller owns business of this claim.
3. Claim status is `pending`.
4. Update claim:
   - `status='claimed'`
   - `claimed_at=now()`
5. Update `user_stamp_cards.last_reward_claimed_at`.
6. Insert `transactions` row (`redeem`).

## Replay Protection
- If status is not `pending`, reject request.
- Same QR cannot be reused.

## Why This Matters
- Stops fraud
- Keeps claims traceable for customer support and auditing
