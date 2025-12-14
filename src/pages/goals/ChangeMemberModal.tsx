import { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";

type User = {
  _id: string;
  name?: string;
  email: string;
  avatar?: string;
};

type Props = {
  show: boolean;
  onHide: () => void;
  goal: any;
  onUpdated: () => void;
};

export default function ChangeMemberModal({
  show,
  onHide,
  goal,
  onUpdated,
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) return;

    (async () => {
      try {
        const res = await ApiClient.get("/users");
        setUsers(res.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [show]);

  const handleAddMember = async () => {
    if (!selectedUserId) return;

    setLoading(true);
    try {
      await ApiClient.post(`/goals/${goal._id}/members`, {
        userId: selectedUserId,
      });
      onUpdated();
      onHide();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInitial = (name?: string, email?: string) => {
    if (name) return name[0].toUpperCase();
    if (email) return email[0].toUpperCase();
    return "U";
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Members</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Assigned members */}
        <div className="mb-3">
          <div className="fw-semibold mb-2">Assigned</div>

          {goal.members.length === 0 && (
            <div className="text-muted small">No members assigned</div>
          )}

          {goal.members.map((m: any) => (
            <div
              key={m.userId}
              className="d-flex align-items-center gap-2 mb-2"
            >
              <div
                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                style={{ width: 32, height: 32 }}
              >
                {getInitial(m.name, m.email)}
              </div>
              <div>{m.name}</div>
            </div>
          ))}
        </div>

        <hr />

        {/* Add member */}
        <div>
          <div className="fw-semibold mb-2">Add member</div>

          <select
            className="form-select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name || u.email}
              </option>
            ))}
          </select>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleAddMember}
          disabled={!selectedUserId || loading}
        >
          {loading ? <Spinner size="sm" /> : "Add member"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
