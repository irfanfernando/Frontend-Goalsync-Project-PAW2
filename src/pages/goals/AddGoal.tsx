import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Breadcrumb,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import AppNavbar from "../../components/layout/AppNavbar";

export default function AddGoal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await ApiClient.post("/goals", form);
      navigate("/app/goals");
    } catch {
      alert("Failed to create goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppNavbar />

      <Container className="mt-4 mb-5" style={{ maxWidth: 720 }}>
        {/* ================= Breadcrumb ================= */}
        <Breadcrumb className="mb-3">
          <Breadcrumb.Item
            linkAs="span"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/app/goals")}
          >
            Goals
          </Breadcrumb.Item>
          <Breadcrumb.Item active>New goal</Breadcrumb.Item>
        </Breadcrumb>

        {/* ================= Header ================= */}
        <h2 className="fw-semibold mb-1">New goal</h2>
        <p className="text-muted mb-4">
          Start with a clear goal. You can add tasks, timeline,
          and members later.
        </p>

        {/* ================= Card ================= */}
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Form onSubmit={onSubmit}>
              {/* Goal title */}
              <Form.Group className="mb-4">
                <Form.Label>Goal title</Form.Label>
                <Form.Control
                  name="title"
                  placeholder="e.g. Learn Japanese"
                  value={form.title}
                  onChange={onChange}
                  required
                />
                <Form.Text className="text-muted">
                  Make it specific and easy to understand.
                </Form.Text>
              </Form.Group>

              {/* Description */}
              <Form.Group className="mb-4">
                <Form.Label>Description (optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  placeholder="Why is this goal important to you?"
                  value={form.description}
                  onChange={onChange}
                />
              </Form.Group>

              {/* Hint box */}
              <div
                className="p-3 rounded small text-muted mb-4"
                style={{ background: "#f8f9fa" }}
              >
                💡 After creating this goal, you can:
                <ul className="mb-0 mt-2">
                  <li>Add checklist tasks</li>
                  <li>Set a timeline</li>
                  <li>Invite members</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/app/goals")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Create goal"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
