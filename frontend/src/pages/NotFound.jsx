import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">404</p>
        <h1>This room is not on the map.</h1>
        <Link className="btn btn-gold" to="/tracks">
          Return to the tracks
        </Link>
      </header>
    </div>
  );
}
