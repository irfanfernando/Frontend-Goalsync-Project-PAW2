import { useEffect, useState } from "react";
import {
  Navbar,
  Container,
  Nav,
  Dropdown,
  Image,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";

/**
 * SESUAIKAN JIKA PORT BACKEND BEDA
 */
const API_BASE_URL = "http://localhost:3000";

type User = {
  username: string;
  email?: string;
  avatar?: string | null;
};

/**
 * Helper AMAN untuk avatar
 * - support path relatif (uploads/xxx.jpg)
 * - support URL full
 * - tidak error
 */
const resolveAvatar = (avatar?: string | null) => {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  return `${API_BASE_URL}/${avatar}`;
};

export default function AppNavbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await ApiClient.get("/me");
      setUser(res.data?.data);
    } catch (err) {
      console.error("Navbar /me error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("AuthToken");
    navigate("/signin");
  };

  const initials =
    user?.username
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <Navbar bg="white" className="border-bottom" style={{ height: 64 }}>
      <Container fluid style={{ maxWidth: 1200 }}>
        {/* BRAND */}
        <Navbar.Brand
          style={{ fontWeight: 600, fontSize: 18, cursor: "pointer" }}
          onClick={() => navigate("/app/goals")}
        >
          GoalSync
        </Navbar.Brand>

        <Nav className="ms-auto align-items-center">
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                id="profile-dropdown"
                className="d-flex align-items-center gap-2 border-0 bg-transparent"
              >
                {/* AVATAR */}
                {user?.avatar ? (
                  <Image
                    src={resolveAvatar(user.avatar)}
                    roundedCircle
                    width={36}
                    height={36}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
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
                    {initials}
                  </div>
                )}

                {/* USERNAME */}
                <span
                  className="d-none d-md-inline"
                  style={{ fontSize: 14, fontWeight: 500 }}
                >
                  {user?.username}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item disabled style={{ fontSize: 13 }}>
                  Signed in as <br />
                  <strong>{user?.username}</strong>
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
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
