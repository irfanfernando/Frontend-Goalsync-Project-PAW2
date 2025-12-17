import { useEffect, useState, useRef } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Image,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import AppNavbar from "../../components/layout/AppNavbar";

const API_BASE_URL = "http://localhost:3000";

const resolveAvatar = (avatar?: string | null) => {
  if (!avatar) return null;
  // If it's already a full URL, return as-is
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
  // Otherwise prepend backend base URL
  return `${API_BASE_URL}/${avatar}`;
};

export default function ProfileEdit() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Load profile
  useEffect(() => {
    (async () => {
      try {
        const res = await ApiClient.get("/me");
        setUser(res.data?.data);
        setUsername(res.data?.data?.username ?? "");
        setPreview(resolveAvatar(res.data?.data?.avatar));
      } catch (err) {
        console.error("get /me error", err);
      }
    })();
  }, []);

  // Preview from file only
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const form = new FormData();
      form.append("username", username);
      if (file) form.append("avatar", file);

      const res = await ApiClient.put("/me", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data?.data);
      setPreview(resolveAvatar(res.data?.data?.avatar));
      setFile(null);

      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          err.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm("Remove your profile photo?")) return;
    
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const form = new FormData();
      form.append("username", username);
      form.append("avatar", ""); // Empty to remove

      const res = await ApiClient.put("/me", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data?.data);
      setPreview(null);
      setFile(null);

      setSuccessMsg("Profile photo removed");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Failed to remove photo");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <AppNavbar />
        <div className="text-center mt-5">
          <Spinner />
        </div>
      </>
    );
  }

  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Unknown";

  return (
    <>
      <AppNavbar />

      <Container style={{ maxWidth: 900 }} className="mt-4 mb-5">
        {/* Breadcrumb */}
        <div className="mb-3 small text-muted">
          <span 
            role="button" 
            style={{ cursor: "pointer", color: "#6366f1" }}
            onClick={() => navigate("/app/goals")}
          >
            Goals
          </span>
          {" / "}
          <span>Profile</span>
        </div>

        {/* Page Header */}
        <div className="mb-4">
          <h2 className="fw-semibold mb-2" style={{ color: "#111" }}>Profile settings</h2>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "14px" }}>
            Manage your personal information and profile photo.
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMsg && (
          <Alert variant="success" dismissible onClose={() => setSuccessMsg("")} style={{ fontSize: 14 }}>
            {successMsg}
          </Alert>
        )}
        {errorMsg && (
          <Alert variant="danger" dismissible onClose={() => setErrorMsg("")} style={{ fontSize: 14 }}>
            {errorMsg}
          </Alert>
        )}

        <Form onSubmit={onSubmit}>
          {/* Profile Photo Card */}
          <Card className="mb-4" style={{ border: "1px solid #e5e7eb", borderRadius: 12 }}>
            <Card.Body style={{ padding: 24 }}>
              <div className="mb-3">
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 4 }}>Profile Photo</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>Update your profile picture</div>
              </div>

              <div className="d-flex align-items-center gap-4">
                <div 
                  style={{ position: "relative", cursor: "pointer" }}
                  onMouseEnter={() => setAvatarHover(true)}
                  onMouseLeave={() => setAvatarHover(false)}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image
                    src={
                      preview ??
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        username || "U"
                      )}&background=6366f1&color=fff&size=256`
                    }
                    roundedCircle
                    width={96}
                    height={96}
                    style={{ objectFit: "cover" }}
                  />
                  {avatarHover && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 96,
                        height: 96,
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Change
                    </div>
                  )}
                </div>

                <div className="flex-grow-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const input = e.target as HTMLInputElement;
                      const selected = input.files?.[0];
                      if (selected && selected.size > 2 * 1024 * 1024) {
                        setErrorMsg("Maximum file size is 2MB");
                        return;
                      }
                      setFile(selected ?? null);
                    }}
                    style={{ display: "none" }}
                  />
                  <div className="d-flex gap-2 mb-2">
                    <Button
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ backgroundColor: "#6366f1", borderColor: "#6366f1", fontSize: 13, fontWeight: 600 }}
                    >
                      Upload photo
                    </Button>
                    {(preview || user?.avatar) && (
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={handleRemoveAvatar}
                        disabled={loading}
                        style={{ fontSize: 13, fontWeight: 500 }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>
                    JPG, PNG, or WEBP. Max 2MB. Recommended 256×256px.
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Personal Information Card */}
          <Card className="mb-4" style={{ border: "1px solid #e5e7eb", borderRadius: 12 }}>
            <Card.Body style={{ padding: 24 }}>
              <div className="mb-3">
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 4 }}>Personal Information</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>Update your personal details</div>
              </div>

              <Form.Group className="mb-4">
                <Form.Label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Full name</Form.Label>
                <Form.Control
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your full name"
                  style={{ fontSize: 14, borderColor: "#e5e7eb", padding: "10px 12px" }}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Email address</Form.Label>
                <Form.Control
                  value={user?.email || ""}
                  disabled
                  readOnly
                  style={{ fontSize: 14, borderColor: "#e5e7eb", backgroundColor: "#f9fafb", color: "#6b7280", padding: "10px 12px" }}
                />
                <Form.Text style={{ fontSize: 12, color: "#9ca3af" }}>
                  Contact support to change your email address
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Member since</Form.Label>
                <Form.Control
                  value={memberSince}
                  disabled
                  readOnly
                  style={{ fontSize: 14, borderColor: "#e5e7eb", backgroundColor: "#f9fafb", color: "#6b7280", padding: "10px 12px" }}
                />
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Account Actions Card */}
          <Card style={{ border: "1px solid #e5e7eb", borderRadius: 12, marginBottom: 24 }}>
            <Card.Body style={{ padding: 24 }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>Save Changes</div>
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Update your profile information</div>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate(-1)}
                    style={{ fontSize: 14, fontWeight: 500, padding: "8px 16px" }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    style={{ backgroundColor: "#6366f1", borderColor: "#6366f1", fontSize: 14, fontWeight: 600, padding: "8px 16px" }}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Form>

        {/* Danger Zone Card */}
        <Card style={{ border: "1px solid #fecaca", borderRadius: 12, backgroundColor: "#fef2f2" }}>
          <Card.Body style={{ padding: 24 }}>
            <div className="mb-3">
              <div style={{ fontSize: 14, fontWeight: 600, color: "#dc2626", marginBottom: 4 }}>Danger Zone</div>
              <div style={{ fontSize: 13, color: "#991b1b" }}>Irreversible actions for your account</div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>Delete Account</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
                  Permanently delete your account and all associated data
                </div>
              </div>
              <Button
                variant="outline-danger"
                onClick={() => {
                  alert("Account deletion feature coming soon. Contact support for assistance.");
                }}
                style={{ fontSize: 13, fontWeight: 600, padding: "8px 16px" }}
              >
                Delete Account
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
