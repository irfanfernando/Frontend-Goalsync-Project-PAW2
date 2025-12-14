import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import ApiClient from "../../utils/ApiClient";

type Props = {
  show: boolean;
  onHide: () => void;
  goal: any;
  onUpdated: () => void;
};

export default function EditTimelineModal({
  show,
  onHide,
  goal,
  onUpdated,
}: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (goal) {
      setStartDate(
        goal.startDate ? goal.startDate.substring(0, 10) : ""
      );
      setEndDate(
        goal.endDate ? goal.endDate.substring(0, 10) : ""
      );
    }
  }, [goal]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await ApiClient.put(`/goals/${goal._id}/timeline`, {
        startDate,
        endDate,
      });
      onHide();
      onUpdated();
    } catch (err) {
      console.error(err);
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
        <Form>
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
        </Form>
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
