//import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import { useEffect, useState } from "react";

export default function AppNavbar() {
  const navigate = useNavigate();
  const [me, setMe] = useState<any>(null);
    useEffect(() => {
    (async () => {
      try {
        const res = await ApiClient.get("/me");
        setMe(res.data?.data);
      } catch (err) {
      }
    })();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("AuthToken");
    navigate("/signin", { replace: true });
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand style={{ cursor: "pointer" }} onClick={() => navigate("/app/goals")}>
          GoalSync
        </Navbar.Brand>

        <Nav className="ms-auto d-flex align-items-center gap-2">
          <Button
            variant="outline-primary" className="me-2 " 
            size="sm"
            onClick={() => navigate("/app/goals/add")} onClick={() => navigate("/app/goals/add")}>
           Add Goal
          </Button>
          {me ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => navigate("/profile")}>
                <Image
                  src={me.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(me.username ?? "U")}`}
                  width={36}
                  height={36}
                  roundedCircle
                  style={{ objectFit: "cover", border: "1px solid rgba(0,0,0,0.06)" }}
                />
                <div style={{ fontSize: 14 }}>{me.username}</div>
              </div>
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="outline-secondary" onClick={() => navigate("/signin")}>Sign In</Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

          <Button variant="danger" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}
