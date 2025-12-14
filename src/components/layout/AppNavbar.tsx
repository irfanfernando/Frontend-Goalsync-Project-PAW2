import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AppNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("AuthToken");
    navigate("/signin");
  };

  return (
    <Navbar
      bg="white"
      expand="lg"
      className="border-bottom"
      style={{ height: 64 }}
    >
      <Container fluid style={{ maxWidth: 1200 }}>
        {/* BRAND */}
        <Navbar.Brand
          style={{ fontWeight: 600, fontSize: 18, cursor: "pointer" }}
          onClick={() => navigate("/app/goals")}
        >
          GoalSync
        </Navbar.Brand>

        <Nav className="ms-auto align-items-center">
          {/* PROFILE DROPDOWN */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              id="profile-dropdown"
              className="d-flex align-items-center gap-2 border-0 bg-transparent"
            >
              {/* Avatar */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: "#e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                TE
              </div>

              {/* Username */}
              <span
                className="d-none d-md-inline"
                style={{ fontSize: 14, fontWeight: 500 }}
              >
                testadmin
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item disabled style={{ fontSize: 13 }}>
                Signed in as <br />
                <strong>testadmin</strong>
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Item onClick={() => navigate("/app/profile")}>
                Profile
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Item
                onClick={handleLogout}
                style={{ color: "#dc2626", fontWeight: 500 }}
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
