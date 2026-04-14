# Data Model (MVP)

## Purpose
Define one shared understanding of the database so mobile and future web back office use the same rules.

## Core Tables
- `users`: app profile linked to `auth.users`
- `businesses`: merchant records; each has an owner (`owner_id`)
- `stamp_cards`: loyalty programs per business
- `stamp_milestones`: rewards at specific stamp counts
- `user_stamp_cards`: customer progress per stamp card
- `transactions`: immutable ledger (`earn` or `redeem`)
- `reward_claims`: claim lifecycle (`pending`, `claimed`, `expired`)

## Key Relationships
- One `business` has many `stamp_cards`
- One `stamp_card` has many `stamp_milestones`
- One `user` can join many `stamp_cards` through `user_stamp_cards`
- `transactions` track all stamp/claim events
- `reward_claims` tie user + business + card + milestone

## Important Constraints
- `user_stamp_cards`: unique `(user_id, stamp_card_id)`
- `stamp_milestones`: unique `(stamp_card_id, stamp_count)`
- `reward_claims.status`: enum (`pending`, `claimed`, `expired`)
- `transactions.type`: enum (`earn`, `redeem`)

## Why This Matters
- Prevents duplicate memberships/rewards
- Keeps reward logic predictable
- Makes debugging easier because each action has a ledger row
