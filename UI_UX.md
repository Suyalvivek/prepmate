# UI/UX Design System
## Calm, modern, study-oriented interface

## 1. Design philosophy

### Design references
- Primary: Linear-inspired structure, task interactions, and restrained dark mode.
- Diary and notes: Notion-inspired reading comfort.
- Syllabus and analytics: Airtable-inspired structured views and filtering.
- These are references, not separate systems to copy. Use one coherent PrepMate design system.
- Preserve the established navy sidebar, soft neutral surfaces, restrained indigo accents, rounded cards, subtle borders, and calm study-oriented layout.

The app should make the next useful study action obvious. Use a calm, spacious interface with clear hierarchy and restrained colour. Avoid noisy gradients, excessive cards, celebratory animations on every click, and dashboard clutter.

Desired qualities:
- Focused and trustworthy.
- Modern but not overly decorative.
- Dense enough for planning, spacious enough for long sessions.
- Accessible in light and dark modes.
- Encouraging without guilt or shame.
- Data visualisation that helps users act.

## 2. Visual direction
- Use a neutral base with one primary accent (for example indigo/blue or teal); use semantic success/warning/error colours sparingly.
- Light theme: soft neutral page background, white/near-white surfaces, subtle borders, high-contrast text.
- Dark theme: deep neutral surfaces, readable muted text, restrained accent highlights; avoid pure black backgrounds by default.
- Use consistent radius, spacing, typography scale, shadows, and border tokens.
- Prefer borders and spacing over heavy shadows.
- Use Lucide icons consistently.
- Avoid emoji as the primary icon system; motivational quote can be text-only.

## 3. Typography and layout
- Use a highly readable sans-serif such as Inter or the platform system stack.
- Strong page title, clear section headings, readable body text, subdued metadata.
- Main content max-width around 1200–1400px depending on the page.
- Use a consistent spacing scale.
- Dashboard: 12-column grid on desktop, 2-column at tablet where sensible, one column on mobile.
- Avoid tiny text for essential status or chart labels.

## 4. App shell
### Desktop
- Left sidebar: Dashboard, Planner, Syllabus, Exams/Overlap, Mock Tests, Revisions, Analytics, Journal, AI Mentor, Settings.
- Sidebar can collapse.
- Top bar: page title/context, quick-add, theme switch, profile menu.
- Main area: current priority and actionable content first.

### Mobile
- Compact header and bottom navigation for primary destinations or an accessible navigation drawer.
- Use sheets/dialogs for editing tasks without making forms too tall.
- Keep daily task completion controls easy to tap.
- Calendar may switch to agenda/list mode on narrow screens.

## 5. Component standards
- Buttons: clear labels and hierarchy; primary for main action, secondary for alternatives, destructive style for destructive actions.
- Forms: visible labels, helpful descriptions, inline validation, preserve user input on errors.
- Dialogs: focus management, Escape handling, clear cancel/confirm actions.
- Toasts: brief confirmation/error, not the only way important information is communicated.
- Cards: use only where grouping improves comprehension.
- Tables: responsive alternatives for mobile.
- Charts: accessible descriptions and text summaries.
- Task status: icon + label, not colour alone.
- Priority: concise badge with accessible text.
- Empty state: explain why it is empty and provide one useful action.
- Skeletons: match the approximate shape of loading content.

## 6. Theme switching
- Options: Light, Dark, System.
- Default to System for first-time users.
- Prevent flash of incorrect theme where practical.
- Persist choice locally; optionally sync to profile for cross-device consistency.
- Ensure every component, chart, tooltip, modal, calendar, and focus ring adapts to theme.
- Verify contrast in both themes.
- Do not hard-code colours inside feature components; use design tokens/CSS variables.

## 7. Dashboard hierarchy
1. Greeting/date and daily intention.
2. Today's priority tasks and progress.
3. Start/resume focus session.
4. Due revisions and urgent items.
5. Weekly target progress and plan-versus-actual.
6. Small growth snapshot.
7. Quote, achievement, or motivational element.

The quote must never take more attention than today's plan.

## 8. Scheduler preview UX
- Title: “Review your updated plan”.
- Show reason for rescheduling.
- Show current day → proposed day, estimated duration, and priority.
- Summarise daily and weekly load before/after.
- Show warnings if workload exceeds capacity or deadlines are at risk.
- Let users accept all, edit individual moves, or reject.
- Clearly identify tasks that remain unscheduled.
- Do not imply the change is saved until the server confirms success.

## 9. Gamification UX
- XP and levels are secondary indicators.
- Achievements should be meaningful and not overly frequent.
- Planned rest days do not break a streak.
- A missed day should offer a recovery path.
- Do not use shame language, alarming red screens, or manipulative urgency.
- Celebrate skill improvement, revision consistency, and recovery—not just raw hours.

## 10. Motion and interaction
- Use subtle transitions for navigation, panels, and completion feedback.
- Respect reduced-motion settings.
- No long blocking animations.
- Support keyboard operation for all critical actions.
- Provide clear hover, focus, active, disabled, and loading states.

## 11. Responsive and accessibility QA
Test at narrow mobile, typical phone, tablet, laptop, and wide desktop widths.
Check:
- keyboard-only navigation;
- visible focus;
- colour contrast;
- labels and error association;
- dialog focus trap and return focus;
- chart text summaries;
- zoom/reflow;
- reduced motion;
- task movement without drag-and-drop;
- dark-theme states and contrast.


- Settings includes AI Configuration.
- Users can select a supported provider/model, submit a key, verify/connect, rotate, or disconnect.
- Explain that requests are sent to the selected provider and usage is generally billed to the user's provider account.
- After saving, show connection status and masked suffix only; never reveal the full key again.
- Display active provider/model/key source in the AI Mentor.
- Provide an AI-disabled mode; core planning still works.
- Show actionable errors for invalid keys, unsupported models, rate limits, and exhausted quotas.
- Never silently switch from a user's key to a platform-managed key.

