# Prompt log — React Lab 2

Part of what you submit. It shows *how* you used AI: did you hand it the contract and the
rules, or type "make it work"? Fill it in **as you go**, not from memory at the end.

- Name and roll number: Neeraja Bapatla MT2026060
- AI tool and plan (e.g. ChatGPT free, Gemini, Claude free, Copilot): Copilot

**Log every prompt you send, in order — including the ones that didn't help.** Paste each
prompt in full. One exception: if you pasted CONTRACT.md's prompt 1 unchanged, write
"CONTRACT.md prompt 1, unchanged". Summarise each reply; don't paste whole files.

---

## Prompt 1 — generate

**Sent:**

```text
CONTRACT.md prompt 1, unchanged
```

**What came back:** It returned four files in `src/courses/`: `useCourses.js`, `CoursesView.jsx`, `AddCourseForm.jsx`, and `CoursesPage.jsx`. It used a hook for the fetch and list state, a view component for rendering, and a form component for input state. It did not add banned hooks like `useMemo` or `useReducer`, but the initial code was just a stubbed TODO version rather than a complete implementation.

**Did it run?** (`npm run dev`: list loads? add works? 409 shown? fieldErrors shown?
`npm test`: __ passed / __ failed)

- `npm run dev`: not verified because the generated files were placeholder stubs and did not implement the feature.
- `npm test`: 0 passed / 62 failed (the lab-day tests and the AI-generated TODO stubs failed immediately).

**What I did with it:** I copied the generated files into the course slice and ran the tests. The output showed the AI draft was not valid or complete enough for the contract, so I audited it and then fixed it by following the required structure and behavior.

---

## Prompt 2 — fix after audit

**Why I sent it:** This prompt carried out the audit decisions: separate fetch logic from rendering, keep a single `status` value, sort the list in `useCourses`, add the form error handling, and remove placeholder stubs.

**Sent:**

```text
Please implement the Courses page exactly to CONTRACT.md and the lab audit. Use four files in src/courses/: useCourses.js with a useEffect that loads /api/courses once and a stable addCourse(courseRequest) that inserts the 201 response into the list in code order; CoursesView.jsx as a pure render-only component with loading/error/empty/list states; AddCourseForm.jsx as the controlled form with states for inputs, submitting and errors, and fieldErrors shown under each relevant input with aria-invalid and aria-describedby; and CoursesPage.jsx to compose the hook, view, and form. Use only useState + useEffect, import apiFetch from ../api/client.js, do not add browser validation, and keep the list sorted by code without reloading the whole list. Show the final files in full.
```

**What came back:** It returned a complete implementation of the required slice: a `useCourses` hook with `status`, `error`, and `addCourse`, a `CoursesView` rendering only the list states, an `AddCourseForm` with controlled inputs and inline field errors, and a `CoursesPage` that composes them. The output matched the shape required by CONTRACT.md.

**What I kept, and what I rejected:** I kept the hook structure, the single `status` field, the form state pattern, and the list sorting approach. I rejected any unnecessary extra components or hook abstractions and removed anything that was not part of the contract.

---

## Afterwards

- How many prompts did the whole feature take? 2 prompts total.
- Which of your prompts would you write differently now, and how? I would tighten the fix prompt by explicitly naming the audit decisions and the exact contract sections to align it more closely to the lab’s required behavior, while still keeping it short.
- One thing the rules in prompt 1 prevented (or failed to prevent): Prompt 1 prevented banned hooks and extra packages, and it also required the slice structure to be a hook + view + form. It did not prevent an AI from returning a placeholder stub, so the audit step was still needed to catch that.
