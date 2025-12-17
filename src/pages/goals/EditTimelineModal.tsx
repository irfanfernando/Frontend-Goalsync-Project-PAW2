import { Modal, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import ApiClient from "../../utils/ApiClient";

export default function EditTimelineModal({
  show,
  onHide,
  goal,
  onUpdated,
}: any) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStartDate(goal?.startDate ? goal.startDate.slice(0, 10) : "");
    setEndDate(goal?.endDate ? goal.endDate.slice(0, 10) : "");
  }, [goal, show]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await ApiClient.patch(`/goals/${goal._id}/timeline`, {
        startDate,
        endDate,
      });
      onUpdated();
      onHide();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ borderBottom: "1px solid #e5e7eb" }}>
        <Modal.Title style={{ fontSize: "16px", fontWeight: "600", color: "#111" }}>📅 Edit timeline</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "16px" }}>
        <Form.Group className="mb-3">
          <Form.Label style={{ fontSize: "13px", fontWeight: "500", color: "#111" }}>Start date</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ fontSize: "13px", borderColor: "#e5e7eb" }}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label style={{ fontSize: "13px", fontWeight: "500", color: "#111" }}>End date</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ fontSize: "13px", borderColor: "#e5e7eb" }}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer style={{ borderTop: "1px solid #e5e7eb", padding: "12px 16px" }}>
        <Button variant="outline-secondary" onClick={onHide} style={{ fontSize: "13px" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          style={{ backgroundColor: "#6366f1", borderColor: "#6366f1", fontSize: "13px" }}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
