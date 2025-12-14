import { useEffect, useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";

export default function ChangeMemberModal({
  show,
  onHide,
  goal,
  onUpdated,
}: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    if (!show) return;
    ApiClient.get("/users").then((res) => {
      setUsers(res.data?.data ?? res.data);
    });
  }, [show]);

  const addMember = async () => {
    if (!selectedUser) return;
    await ApiClient.post(`/goals/${goal._id}/members`, {
      userId: selectedUser,
    });
    onUpdated();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Members</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* CURRENT MEMBERS */}
        <div className="mb-3">
          <div className="fw-semibold mb-2">Assigned</div>

          {goal.members?.length ? (
            goal.members.map((m: any) => (
              <div
                key={m.userId}
                className="d-flex align-items-center gap-2 mb-2"
              >
                <Image
                  roundedCircle
                  width={32}
                  height={32}
                  src={
                    m.avatar ??
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      m.name || "U"
                    )}`
                  }
                />
                <div>
                  <div className="small fw-semibold">{m.name}</div>
                  <div className="text-muted small">{m.email}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted small">No members yet</div>
          )}
        </div>

        <hr />

        {/* ADD MEMBER */}
        <Form.Group>
          <Form.Label>Add member</Form.Label>
          <Form.Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.username} ({u.email})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button onClick={addMember} disabled={!selectedUser}>
          Add member
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
