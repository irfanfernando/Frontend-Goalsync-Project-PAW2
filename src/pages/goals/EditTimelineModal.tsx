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

  // isi default saat modal dibuka
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
      onUpdated(); // refresh GoalDetail
      onHide();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit timeline</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Start date</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>End date</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
