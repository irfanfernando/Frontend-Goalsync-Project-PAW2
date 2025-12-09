import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../../components/layout/AppNavbar";

type Goal = {
  _id: string;
  title: string;
  description?: string;
  progress?: number;
};

export default function GoalList() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await ApiClient.get("/goals");
        // banyak backend pakai res.data.data atau res.data
        const data = res.data?.data ?? res.data ?? [];
        setGoals(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error(error);
        setErr(error?.response?.data?.message || error?.message || "Gagal mengambil goals");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <AppNavbar />
      <Container className="mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Goals</h3>
          <div>
            <Button variant="outline-primary" className="me-2" onClick={() => navigate("/app/goals/add")}>
              Tambah Goal
            </Button>
            <Button variant="secondary" onClick={() => { setLoading(true); setGoals([]); /* simple refresh */ }}>
              Refresh
            </Button>
          </div>
        </div>

        {loading && (
          <div className="text-center my-4">
            <Spinner animation="border" role="status" />
          </div>
        )}

        {err && <Alert variant="danger">{err}</Alert>}

        {!loading && goals.length === 0 && <p>Tidak ada goals. Coba tambah satu.</p>}

        <Row>
          <div className="d-flex border rounded p-3 flex-wrap">
              {goals.map((g) => (
            <Col md={4} key={g._id} className="mb-3">
              <div className="card col-3" >
                <div className="card-body">
                  <Card.Title>{g.title}</Card.Title>
                  <Card.Text style={{ minHeight: 48 }}>{g.description}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>Progress: {g.progress ?? 0}%</div>
                    <div>
                      <Button variant="primary" size="sm" onClick={() => navigate(`/app/goals/${g._id}`)}>
                        Buka
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
          </div>
        
        </Row>
      </Container>
    </>
  );
}
