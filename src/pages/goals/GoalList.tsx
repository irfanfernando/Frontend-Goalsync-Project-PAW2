import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import AppNavbar from "../../components/layout/AppNavbar";

type Goal = {
  _id: string;
  title: string;
  description?: string;
  progress?: number;
};

export default function GoalList() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchGoals = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await ApiClient.get("/goals");
      const data = res.data?.data ?? res.data ?? [];
      setGoals(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // 🧠 Notion-style grouping
  const notStarted = goals.filter(g => (g.progress ?? 0) === 0);
  const inProgress = goals.filter(g => (g.progress ?? 0) > 0 && (g.progress ?? 0) < 100);
  const done = goals.filter(g => (g.progress ?? 0) === 100);

  const renderGroup = (title: string, items: Goal[]) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-5">
        <h6 className="text-muted mb-3">{title}</h6>

        <Row className="gy-3">
          {items.map(goal => (
            <Col md={6} lg={4} key={goal._id}>
              <Card
                className="h-100"
                style={{
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.06)",
                  background: "#fff",
                }}
              >
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    <div style={{ fontWeight: 600 }}>{goal.title}</div>
                    <small className="text-muted">
                      Progress {goal.progress ?? 0}%
                    </small>
                  </div>

                  <div
                    className="text-muted small flex-grow-1"
                    style={{ minHeight: 40 }}
                  >
                    {goal.description || "No description"}
                  </div>

                  <div className="mt-3">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => navigate(`/app/goals/${goal._id}`)}
                    >
                      Open
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <>
      <AppNavbar />

      <Container className="mt-4 mb-5" style={{ maxWidth: 1100 }}>
        {/* PAGE HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="mb-1">Goals</h2>
            <div className="text-muted small">
              Track and manage your personal goals
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate("/app/goals/add")}
          >
            + Add Goal
          </Button>
        </div>

        {/* STATES */}
        {loading && (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        )}

        {err && <Alert variant="danger">{err}</Alert>}

        {!loading && goals.length === 0 && (
          <div className="text-center text-muted mt-5">
            <h5>No goals yet</h5>
            <p className="mb-3">
              Start by creating your first goal.
            </p>
            <Button onClick={() => navigate("/app/goals/add")}>
              + Add your first goal
            </Button>
          </div>
        )}

        {/* GROUPED CONTENT */}
        {!loading && goals.length > 0 && (
          <>
            {renderGroup("Not started", notStarted)}
            {renderGroup("In progress", inProgress)}
            {renderGroup("Completed", done)}
          </>
        )}
      </Container>
    </>
  );
}
