export function CoursesView({ courses, status, error }) {
  if (status === "loading") return <p>Loading courses…</p>;
  if (status === "error") return <p>Couldn't load courses: {error}</p>;
  if (status === "ready" && courses.length === 0) return <p>No courses yet.</p>;

  return (
    <ul className="courses">
      {courses.map((course) => {
        const seatsText = course.seatsLeft === 0 ? "Full" : course.seatsLeft === 1 ? "1 seat left" : `${course.seatsLeft} seats left`;
        return (
          <li key={course.id}>
            <strong>{course.code} · {course.title}</strong>
            <span>
              {course.credits} credits · {course.department} · {seatsText}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
