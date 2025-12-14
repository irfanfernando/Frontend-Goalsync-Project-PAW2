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

  const [showMember, setShowMember] = useState(false);

  // task
  const [newTask, setNewTask] = useState("");

  // timeline
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ================= FETCH ================= */

  const fetchGoal = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.get(`/goals/${id}`);
      const data = res.data?.data ?? res.data;
      setGoal(data);

      // sync timeline input
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

    try {
      await ApiClient.post(`/goals/${goal._id}/tasks`, {
        title: newTask,
      });
      setNewTask("");
      fetchGoal();
    } catch (err) {
      console.error("Add task failed", err);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await ApiClient.patch(
        `/goals/${goal._id}/tasks/${taskId}/toggle`
      );
      fetchGoal();
    } catch (err) {
      console.error("Toggle task failed", err);
    }
  };

  const handleSaveTimeline = async () => {
    try {
      await ApiClient.patch(`/goals/${goal._id}/timeline`, {
        startDate: startDate || null,
        endDate: endDate || null,
      });
      fetchGoal();
    } catch (err) {
      console.error("Update timeline failed", err);
    }
  };

  /* ================= RENDER ================= */

  return (
    <>
      <AppNavbar />

      <Container className="mt-4 mb-5" style={{ maxWidth: 900 }}>
        {/* ===== BREADCRUMB ===== */}
        <Breadcrumb className="mb-3">
          <Breadcrumb.Item onClick={() => navigate("/app/goals")}>
            Goals
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            {goal.title}
          </Breadcrumb.Item>
        </Breadcrumb>

        <h2 className="mb-1">{goal.title}</h2>
        <p className="text-muted">
          {goal.description || "No description"}
        </p>

        {/* ===== PROGRESS ===== */}
        <ProgressBar
          now={progress}
          label={`${progress}%`}
          className="mb-4"
        />

        {/* ===== TASKS ===== */}
        <Card className="mb-4">
          <Card.Body>
            <h5 className="mb-3">Tasks</h5>

            {tasks.length === 0 && (
              <div className="text-muted small mb-3">
                No tasks yet. Add tasks to start progress.
              </div>
            )}

            {tasks.map(t => (
              <Form.Check
                key={t._id}
                type="checkbox"
                className="mb-2"
                checked={!!t.completed}
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

            {/* ADD TASK */}
            <div className="d-flex gap-2 mt-3">
              <Form.Control
                size="sm"
                placeholder="New task..."
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
              />
              <Button size="sm" onClick={handleAddTask}>
                Add
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* ===== MEMBERS ===== */}
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Members</h5>
              <Button
                size="sm"
                onClick={() => setShowMember(true)}
              >
                Add member
              </Button>
            </div>

            {(!goal.members || goal.members.length === 0) && (
              <div className="text-muted small">
                No members yet
              </div>
            )}

            {goal.members?.map((m: Member, idx: number) => {
              const initials = m.userId?.username
                ? m.userId.username.slice(0, 2).toUpperCase()
                : "??";

              return (
                <div
                  key={m.userId?._id || idx}
                  className="d-flex align-items-center gap-2 mb-2"
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#dee2e6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <div>
                      {m.userId?.username || "Unknown user"}
                    </div>
                    <small className="text-muted">
                      {m.role || "member"}
                    </small>
                  </div>
                </div>
              );
            })}
          </Card.Body>
        </Card>

        {/* ===== TIMELINE ===== */}
        <Card>
          <Card.Body>
            <h5 className="mb-3">Timeline</h5>

            <Form.Group className="mb-2">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </Form.Group>

            <Button size="sm" onClick={handleSaveTimeline}>
              Save timeline
            </Button>
          </Card.Body>
        </Card>
      </Container>

      {/* ===== MODAL ===== */}
      <AddMemberModal
        show={showMember}
        onHide={() => setShowMember(false)}
        goalId={goal._id}
        onUpdated={fetchGoal}
      />
    </>
  );
}
