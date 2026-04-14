# RLS Rules (Access Control)

## Goal
Ensure data isolation in a multi-business system.

## Customer Access
- Can read own rows:
  - `user_stamp_cards`
  - `reward_claims`
  - `transactions`
- Can create own membership (`user_stamp_cards` insert for self).
- Cannot directly grant stamps or mark claims as claimed.

## Business Access
- Can read/write only businesses they own.
- Can manage own `stamp_cards` and `stamp_milestones`.
- Can read customer progress/claims tied to own business.
- Sensitive actions must use backend functions:
  - `add_stamp_atomic`
  - `confirm_reward_claim`

## Security Principles
- Never trust QR payload alone.
- Validate ownership and claim status in backend.
- Keep all stamp/claim operations in transaction ledger.

## Quick Verification Checklist
- As customer, query another user's claim -> denied.
- As business A, query business B claims -> denied.
- As customer, update `current_stamps` directly -> denied.
