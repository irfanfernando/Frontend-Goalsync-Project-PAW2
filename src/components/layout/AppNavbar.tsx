//import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AppNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("AuthToken");
    navigate("/signin", { replace: true });
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand style={{ cursor: "pointer" }} onClick={() => navigate("/app/goals")}>
          <strong>GoalSync</strong>
        </Navbar.Brand>

        <Nav className="ms-auto d-flex align-items-center gap-2">
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => navigate("/app/goals/add")}
          >
            Add Goal
          </Button>

          <Button variant="danger" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}
