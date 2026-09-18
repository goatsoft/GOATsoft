# 0011. Contact form validation with Zod and Regle

- Status: accepted
- Date: 2026-09-18

## Context

The contact form previously leaned on native HTML constraints (`required`, `type=email`)
and sent whatever the browser allowed to the form backend. That put a rule (what counts as
a sendable message) in the template and in the browser's built-in messages, where it cannot
be tested and reads differently across browsers. The architecture (ADR 0002) keeps business
rules in the domain, framework-free and tested, so validation belongs there rather than in a
component.

## Decision

Contact becomes a bounded context, and validation is a Zod schema bound with Regle.

- **Domain:** `src/domain/contact/ContactMessage.ts` exports `contactSchema` (a Zod object)
  plus the inferred `ContactMessage` and `ContactDraft` types. Zod carries no Vue or DOM, so
  it lives in the domain. The schema trims as it parses, so a delivered message never carries
  surrounding whitespace, and it owns the per-field messages.
- **Application:** `useContact` binds the schema with `useRegleSchema` from `@regle/schemas`,
  exposing `r$` for reactive per-field state. On submit it calls `r$.$validate()` and delivers
  only the validated, typed `data`.
- **Presentation:** `ContactDialog` renders `r$.<field>.$errors` and marks invalid fields with
  `r$.<field>.$error`, on `$touch` and on submit, with `novalidate` so the schema is the single
  source of truth.
- Rules are covered by `ContactMessage.test.ts` against the schema directly.

Alternatives considered: hand-rolled validators (rejected: reinvents parsing, messages and a
sendable-value type that Zod gives for free); VeeValidate (rejected: heavier and directive-led
where Regle is model-led and matches the composable layer); native constraints only (rejected:
untestable and inconsistent across browsers). Adding `zod` and `@regle/schemas` is consistent
with ADR 0006: both bundle at build time and add no runtime network call.

## Consequences

Validation is unit-tested, typed, and identical in every browser, and the schema can back a
future form. The domain now owns validation messages, so the copy-is-data rule spans them too.
Two small dependencies enter the bundle. If forms grow more complex (multi-step, async checks),
Regle's core rules and schema refinements cover it without a new library.
