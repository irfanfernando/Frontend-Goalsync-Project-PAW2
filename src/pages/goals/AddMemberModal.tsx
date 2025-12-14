import { Modal, Button, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import ApiClient from "../../utils/ApiClient";

export default function AddMemberModal({
  show,
  onHide,
  goalId,
  onUpdated,
}: any) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!show) return;

    ApiClient.get("/users").then((res) => {
      setUsers(res.data?.data || []);
    });
  }, [show]);

  const addMember = async (userId: string) => {
    await ApiClient.post(`/goals/${goalId}/members`, { userId });
    onUpdated();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add member</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <ListGroup>
          {users.map((u) => (
            <ListGroup.Item
              key={u._id}
              className="d-flex justify-content-between"
            >
              <div>{u.name || u.email}</div>
              <Button size="sm" onClick={() => addMember(u._id)}>
                Add
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
}
