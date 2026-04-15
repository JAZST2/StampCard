# Slice 2 Guide (Steps 2-6)

## 2) Data Contract First

Define these actions in your `docs/backend-contract.md` before coding UI logic:

### `createStampCard`
- **Input**
  - `businessId: uuid` (required)
  - `name: string` (required)
  - `totalStamps: number` (required)
- **Validation**
  - `name` is not empty
  - `totalStamps > 0`
- **Output**
  - Created `stamp_cards` row

### `createStampMilestone`
- **Input**
  - `stampCardId: uuid` (required)
  - `stampCount: number` (required)
  - `rewardDescription: string` (required)
  - `isClaimable: boolean` (required, default `true`)
- **Validation**
  - `stampCount > 0`
  - `stampCount <= totalStamps`
  - milestone stamp count must be unique per card
- **Output**
  - Created `stamp_milestones` row

Why this matters: frontend and backend stay aligned, and debugging is faster because expected input/output is explicit.

---

## 3) Build UI with Local State First

Create `app/business/setup-card.jsx` with 3 sections:

### Section A: Card Form
- Inputs:
  - Card Name
  - Total Stamps
- Button:
  - `Create Card`

### Section B: Milestone Form
- Inputs:
  - Stamp Count
  - Reward Description
  - Claimable flag (boolean)
- Button:
  - `Add Milestone`

### Section C: Preview
- Show created card summary
- Show milestone list sorted by `stampCount`

Start with local state only (`useState`) to stabilize UX and validation before adding backend complexity.

---

## 4) Add Service Layer

Create `services/business.service.js` and keep all Supabase calls here:

### `createStampCard(payload)`
- Inserts into `stamp_cards`
- Returns created row

### `createStampMilestone(payload)`
- Inserts into `stamp_milestones`
- Returns created row

### `getCardWithMilestones(stampCardId)` (optional)
- Fetches latest card + milestones for refresh

Why this matters: screen stays clean, and service functions can be reused by mobile + future web back office.

---

## 5) Wire UI to Backend in Two Phases

### Phase 1: Create Card
1. User fills card form.
2. On submit, call `createStampCard`.
3. Save returned `card.id` in state.
4. Unlock milestone section only after card creation.

### Phase 2: Add Milestones
1. User fills milestone form.
2. On submit, call `createStampMilestone` with current `card.id`.
3. Append returned row to milestone list.
4. Keep list sorted by `stampCount`.

If card creation fails, do not allow milestone calls.

---

## 6) Guardrails (Must Have)

Add these checks before declaring Slice 2 complete:

1. Milestone submit disabled when card not yet created
2. Prevent duplicate milestone `stampCount`
3. Prevent `stampCount > totalStamps`
4. Prevent empty card name and empty reward description
5. Show clear success/error message for each submit action

Why this matters: most bugs in Slice 3 originate from weak data created in Slice 2. Strong guardrails here save debugging time later.

---

## Slice 2 Done Criteria

Slice 2 is done only when:
- Card creation works from UI to DB
- Milestone creation works from UI to DB
- Invalid inputs are blocked before DB call
- On refresh, data can be fetched and shown correctly

Once this is done, Slice 3 (JOIN flow) becomes straightforward because `stampCardId` and milestone config are already reliable.
