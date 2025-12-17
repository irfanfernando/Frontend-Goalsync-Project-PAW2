import { useState, type ChangeEvent, type FormEvent } from "react";
import { Container, Form, Button } from "react-bootstrap";
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
        <div className="mb-3 small text-muted">
          <span 
            role="button" 
            style={{ cursor: "pointer", color: "#6366f1" }}
            onClick={() => navigate("/app/goals")}
          >
            Goals
          </span>
          {" / "}
          <span>New goal</span>
        </div>

        {/* ================= Header ================= */}
        <h2 className="fw-semibold mb-2" style={{ color: "#111" }}>New goal</h2>
        <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "14px" }}>
          Start with a clear goal. You can add tasks, timeline, and members later.
        </p>

        {/* ================= Card ================= */}
        <div style={{ padding: "24px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <Form onSubmit={onSubmit}>
            {/* Goal title */}
            <Form.Group className="mb-4">
              <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#111" }}>Goal title</Form.Label>
              <Form.Control
                name="title"
                placeholder="e.g. Learn Japanese"
                value={form.title}
                onChange={onChange}
                required
                style={{ fontSize: "14px", borderColor: "#e5e7eb" }}
              />
              <Form.Text style={{ fontSize: "13px", color: "#9ca3af" }}>
                Make it specific and easy to understand.
              </Form.Text>
            </Form.Group>

            {/* Description */}
            <Form.Group className="mb-4">
              <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#111" }}>Description (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                placeholder="Why is this goal important to you?"
                value={form.description}
                onChange={onChange}
                style={{ fontSize: "14px", borderColor: "#e5e7eb" }}
              />
            </Form.Group>

            {/* Hint box */}
            <div
              className="p-3 rounded small mb-4"
              style={{ background: "#f0f4ff", border: "1px solid #dbeafe", fontSize: "13px", color: "#1e40af" }}
            >
              💡 After creating this goal, you can:
              <ul className="mb-0 mt-2" style={{ paddingLeft: "20px" }}>
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
                style={{ fontSize: "14px" }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                style={{ backgroundColor: "#6366f1", borderColor: "#6366f1", fontSize: "14px" }}
              >
                {loading ? "Saving..." : "Create goal"}
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
}
