import { Navbar, Container, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function PublicNavbar() {
  const navigate = useNavigate();

  return (
    <Navbar bg="white" className="border-bottom">
      <Container>
        <Navbar.Brand style={{ cursor: "pointer", fontWeight: 700 }} onClick={() => navigate("/")}>
          GoalSync
        </Navbar.Brand>

        <Nav className="ms-auto gap-3">
          <Nav.Link onClick={() => navigate("/signin")}>Log In</Nav.Link>
          <Nav.Link onClick={() => navigate("/signup")} style={{ fontWeight: 600 }}>
            Sign Up
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
