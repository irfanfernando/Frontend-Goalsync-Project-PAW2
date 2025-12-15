import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Image,
  Spinner,
  Breadcrumb,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import AppNavbar from "../../components/layout/AppNavbar";

const API_BASE_URL = "http://localhost:3000";

const resolveAvatar = (avatar?: string | null) => {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  return `${API_BASE_URL}/${avatar}`;
};

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

      alert("Profile updated successfully");
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          err.message ||
          "Failed to update profile"
      );
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

  return (
    <>
      <AppNavbar />

      <Container style={{ maxWidth: 900 }} className="mt-4 mb-5">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-3">
          <Breadcrumb.Item
            onClick={() => navigate("/app/goals")}
            linkAs="span"
            style={{ cursor: "pointer" }}
          >
            Goals
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Profile</Breadcrumb.Item>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-4">
          <h2 className="fw-semibold mb-1">Profile settings</h2>
          <p className="text-muted mb-0">
            Manage your personal information and profile photo.
          </p>
        </div>

        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <Form onSubmit={onSubmit}>
              {/* Avatar Section */}
              <div className="d-flex align-items-center gap-4 mb-4">
                <Image
                  src={
                    preview ??
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      username || "U"
                    )}`
                  }
                  roundedCircle
                  width={96}
                  height={96}
                  style={{ objectFit: "cover" }}
                />

                <div>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const input = e.target as HTMLInputElement;
                      const selected = input.files?.[0];
                      if (selected && selected.size > 2 * 1024 * 1024) {
                        alert("Maximum file size is 2MB");
                        return;
                      }
                      setFile(selected ?? null);
                    }}
                  />
                  <Form.Text className="text-muted">
                    JPG, PNG, or WEBP. Max size 2MB. Image will be resized to
                    256×256.
                  </Form.Text>
                </div>
              </div>

              {/* Username */}
              <Form.Group className="mb-4">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </Form.Group>

              {/* Actions */}
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
