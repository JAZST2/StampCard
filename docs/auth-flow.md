# Auth Flow (OTP)

## Goal
Allow passwordless login and keep user session persistent across app restarts.

## Flow
1. User enters email.
2. App calls Supabase `signInWithOtp`.
3. User enters OTP code.
4. App calls Supabase `verifyOtp`.
5. On success:
   - save `session` and `user` in store
   - upsert row in `public.users`
6. App root renders:
   - `AuthShell` when no session
   - `MainShell` when session exists

## Session Restore
- On app startup, call `getSession`.
- Subscribe to auth changes and keep store synced.
- Show loading state while bootstrapping.

## Failure Cases
- Invalid OTP: show clear message and allow retry.
- Expired OTP: allow resend.
- Missing user profile row: run `upsert` on login success.
