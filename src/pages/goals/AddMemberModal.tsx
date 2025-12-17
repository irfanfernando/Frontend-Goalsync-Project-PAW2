import { Modal, Button, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import ApiClient from "../../utils/ApiClient";

const resolveAvatar = (avatar?: string | null, name?: string) => {
  if (avatar) {
    // If it's already a full URL (http/https), return as-is
    if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
      return avatar;
    }
    // If it's a relative path (avatars/), prepend backend URL
    if (avatar.startsWith("avatars/") || avatar.startsWith("uploads/")) {
      return `http://localhost:3000/${avatar}`;
    }
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "U"
  )}&background=e5e7eb&color=374151`;
};

export default function AddMemberModal({ show, onHide, goalId, onUpdated }: any) {
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
      <Modal.Header closeButton style={{ borderBottom: "1px solid #e5e7eb" }}>
        <Modal.Title style={{ fontSize: "16px", fontWeight: "600", color: "#111" }}>👥 Add member</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {users.map((u) => (
            <div
              key={u._id}
              className="d-flex justify-content-between align-items-center p-2"
              style={{ backgroundColor: "#f9fafb", borderRadius: "6px", border: "1px solid #e5e7eb" }}
            >
              <div className="d-flex align-items-center gap-2">
                <Image
                  src={resolveAvatar(u.avatar, u.username || u.name || u.email)}
                  roundedCircle
                  width={32}
                  height={32}
                />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "500", color: "#111" }}>
                    {u.username || u.name || "Unknown"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                    {u.email}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => addMember(u._id)}
                style={{ backgroundColor: "#6366f1", borderColor: "#6366f1", fontSize: "12px" }}
              >
                Add
              </Button>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
}
