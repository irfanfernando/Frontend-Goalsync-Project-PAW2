import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";

export default function UpdateProgressModal({
  show,
  onHide,
  goal,
  onUpdated,
}: any) {
  const [delta, setDelta] = useState(0);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const after = Math.min(100, (goal.progress ?? 0) + delta);

  const submit = async () => {
    setLoading(true);
    try {
      await ApiClient.post(`/goals/${goal._id}/progress`, {
        delta,
        note,
      });
      onHide();
      onUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update progress</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <strong>{goal.title}</strong>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Progress increase (%)</Form.Label>
          <Form.Control
            type="number"
            min={0}
            max={100}
            value={delta}
            onChange={(e) => setDelta(Number(e.target.value))}
          />
          <Form.Text className="text-muted">
            This will add to the current progress.
          </Form.Text>
        </Form.Group>

        <div className="text-muted small mb-3">
          Current: {goal.progress ?? 0}% → After update: {after}%
        </div>

        <Form.Group>
          <Form.Label>Notes (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={loading || delta <= 0}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
