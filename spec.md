# LuidCorporation Marketplace

## Current State
Full-stack marketplace with Motoko backend and React frontend. Admin panel allows managing scripts and users. Delete and update user operations are failing at runtime.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Fix `deleteUser` and `updateUser` backend functions to reliably mutate state
- Use `stable var` array for user storage to avoid Map API ambiguity

### Remove
- Map-based userAccounts storage (replaced with stable array)

## Implementation Plan
1. Rewrite `userAccounts` storage as `stable var` Array of User.Account
2. Rewrite `register`, `deleteUser`, `updateUser`, `getAllUserAccounts`, `isRegistered`, `login` to use Array filtering
3. Keep all other backend logic unchanged
