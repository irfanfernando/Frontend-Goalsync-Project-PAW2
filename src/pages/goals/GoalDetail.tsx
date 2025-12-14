import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  ProgressBar,
  Spinner,
  Form,
  Breadcrumb,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import AppNavbar from "../../components/layout/AppNavbar";
import AddMemberModal from "./AddMemberModal";

/* ================= TYPES ================= */

type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

type Member = {
  userId?: {
    _id: string;
    username?: string;
    avatar?: string;
  };
  role?: string;
};

type Goal = {
  _id: string;
  title: string;
  description?: string;
  tasks?: Task[];
  members?: Member[];
  startDate?: string | null;
  endDate?: string | null;
};

/* ================= COMPONENT ================= */

export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);

  // tasks
  const [newTask, setNewTask] = useState("");

  // timeline
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editTimeline, setEditTimeline] = useState(false);

  // members
  const [showMember, setShowMember] = useState(false);

  /* ================= FETCH ================= */

  const fetchGoal = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.get(`/goals/${id}`);
      const data = res.data?.data ?? res.data;
      setGoal(data);

      setStartDate(data?.startDate ? data.startDate.slice(0, 10) : "");
      setEndDate(data?.endDate ? data.endDate.slice(0, 10) : "");
    } catch (err) {
      console.error("Fetch goal failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, [id]);

  if (loading) {
    return (
      <>
        <AppNavbar />
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      </>
    );
  }

  if (!goal) return null;

  /* ================= PROGRESS ================= */

  const tasks: Task[] = Array.isArray(goal.tasks) ? goal.tasks : [];
  const done = tasks.filter(t => t.completed).length;
  const progress = tasks.length
    ? Math.round((done / tasks.length) * 100)
    : 0;

  /* ================= HANDLERS ================= */

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await ApiClient.post(`/goals/${goal._id}/tasks`, { title: newTask });
    setNewTask("");
    fetchGoal();
  };

  const handleToggleTask = async (taskId: string) => {
    await ApiClient.patch(
      `/goals/${goal._id}/tasks/${taskId}/toggle`
    );
    fetchGoal();
  };

  const handleSaveTimeline = async () => {
    await ApiClient.patch(`/goals/${goal._id}/timeline`, {
      startDate: startDate || null,
      endDate: endDate || null,
    });
    setEditTimeline(false);
    fetchGoal();
  };

  /* ================= RENDER ================= */

  return (
    <>
      <AppNavbar />

      <Container className="mt-4 mb-5" style={{ maxWidth: 900 }}>
        {/* ===== BREADCRUMB ===== */}
        <Breadcrumb className="mb-2">
          <Breadcrumb.Item onClick={() => navigate("/app/goals")}>
            Goals
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            {goal.title}
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* ===== HEADER ===== */}
        <div className="mb-4">
          <h2 className="mb-1">{goal.title}</h2>
          <p className="text-muted mb-0">
            {goal.description || "No description"}
          </p>
        </div>

        {/* ===== TIMELINE ===== */}
        <Card className="mb-4 border-0 bg-light">
          <Card.Body>
            <h6 className="mb-2">Timeline</h6>

            {!editTimeline ? (
              <>
                <div className="text-muted small mb-2">
                  {goal.startDate || goal.endDate
                    ? `${goal.startDate?.slice(0, 10) || "—"} – ${
                        goal.endDate?.slice(0, 10) || "—"
                      }`
                    : "No timeline set"}
                </div>

                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => setEditTimeline(true)}
                >
                  Edit timeline
                </Button>
              </>
            ) : (
              <>
                <Form.Group className="mb-2">
                  <Form.Label>Start</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>End</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button size="sm" onClick={handleSaveTimeline}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditTimeline(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>

        {/* ===== PROGRESS ===== */}
        <div className="mb-4">
          <ProgressBar now={progress} style={{ height: 6 }} />
          <div className="text-muted small mt-1">
            {done} of {tasks.length} tasks completed
          </div>
        </div>

        {/* ===== TASKS ===== */}
        <Card className="mb-4 border-0">
          <Card.Body>
            <h6 className="mb-3">Tasks</h6>

            {tasks.length === 0 && (
              <div className="text-muted small mb-3">
                No tasks yet
              </div>
            )}

            {tasks.map(t => (
              <Form.Check
                key={t._id}
                type="checkbox"
                className="mb-2"
                checked={t.completed}
                onChange={() => handleToggleTask(t._id)}
                label={
                  <span
                    style={{
                      textDecoration: t.completed
                        ? "line-through"
                        : "none",
                      opacity: t.completed ? 0.6 : 1,
                    }}
                  >
                    {t.title}
                  </span>
                }
              />
            ))}

            <Form.Control
              size="sm"
              className="mt-3"
              placeholder="Add a task and press Add"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
            />

            <Button
              size="sm"
              className="mt-2"
              onClick={handleAddTask}
            >
              Add task
            </Button>
          </Card.Body>
        </Card>

        {/* ===== MEMBERS ===== */}
        <Card className="mb-4 border-0">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">Members</h6>
              <Button size="sm" onClick={() => setShowMember(true)}>
                Add member
              </Button>
            </div>

            {(!goal.members || goal.members.length === 0) && (
              <div className="text-muted small">
                No members assigned
              </div>
            )}

            {goal.members?.map((m, idx) => (
              <div
                key={m.userId?._id || idx}
                className="d-flex align-items-center gap-2 mb-2"
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#dee2e6",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {m.userId?.username
                    ? m.userId.username.slice(0, 2).toUpperCase()
                    : "??"}
                </div>
                <div className="small">
                  {m.userId?.username || "Unknown user"}
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>

        {/* ===== ACTIVITY PLACEHOLDER ===== */}
        <div className="text-muted small">
          Activity will appear here when changes happen.
        </div>
      </Container>

      <AddMemberModal
        show={showMember}
        onHide={() => setShowMember(false)}
        goalId={goal._id}
        onUpdated={fetchGoal}
      />
    </>
  );
}
