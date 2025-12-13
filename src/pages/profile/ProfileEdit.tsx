import { useEffect, useState } from "react";
import ApiClient from "../../utils/ApiClient";
import { Container, Card, Form, Button, Image, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ProfileEdit() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await ApiClient.get("/me");
        setUser(res.data?.data);
        setUsername(res.data?.data?.username ?? "");
        setPreview(res.data?.data?.avatar ?? null);
      } catch (err) {
        console.error("get /me error", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!file) {
      setPreview(user?.avatar ?? null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append("username", username);
      if (file) form.append("avatar", file);

      const res = await ApiClient.put("/me", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile updated");
      setUser(res.data?.data);
      setPreview(res.data?.data?.avatar ?? null);
      setFile(null);
      // optional: navigate back
      // navigate(-1);
    } catch (err: any) {
      console.error("update profile error", err);
      alert(err?.response?.data?.message || err.message || "Gagal update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: 720 }} className="mt-3">
      <Card className="p-3 shadow-sm">
        <h4>Edit Profil</h4>
        <Form onSubmit={onSubmit}>
          <div className="d-flex align-items-center gap-3 mb-3">
            <Image
              src={preview ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(username || "U")}`}
              roundedCircle
              width={80}
              height={80}
              style={{ objectFit: "cover" }}
            />
            <div>
              
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const input = e.target as HTMLInputElement;
                  setFile(input.files?.[0] ?? null);
              }}
            />
              <Form.Text className="text-muted">PNG/JPG/WEBP. Max 2MB. Akan di-resize 256×256.</Form.Text>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? <><Spinner animation="border" size="sm" /> Menyimpan...</> : "Simpan Profil"}
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>Batal</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}