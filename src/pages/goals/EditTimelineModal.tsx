import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import ApiClient from "../../utils/ApiClient";

export default function EditTimelineModal({
  show,
  onHide,
  goal,
  onSaved,
}: any) {
  const [startDate, setStartDate] = useState(
    goal?.startDate ? goal.startDate.substring(0, 10) : ""
  );
  const [endDate, setEndDate] = useState(
    goal?.endDate ? goal.endDate.substring(0, 10) : ""
  );
  const [loading, setLoading] = useState(false);

  const saveTimeline = async () => {
    try {
      setLoading(true);
      await ApiClient.patch(`/goals/${goal._id}/timeline`, {
        startDate,
        endDate,
      });
      onSaved();
      onHide();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        <Button onClick={saveTimeline} disabled={loading}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
