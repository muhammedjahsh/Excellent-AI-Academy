import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAcademy } from "../context/AcademyContext";
import { getTrack } from "../data/curriculum";

export default function CourseAccess({ children, courseSlug, syllabusPreview = false }) {
  const { slug } = useParams();
  const { activeCourse, user, enrollments, enrollmentLoading, enrollmentError, refreshEnrollments } = useAcademy();
  const [retryError, setRetryError] = useState("");
  const requiredCourse = courseSlug || slug || activeCourse;
  const track = getTrack(requiredCourse);

  if (syllabusPreview && track) return children;

  async function retry() {
    setRetryError("");
    try {
      await refreshEnrollments();
    } catch (error) {
      setRetryError(error.message);
    }
  }

  if (enrollmentLoading) {
    return <section className="panel enrollment-message"><p className="kicker">Checking enrollment</p><p className="muted">Verifying your course access…</p></section>;
  }
  if (enrollmentError && user?.token) {
    return (
      <section className="panel enrollment-message">
        <p className="kicker">Access could not be verified</p>
        <p className="muted">{retryError || enrollmentError}</p>
        <button type="button" className="btn btn-ghost" onClick={retry}>Try again</button>
      </section>
    );
  }
  if (!user?.token) {
    return (
      <section className="panel enrollment-message">
        <p className="kicker">Course enrollment required</p>
        <h1>Sign in to unlock your learning path.</h1>
        <p className="muted">Choose your course, create an account, and complete secure checkout to access course modules.</p>
        <Link className="btn btn-gold" to="/signin">Create an account</Link>
      </section>
    );
  }
  if (!track) {
    return <section className="panel enrollment-message"><p className="kicker">Choose courses</p><h1>Start your learning space.</h1><p className="muted">Enroll in one or more courses to unlock their modules and learning tools.</p><Link className="btn btn-gold" to="/checkout">Choose courses</Link><Link className="btn btn-ghost" to="/tracks">Browse course catalog</Link></section>;
  }
  if (!enrollments.includes(track.slug)) {
    return (
      <section className="panel enrollment-message">
        <p className="kicker">Enrollment needed</p>
        <h1>Unlock {track.title}.</h1>
        <p className="muted">Complete checkout to access this course and its learning tools.</p>
        <Link className="btn btn-gold" to="/checkout">Choose courses · ₹10,000 each</Link>
        <Link className="btn btn-ghost" to="/tracks">Browse course catalog</Link>
      </section>
    );
  }
  return children;
}
