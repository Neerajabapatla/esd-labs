import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadCourses() {
      try {
        const data = await apiFetch("/api/courses");
        if (!ignore) {
          setCourses(data);
          setStatus("ready");
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setCourses([]);
          setStatus("error");
          setError(err.message);
        }
      }
    }

    loadCourses();

    return () => {
      ignore = true;
    };
  }, []);

  async function addCourse(courseRequest) {
    const created = await apiFetch("/api/courses", {
      method: "POST",
      body: courseRequest,
    });

    setCourses((current) => {
      const next = [...current, created];
      next.sort((a, b) => a.code.localeCompare(b.code));
      return next;
    });

    return created;
  }

  return { courses, status, error, addCourse };
}
