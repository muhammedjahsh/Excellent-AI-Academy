import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAcademy } from "../context/AcademyContext";
import Icon, { courseIcon } from "../components/Icon";
import { getBillingCatalog, getCheckoutStatus, getEnrollments, createCheckout } from "../lib/api";
import { useTitle } from "../hooks/useTitle";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function Checkout() {
  useTitle("Course enrollment");
  const { user, online, enrollmentLoading, enrollmentError, refreshEnrollments, selectCourse } = useAcademy();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [owned, setOwned] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [paidCourses, setPaidCourses] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("");
  const sessionId = search.get("session_id");
  const cancelled = search.get("cancelled") === "1";
  const total = useMemo(
    () => courses.filter((course) => selected.includes(course.slug)).reduce((sum, course) => sum + course.amount_paise, 0),
    [courses, selected],
  );

  useEffect(() => {
    if (!user?.token) {
      navigate("/signin", { replace: true });
      return;
    }
    let active = true;
    setLoading(true);
    Promise.all([getBillingCatalog(), getEnrollments(user.token)])
      .then(([catalog, enrollmentData]) => {
        if (!active) return;
        setCourses(catalog.courses);
        setOwned(enrollmentData.courses);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [user?.token, navigate]);

  useEffect(() => {
    if (!sessionId || !user?.token) return;
    let active = true;
    setPaymentStatus("Checking payment with Stripe…");
    getCheckoutStatus(user.token, sessionId)
      .then(async (result) => {
        if (!active) return;
        if (result.status !== "paid") {
          setPaymentStatus("Payment is not confirmed yet. Your course access will unlock only after Stripe confirms payment.");
          return;
        }
        setPaidCourses(result.courses);
        setPaymentStatus("Payment confirmed. Your course enrollment is active.");
        const enrolled = await refreshEnrollments();
        if (active) setOwned(enrolled);
      })
      .catch((requestError) => {
        if (active) {
          setPaymentStatus("");
          setError(requestError.message);
        }
      });
    return () => { active = false; };
  }, [sessionId, user?.token]);

  function toggleCourse(slug) {
    setSelected((current) => current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug]);
  }

  async function startCheckout() {
    setBusy(true);
    setError("");
    try {
      const { url } = await createCheckout(user.token, selected);
      window.location.assign(url);
    } catch (requestError) {
      setError(requestError.message);
      setBusy(false);
    }
  }

  if (!user?.token) return null;

  if (loading || enrollmentLoading) {
    return <div className="page enrollment-page"><section className="panel enrollment-message"><p className="kicker">Course enrollment</p><p className="muted">Loading courses and your enrollments…</p></section></div>;
  }

  return (
    <div className="page enrollment-page">
      <header className="page-head">
        <p className="eyebrow">Secure enrollment · Stripe Checkout</p>
        <h1>Choose your courses.</h1>
        <p className="lede">Select one or more learning paths. Each course is a one-time payment of ₹10,000, and you can switch between enrolled courses later.</p>
      </header>

      {cancelled && !sessionId && <p className="checkout-notice" role="status">Checkout was cancelled. No payment was taken; you can change your selection and try again.</p>}
      {paymentStatus && (
        <section className={paidCourses.length ? "checkout-notice is-paid" : "checkout-notice"} role="status">
          <strong>{paymentStatus}</strong>
          {paidCourses.length > 0 && (
            <div className="checkout-success-actions">
              <span>Enrolled: {paidCourses.map((slug) => courses.find((course) => course.slug === slug)?.title || slug).join(", ")}</span>
              <button type="button" className="btn btn-gold btn-small" onClick={() => {
                selectCourse(paidCourses[0]);
                navigate(`/tracks/${paidCourses[0]}`);
              }}>Start learning</button>
            </div>
          )}
        </section>
      )}
      {(error || enrollmentError) && <p className="fail-text" role="alert">{error || enrollmentError}</p>}

      <div className="enrollment-layout">
        <section className="enrollment-course-list" aria-label="Available courses">
          {courses.map((course) => {
            const isOwned = owned.includes(course.slug);
            return (
              <label className={`panel enrollment-option${selected.includes(course.slug) ? " is-selected" : ""}${isOwned ? " is-owned" : ""}`} key={course.slug}>
                <input type="checkbox" checked={isOwned || selected.includes(course.slug)} disabled={isOwned || busy} onChange={() => toggleCourse(course.slug)} />
                <span className="enrollment-option-icon"><Icon name={courseIcon(course.slug)} size={21} /></span>
                <span className="enrollment-option-copy">
                  <strong>{course.title}</strong>
                  <small>{isOwned ? "Already enrolled · available in your learning space" : "One-time course enrollment"}</small>
                </span>
                <span className="enrollment-price">{isOwned ? "Enrolled" : money.format(course.amount_paise / 100)}</span>
              </label>
            );
          })}
        </section>

        <aside className="panel enrollment-summary">
          <p className="kicker">Order summary</p>
          <h2>{selected.length ? `${selected.length} course${selected.length === 1 ? "" : "s"} selected` : "Select your course"}</h2>
          {selected.length ? (
            <>
              <ul>
                {courses.filter((course) => selected.includes(course.slug)).map((course) => (
                  <li key={course.slug}><span>{course.title}</span><strong>{money.format(course.amount_paise / 100)}</strong></li>
                ))}
              </ul>
              <div className="enrollment-total"><span>Total · one-time</span><strong>{money.format(total / 100)}</strong></div>
              <button className="btn btn-gold enrollment-pay" type="button" disabled={busy || !online} onClick={startCheckout}>
                {busy ? "Opening secure checkout…" : "Continue to secure payment"} {!busy && <span aria-hidden="true">→</span>}
              </button>
              {!online && <p className="muted">The academy server must be online before checkout can start.</p>}
            </>
          ) : (
            <p className="muted">Choose one or more courses to see your total. You’ll review and complete payment on Stripe.</p>
          )}
          <p className="checkout-security"><Icon name="shield" size={16} />Payment details are entered on Stripe. Card information is not stored by the academy.</p>
          {owned.length > 0 && <Link className="text-btn" to="/">Return to my learning space</Link>}
        </aside>
      </div>
    </div>
  );
}
