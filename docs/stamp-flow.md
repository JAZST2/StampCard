# Stamp Earning Flow

## Goal
Business grants stamps securely and consistently without client-side trust.

## Actors
- Business staff (scanner)
- Customer (owns card progress)
- Backend function: `add_stamp_atomic`

## Input
- `businessId`
- `userId`
- `stampCardId`

## Backend Steps (Atomic)
1. Verify caller owns the business.
2. Ensure `user_stamp_cards` row exists.
3. Increment `current_stamps` by 1.
4. Insert `transactions` row with `type='earn'`.
5. Check milestone hit:
   - if yes, create `reward_claims` with `status='pending'`.
6. Return updated stamp count + optional pending claim ID.

## Expected DB Changes
- `user_stamp_cards.current_stamps` increases by 1
- new `transactions` row (`earn`)
- optional new `reward_claims` row (`pending`)

## Why This Matters
- Prevents race conditions and partial updates
- Guarantees all stamp operations are auditable
