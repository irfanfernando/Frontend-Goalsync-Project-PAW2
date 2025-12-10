import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import { Container, Card, Spinner, Alert, Button,ListGroup, ProgressBar, Modal, Form, InputGroup } from "react-bootstrap";
import AppNavbar from "../../components/layout/AppNavbar";

type ProgressItem = {
  _id?: string;
  note?: string;
  value?: number;
  createdAt?: string;
};

type Member = {
  userId?: string;
  name?: string;
  avatar: string;
}

export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [delta, setDelta] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [submittingProgress, setSubmittingProgress] = useState(false);

  const [showAssign, setShowAssign] = useState(false);
  const [users, setUsers] = useState<Array<{ _id: string; name?: string; email?: string }>>([]);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchGoal();
  }, [id]);

  async function fetchGoal() {
    setLoading(true);
    setErr(null);
    try {
      const res = await ApiClient.get(`/goals/${id}`);
      setGoal(res.data?.data ?? res.data);
    } catch (error: any) {
      console.error(error);
      setErr(error?.response?.data?.message || error?.message || "Gagal memuat detail goal");
    } finally {
      setLoading(false);
    }
  }

  const progressList: ProgressItem[] =
    goal?.actions ?? goal?.action ?? goal?.progressList ?? goal?.progressItems ?? [];

  const OpenProgressModal = () => {
    setDelta(0);
    setNote("");
    setShowProgressModal(true);
  }

  const submitProgress = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!id) return alert("Goal id tidak ada");
    const numericDelta = Number(delta || 0);
    if (isNaN(numericDelta)) return alert("Masukkan angka valid untuk progress");
    setSubmittingProgress(true);
    try {
      await ApiClient.post(`/goals/${id}/progress`, {
        delta: numericDelta,
        note,
      });
      await fetchGoal();
      setShowProgressModal(false);
    } catch (error: any) {
      console.error("Submit progress error:", error);
      alert(error?.response?.data?.message || error?.message || "Gagal menambah progress");
    } finally {
      setSubmittingProgress(false);
    }
  };

  const openAssign = () => {
    setSelectedUser(null);
    setUsers([]);
    setQuery("");
    setShowAssign(true);
  };

 
  const handleSearchUsers = async (q = "") => {
    setSearching(true);
    try {
      const res = await ApiClient.get("/users", { params: { q } });
      const data = res.data?.data ?? res.data ?? [];
      setUsers(Array.isArray(data) ? data : []);
    }catch (error){
      console.error(error);
      setUsers([]);
    }finally{
      setSearching(false);
    }
  };

  const doAssign = async () => {
    if (!selectedUser) return alert("Pilih user dulu");
    setAssigning(true);
    try {
      await ApiClient.post(`/goals/${id}/members`, { userId: selectedUser });
      await fetchGoal();
      setShowAssign(false);
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message || "Gagal assign member");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <>
        <AppNavbar />
        <Container className="text-center mt-4">
          <Spinner animation="border" />
        </Container>
      </>
    );
  }

  if (err) {
    return (
      <>
        <AppNavbar />
        <Container className="mt-3">
          <Alert variant="danger">{err}</Alert>
        </Container>
      </>
    );
  }

  if (!goal) {
    return (
      <>
        <AppNavbar />
        <Container className="mt-3">Goal tidak ditemukan</Container>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <Container className="mt-3" style={{ maxWidth: 900 }}>
        <Button variant="link" onClick={() => navigate(-1)}>
          &larr; Kembali
        </Button>

        <Card className="shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h4>{goal.title}</h4>
                <p className="text-muted">{goal.description}</p>
              </div>

              <div style={{ minWidth: 220 }}>
                <div className="mb-2 text-muted small">Progress</div>
                <ProgressBar now={goal.progress ?? 0} label={`${goal.progress ?? 0}%`} />
                <div className="mt-2 d-flex gap-2 align-items-center">
                  <div className="text-muted small">Members:</div>
                  <div className="d-flex align-items-center">
                    {(goal.members as Member[] | undefined) && goal.members.length > 0 ? (
                      (goal.members as Member[]).map((m: Member, i: number) => (
                        <img
                          key={i}
                          src={
                            m.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || "U")}&background=666&color=fff`
                          }
                          alt={m.name}
                          title={m.name}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginLeft: i === 0 ? 0 : -8,
                            border: "2px solid var(--bg)",
                          }}
                        />
                      ))
                    ) : (
                      <small className="text-muted">No members</small>
                    )}
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2">
                  <Button variant="outline-primary" size="sm" onClick={openAssign}>
                    Assign Member
                  </Button>
                  <Button variant="primary" size="sm" onClick={OpenProgressModal}>
                    Tambah Progress
                  </Button>
                </div>
              </div>
            </div>

            <hr />
            <h6>Progress timeline</h6>
            {progressList.length === 0 && <p className="text-muted">Tidak ada progress.</p>}
            <ListGroup>
              {progressList.map((p) => (
                <ListGroup.Item key={p._id ?? Math.random()}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <div style={{ fontSize: 14 }}>{p.note}</div>
                      <small className="text-muted">{p.value ? `+${p.value}%` : ""}</small>
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>{p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}</div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </Container>

      {/* Progress Modal */}
      <Modal show={showProgressModal} onHide={() => setShowProgressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Progress</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            submitProgress();
          }}
        >
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nilai (delta %)</Form.Label>
              <Form.Control
                type="number"
                value={delta}
                onChange={(e) => setDelta(Number(e.target.value))}
                min={-100}
                max={100}
                step={1}
                required
              />
              <Form.Text className="text-muted">Masukkan nilai penambahan progress (contoh: 10)</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Catatan (opsional)</Form.Label>
              <Form.Control value={note} onChange={(e) => setNote(e.target.value)} as="textarea" rows={3} />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowProgressModal(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={submittingProgress}>
              {submittingProgress ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Assign Member Modal */}
      <Modal show={showAssign} onHide={() => setShowAssign(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              doAssign();
            }}
          >
            <Form.Label>Search user</Form.Label>
            <InputGroup className="mb-2">
              <Form.Control placeholder="Cari nama atau email..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <Button variant="outline-secondary" onClick={() => handleSearchUsers(query)} disabled={searching}>
                {searching ? "Mencari..." : "Cari"}
              </Button>
            </InputGroup>

            <div style={{ maxHeight: 240, overflowY: "auto" }}>
              {users.length === 0 && <div className="text-muted small">Tidak ada user (coba cari)</div>}
              {users.map((u) => (
                <div
                  key={u._id}
                  className={`d-flex align-items-center p-2 ${selectedUser === u._id ? "bg-light" : ""}`}
                  style={{ cursor: "pointer", gap: 12 }}
                  onClick={() => setSelectedUser(u._id)}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || u.email || "U")}&background=666&color=fff`}
                    alt={u.name}
                    style={{ width: 36, height: 36, borderRadius: "50%" }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{u.name ?? u.email}</div>
                    <div className="text-muted small">{u.email}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowAssign(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={assigning || !selectedUser}>
                {assigning ? "Assigning..." : "Assign"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}