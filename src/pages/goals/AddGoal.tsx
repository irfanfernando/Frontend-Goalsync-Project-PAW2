import React, {  useState } from "react";
import { Container, Button, Alert,Form } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../../components/layout/AppNavbar";

export default function AddGoal() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!title.trim()) {
      setErr("Title wajib diisi");
      return;
    }
    setLoading(true);
    try {
      await ApiClient.post("/goals", { title, description });
      navigate("/app/goals");
    } catch (error: any) {
      console.error(error);
      setErr(error?.response?.data?.message || "Gagal menyimpan goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppNavbar />
      <Container className="mt-3" style={{ maxWidth: 700 }}>
        <h3>Tambah Goal</h3>
        {err && <Alert variant="danger">{err}</Alert>}

        <Form onSubmit={submit}>
          <Form.Group className="mb-2">
            <Form.Label>Judul</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control as="textarea" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>

          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </Form>
      </Container>
    </>
  );
}
