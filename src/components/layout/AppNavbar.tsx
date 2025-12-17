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

const API_BASE_URL = "http://localhost:3000";

type User = {
  username: string;
  email?: string;
  avatar?: string | null;
};


const resolveAvatar = (avatar?: string | null) => {
  if (!avatar) return null;
  // If it's already a full URL, return as-is
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
  // Otherwise prepend backend base URL
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
    <Navbar
      bg="white"
      style={{
        height: 72,
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 8px 30px rgba(15, 23, 42, 0.05)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Container fluid style={{ maxWidth: 1200 }}>
        <Navbar.Brand
          className="title-lg"
          style={{ fontWeight: 700, letterSpacing: "-0.01em", cursor: "pointer", color: "#111827", display: "flex", alignItems: "center", gap: "8px" }}
          onClick={() => navigate("/app/goals")}
        >
          <span style={{ fontSize: "24px" }}>🎯</span>
          <span style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>GoalSync</span>
        </Navbar.Brand>

        <Nav className="ms-auto align-items-center">
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <Dropdown align="end">
              <Dropdown.Toggle
                id="profile-dropdown"
                className="d-flex align-items-center gap-2"
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: 999,
                  padding: "6px 10px",
                  color: "#111827",
                  fontWeight: 600,
                  boxShadow: "0 2px 10px rgba(15, 23, 42, 0.06)",
                }}
              >
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
                      fontWeight: 700,
                      color: "#374151",
                    }}
                  >
                    {initials}
                  </div>
                )}

                <span className="d-none d-md-inline" style={{ fontWeight: 600, fontSize: 14 }}>
                  {user?.username}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu 
                style={{ 
                  minWidth: 280,
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
                  padding: "8px",
                  marginTop: "8px",
                  background: "#ffffff",
                }}
              >
                {/* User Info Section */}
                <div style={{ padding: "16px", marginBottom: "8px" }}>
                  <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    Signed in as
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>
                    {user?.username}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    {user?.email}
                  </div>
                </div>

                <div style={{ height: "1px", background: "#f3f4f6", margin: "0 0" }} />

                {/* Profile Action */}
                <Dropdown.Item 
                  onClick={() => navigate("/app/profile")}
                  style={{
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#111827",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    borderRadius: "8px",
                    margin: "4px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = "#eff6ff";
                    (e.target as HTMLElement).style.color = "#0284c7";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = "transparent";
                    (e.target as HTMLElement).style.color = "#111827";
                  }}
                >
                  <span style={{ fontSize: "16px" }}>👤</span>
                  <span>Profile</span>
                </Dropdown.Item>

                <div style={{ height: "1px", background: "#f3f4f6", margin: "4px 0" }} />

                {/* Logout Action */}
                <Dropdown.Item
                  onClick={handleLogout}
                  style={{
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#dc2626",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    borderRadius: "8px",
                    margin: "4px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = "#fef2f2";
                    (e.target as HTMLElement).style.color = "#991b1b";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = "transparent";
                    (e.target as HTMLElement).style.color = "#dc2626";
                  }}
                >
                  <span style={{ fontSize: "16px" }}>🚪</span>
                  <span>Logout</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
