import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import { Container, Card, Spinner, Alert, Button } from "react-bootstrap";
import AppNavbar from "../../components/layout/AppNavbar";

type ProgressItem = {
  _id?: string;
  note?: string;
  value?: number;
  createdAt?: string;
};

export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await ApiClient.get(`/goals/${id}`);
        const data = res.data?.data ?? res.data ?? null;
        setGoal(data);
      } catch (error: any) {
        console.error(error);
        setErr(error?.response?.data?.message || "Gagal memuat detail goal");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <>
        <AppNavbar />
        <Container className="text-center mt-4">
          <Spinner animation="border" />
        </Container>
      </>
    );
  }

  if (err) {
    return (
      <>
        <AppNavbar />
        <Container className="mt-3">
          <Alert variant="danger">{err}</Alert>
        </Container>
      </>
    );
  }

  if (!goal) {
    return (
      <>
        <AppNavbar />
        <Container className="mt-3">Goal tidak ditemukan</Container>
      </>
    );
  }

 
  const progressList: ProgressItem[] = goal.progressList ?? goal.progressItems ?? [];

  return (
    <>
      <AppNavbar />
      <Container className="mt-3">
        <Button variant="link" onClick={() => navigate(-1)}>&larr; Kembali</Button>

        <Card>
          <Card.Body>
            <h4>{goal.title}</h4>
            <p>{goal.description}</p>
            <p>Progress: {goal.progress ?? 0}%</p>

            <hr />
            <h6>Progress timeline</h6>
            {progressList.length === 0 && <p>Tidak ada progress.</p>}
            {progressList.map((p) => (
              <Card key={p._id ?? Math.random()} className="mb-2">
                <Card.Body>
                  <div style={{ fontSize: 14 }}>{p.note}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}</div>
                </Card.Body>
              </Card>
            ))}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
