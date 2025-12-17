import { Navbar, Container, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function PublicNavbar() {
  const navigate = useNavigate();

  return (
    <Navbar
      bg="white"
      style={{
        height: 72,
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 8px 30px rgba(15, 23, 42, 0.05)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Container style={{ maxWidth: 1200 }}>
        <Navbar.Brand
          className="title-lg"
          style={{ cursor: "pointer", fontWeight: 700, letterSpacing: "-0.01em", color: "#111827", display: "flex", alignItems: "center", gap: "8px" }}
          onClick={() => navigate("/")}
        >
          <span style={{ fontSize: "24px" }}>🎯</span>
          <span style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>GoalSync</span>
        </Navbar.Brand>

        <Nav className="ms-auto align-items-center gap-3" style={{ fontSize: 14, color: "#374151" }}>
          <Nav.Link onClick={() => navigate("/signin")} style={{ color: "#111827", fontWeight: 500 }}>
            Log in
          </Nav.Link>
          <Nav.Link
            onClick={() => navigate("/signup")}
            style={{
              fontWeight: 600,
              color: "#fff",
              background: "#6366f1",
              borderRadius: 999,
              padding: "8px 14px",
              border: "1px solid #6366f1",
              boxShadow: "0 8px 20px rgba(99, 102, 241, 0.2)",
            }}
          >
            Get started
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
