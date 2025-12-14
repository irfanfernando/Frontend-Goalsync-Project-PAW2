import { useState, type ChangeEvent, type FormEvent } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
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

      <Container className="mt-4 mb-5" style={{ maxWidth: 720 }}>
        {/* PAGE HEADER */}
        <div className="mb-4">
          <h2 className="mb-1">Create a new goal</h2>
          <div className="text-muted">
            Define what you want to achieve and track your progress.
          </div>
        </div>

        {/* FORM CARD */}
        <Card
          style={{
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Card.Body>
            <Form onSubmit={onSubmit}>
              {/* TITLE */}
              <Form.Group className="mb-4">
                <Form.Label>Goal title</Form.Label>
                <Form.Control
                  name="title"
                  placeholder="e.g. Learn React and Express"
                  value={form.title}
                  onChange={onChange}
                  required
                />
                <Form.Text className="text-muted">
                  Keep it short and clear.
                </Form.Text>
              </Form.Group>

              {/* DESCRIPTION */}
              <Form.Group className="mb-4">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  placeholder="Describe what this goal is about and how you plan to achieve it."
                  value={form.description}
                  onChange={onChange}
                />
              </Form.Group>

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
