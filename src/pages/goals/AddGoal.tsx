import { useState, type ChangeEvent, type FormEvent } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
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
    } catch (err) {
      console.error(err);
      alert("Failed to create goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppNavbar />

      <Container className="mt-4 mb-5" style={{ maxWidth: 760 }}>
        {/* HEADER */}
        <div className="mb-5">
          <h1 className="fw-semibold mb-2">New goal</h1>
          <div className="text-muted">
            Start with a clear goal. You can add tasks, timeline, and members
            after creating it.
          </div>
        </div>

        {/* FORM */}
        <Card
          style={{
            borderRadius: 14,
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Card.Body className="p-4">
            <Form onSubmit={onSubmit}>
              {/* TITLE */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  Goal title
                </Form.Label>
                <Form.Control
                  name="title"
                  placeholder="e.g. Learn Japanese"
                  value={form.title}
                  onChange={onChange}
                  required
                  size="lg"
                />
                <Form.Text className="text-muted">
                  Make it specific and easy to understand.
                </Form.Text>
              </Form.Group>

              {/* DESCRIPTION */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  Description <span className="text-muted">(optional)</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  placeholder="Why is this goal important to you?"
                  value={form.description}
                  onChange={onChange}
                />
              </Form.Group>

              {/* INFO BOX */}
              <Alert
                variant="light"
                className="mb-4"
                style={{
                  border: "1px dashed rgba(0,0,0,0.15)",
                }}
              >
                <div className="text-muted small">
                  💡 After creating this goal, you can:
                  <ul className="mb-0 mt-2">
                    <li>Add checklist tasks</li>
                    <li>Set a timeline</li>
                    <li>Invite members</li>
                  </ul>
                </div>
              </Alert>

              {/* ACTIONS */}
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/app/goals")}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create goal"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
