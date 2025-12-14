import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/ui/PublicNavbar";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      {/* NAVBAR ATAS */}
      <PublicNavbar />

      {/* HERO / KONTEN UTAMA */}
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <Container
          className="d-flex flex-column justify-content-center align-items-center text-center"
          style={{ minHeight: "80vh" }}
        >
          <h1 style={{ fontSize: 48, fontWeight: 700 }}>
            One goal. Shared progress.
          </h1>

          <p className="text-muted mt-3" style={{ maxWidth: 520 }}>
            GoalSync helps individuals and teams track real, measurable goals
            together — transparently and consistently.
          </p>

          <div className="d-flex gap-3 mt-4">
            <Button size="lg" onClick={() => navigate("/signup")}>
              Get Started
            </Button>
            <Button
              variant="outline-secondary"
              size="lg"
              onClick={() => navigate("/signin")}
            >
              Log In
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
}
