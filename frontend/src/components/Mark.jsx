export default function Mark({ size = 28 }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="8" fill="#141820" stroke="#e4b56a" />
      <path
        fill="#f3d7a1"
        d="M8 23V9h4.4c3.5 0 5.6 1.8 5.6 4.5S15.9 18 12.4 18H11v5H8zm3-8h1.2c1.7 0 2.6-.8 2.6-2s-.9-2-2.6-2H11v4z"
      />
      <circle cx="23.5" cy="10.5" r="2.1" fill="#7dffe1" />
    </svg>
  );
}
