# Remove the email preview step

## What changes

After writing the letter, the CTA sends directly:
- **Signed in** → toast "Love Letter sent" + redirect to `/saved`
- **Signed out** → Auth modal (Continue with Google / Apple), then send on success

The intermediate "Preview email" screen (showing the mock email with From/To/Subject) is removed entirely.

## Files

**`src/components/love-letters/WriteLetterModal.tsx`**
- Delete the `EmailPreview` sub-component and the `step` state machine
- Remove now-unused imports: `ArrowLeft`, `Mail`
- Rename the CTA from `"Preview email →"` to `"Send Love Letter 💌"`
- Wire the CTA's `onClick` directly to `onSubmit(rating, message)`
- Keep the disabled state + `"Trim N words to continue"` label when over the 100-word limit

## Not touched

- `src/routes/index.tsx` — `handleSubmit` already branches correctly on `isAuthed` (opens `AuthWallModal` or calls `completeSend`)
- `AuthWallModal.tsx`, `SuccessOverlay.tsx`, send/redirect flow — unchanged
