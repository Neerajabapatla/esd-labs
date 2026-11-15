import { useState } from "react";

const FIELD_LABELS = [
  { key: "code", label: "Code" },
  { key: "title", label: "Title" },
  { key: "department", label: "Department" },
  { key: "credits", label: "Credits" },
  { key: "capacity", label: "Capacity" },
  { key: "description", label: "Description" },
];

const emptyValues = {
  code: "",
  title: "",
  department: "",
  credits: "",
  capacity: "",
  description: "",
};

export function AddCourseForm({ onAdd }) {
  const [values, setValues] = useState(emptyValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    if (error) setError(null);
    if (fieldErrors[name]) {
      setFieldErrors((current) => ({ ...current, [name]: undefined }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      await onAdd({
        code: values.code,
        title: values.title,
        department: values.department,
        credits: Number(values.credits),
        capacity: Number(values.capacity),
        description: values.description.trim() === "" ? null : values.description,
      });
      setValues(emptyValues);
    } catch (err) {
      setError(err);
      if (err?.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="add-course" onSubmit={handleSubmit}>
      {FIELD_LABELS.map(({ key, label }) => {
        const fieldError = fieldErrors[key];
        const inputId = `${key}-input`;
        const errorId = `${key}-error`;
        const isTextArea = key === "description";

        return (
          <div key={key} className="field">
            <label htmlFor={inputId}>{label}</label>
            {isTextArea ? (
              <textarea
                id={inputId}
                value={values[key]}
                onChange={(event) => updateField(key, event.target.value)}
                aria-invalid={Boolean(fieldError)}
                aria-describedby={fieldError ? errorId : undefined}
              />
            ) : (
              <input
                id={inputId}
                type={key === "credits" || key === "capacity" ? "number" : "text"}
                value={values[key]}
                onChange={(event) => updateField(key, event.target.value)}
                aria-invalid={Boolean(fieldError)}
                aria-describedby={fieldError ? errorId : undefined}
              />
            )}
            {fieldError && <p id={errorId} className="field-error">{fieldError}</p>}
          </div>
        );
      })}

      {error && <div role="alert" className="form-error">{error.message}</div>}
      <button type="submit" disabled={submitting}>
        Add course
      </button>
    </form>
  );
}
