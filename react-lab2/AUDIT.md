# Audit — React Lab 2

Part of what you submit. Fill in sections 0–4 **before** you ask the AI to change anything:
deciding what's wrong is your job, not the AI's. The sheet you audit against is "The Shape
of a Good React Slice" — section 08 of the lab doc.

Point at code as `file:line`, e.g. `CoursesPage.jsx:14`.

---

## 0. What came back

| File the AI gave you | What's in it (components, hooks) | Lines |
| --- | --- | --- |
| `src/courses/useCourses.js` | placeholder hook stub, `throw new Error("TODO...")` | `1-3` |
| `src/courses/CoursesView.jsx` | placeholder view stub, `throw new Error("TODO...")` | `1-3` |
| `src/courses/AddCourseForm.jsx` | placeholder form stub, `throw new Error("TODO...")` | `1-3` |
| `src/courses/CoursesPage.jsx` | placeholder page with a TODO paragraph | `1-8` |

- Does it run? List loads / valid add appears in order / duplicate code shows the 409
  message / bad input shows fieldErrors under the inputs: No. The generated files did not implement any of the required behavior.
- Requests in the Network tab — on page load: 0 ; per add: 0
- `npm test` before any fix: 0 passed / 62 failed. Which test files fail? `test/courses/AddCourseForm.test.jsx`, `test/courses/CoursesPage.test.jsx`, `test/courses/CoursesView.test.jsx`, and `test/courses/useCourses.test.jsx` all fail because the AI output was only placeholder stubs.

## 1. Part A — walk the allowed list

Is each element present, and in the right place?

| Element (the sheet, Part A) | Where it is in the AI's code (`file:line`, or "missing") | Right place? If not, where should it be? |
| --- | --- | --- |
| One View component that only renders | `src/courses/CoursesView.jsx:1-3` | Not right: it was a stub, not a real render-only component. It should live in `src/courses/CoursesView.jsx` and receive everything via props. |
| Fetch + logic in a separate hook or module | `src/courses/useCourses.js:1-3` | Present as a file, but not implemented. It should own the fetch lifecycle and `addCourse` logic in `src/courses/useCourses.js`. |
| `useState` for the course list, at the right level | missing | It should live in `useCourses.js`, not in the page or view. |
| `useState` for the form's inputs, at the right level | missing | It should live in `AddCourseForm.jsx`, not in the page or hook. |
| `useEffect` — for the initial fetch only (with a cleanup) | missing | It should live in `useCourses.js` with an `ignore` flag cleanup. |
| Props down, callbacks up (the form raises "add this course") | missing | `CoursesPage.jsx` should pass `addCourse` down to `AddCourseForm`, and the form should raise the course through `onAdd`. |
| `.map` to render the list, with a stable `key` | missing | The list rendering belongs in `CoursesView.jsx` and must use `course.id` as the key. |
| Loading / error / empty states, from one `status` | missing | The hook should produce a single `status` value; the view should render based on `status` and `error`. |

## 2. Part B — scan for "not yet"

Search the files (VS Code: Ctrl/Cmd+Shift+F) for each one.

| Not yet | Found? (`file:line`) | What it does in *this* slice | Cut, or keep — and why |
| --- | --- | --- | --- |
| `useMemo` | no | Not present | Keep absent; it is not needed here. |
| `useCallback` | no | Not present | Keep absent; the contract forbids it. |
| `useReducer` | no | Not present | Keep absent; the state is simple enough for `useState`. |
| `useRef` | no | Not present | Keep absent; we do not need a ref for this slice. |
| Context (`createContext`, `useContext`) | no | Not present | Keep absent; props are enough for this screen. |
| A data-fetching library, or `axios`, or raw `fetch` instead of `apiFetch` | no | Not present | Keep absent; the API client must be used. |
| TypeScript (types, interfaces, `.ts`/`.tsx`) | no | Not present | Keep absent; the lab requires JavaScript. |
| Anything else nobody taught you (name it) | no | Not present | Keep absent; no extra package or abstraction is needed. |

## 3. The rule — every hook and every component split

One row for **each** `useState`, `useEffect` and custom hook call, and for **each**
component. Say what it does *in this slice*. "The AI added it" and "just in case" are not
answers — if you can't name its job, the decision is "cut".

| Hook call or component (`file:line`) | What earns it here? (one sentence) | Keep / cut / move (to where) |
| --- | --- | --- |
| `src/courses/useCourses.js:1-3` | This file should own fetching the course list and inserting a newly created course while keeping the array sorted by code. | Keep, but replace the stub with real logic. |
| `src/courses/CoursesView.jsx:1-3` | This should render the list and the loading, error, and empty states with no sideways data access. | Keep, but replace the stub with a pure view. |
| `src/courses/AddCourseForm.jsx:1-3` | This should own the form inputs and submit state without calling the API itself. | Keep, but replace the stub and add state here. |
| `src/courses/CoursesPage.jsx:1-8` | This should compose the hook, view, and form into the final page. | Keep, but replace the placeholder text with real composition. |
| `useEffect` in the real hook (to be added) | It loads the list once when the page appears and drops stale results with an `ignore` flag. | Add in `useCourses.js`. |
| `useState` for `courses` (to be added) | It stores the current list so the view can render it and the add logic can insert the new course in sorted order. | Add in `useCourses.js`. |
| `useState` for form values / submit / error (to be added) | It controls the inputs and tracks whether the request is in flight and what error is currently shown. | Add in `AddCourseForm.jsx`. |

## 4. Decisions — before any fix prompt

- I will **cut**: the prototype `TODO` stubs, the placeholder text in `CoursesPage.jsx`, and any idea of doing anything not required by the contract.
- I will **move** (from → to): the list logic from the page into `useCourses.js`; rendering logic from the page into `CoursesView.jsx`; input state from the page into `AddCourseForm.jsx`.
- I will **add** (missing from the AI's version): a real fetch effect with cleanup, a sorted insert on add, fieldErrors rendering, screen-reader-safe `aria-invalid`/`aria-describedby`, and a single `status` value for the view.
- Other smells I found (state stored that could be computed, a reload after add, browser validation, `key={index}`, swallowed errors…): the generated code had no real state or fetch; it was not using the API client at all; it would not have shown actual server errors or fieldErrors; and it had no list rendering or stable keys.

---

## 5. Strip check (section 14 of the doc)

For each "not yet" item you removed — one at a time:

| Removed | `npm test` after | The app after (loads / adds / shows errors) |
| --- | --- | --- |
| None used in the AI version; prompt 1 explicitly prohibited them. | Final `npm test` passes. | The app loads the list, adds courses without reloading, handles duplicates and validation errors, and matches the contract. |

If the AI used none, say so here, and say which rule in prompt 1 you think prevented it.

Prompt 1 explicitly prohibited `useMemo`, `useCallback`, `useReducer`, `useRef`, contexts, TypeScript, and raw `fetch`. That rule prevented the bad patterns from being introduced in the first place.

## 6. Before / after

|  | Before (the AI's first version) | After (yours) |
| --- | --- | --- |
| Files and components | 4 stubs: `CoursesPage`, `CoursesView`, `AddCourseForm`, and `useCourses` were all placeholder TODOs | 4 real slice components, each with its own responsibility |
| `useState` calls (and where) | 0 in the AI version | `useCourses.js`: `courses`, `status`, `error`; `AddCourseForm.jsx`: values, submitting state, form error, `fieldErrors` |
| `useEffect` calls | 0 | 1 in `useCourses.js` to load the list once, with cleanup |
| "Not yet" items | none present, because the output was a stub | none present; the implementation stayed inside the allowed React set |
| Requests: on load / per add | 0 / 0 | 1 on load (`GET /api/courses`) / 1 per successful add (`POST /api/courses`) |
| `npm test` | 0 passed / 62 failed | 62 passed / 62 total |

## 7. Two sentences

- One thing the AI got right that you might not have thought of: it chose the correct split of responsibilities across `useCourses`, `CoursesView`, `AddCourseForm`, and `CoursesPage`, which matches the structure the lab expects.
- One thing you will never accept from an AI without checking again: a response that appears complete but omits the actual requirements for fetch lifecycle, stale-result cleanup, error handling, fieldError rendering, and the exact contract behavior the tests enforce.
