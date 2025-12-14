import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  ProgressBar,
  Spinner,
  Form,
  Badge,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import AppNavbar from "../../components/layout/AppNavbar";
import EditTimelineModal from "./EditTimelineModal";

/* ================= TYPES ================= */
type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

type Member = {
  userId: string;
  name: string;
  avatar?: string;
};

/* ================= COMPONENT ================= */
export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");

  // ✅ FIX: hook HARUS di dalam component
  const [showTimeline, setShowTimeline] = useState(false);

  /* ================= FETCH GOAL ================= */
  const fetchGoal = async () => {
    try {
      const res = await ApiClient.get(`/goals/${id}`);
      setGoal(res.data?.data ?? res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, [id]);

  /* ================= TASK HANDLERS ================= */
  const handleAddTask = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (!newTask.trim()) return;

    try {
      await ApiClient.post(`/goals/${id}/tasks`, {
        title: newTask,
      });
      setNewTask("");
      fetchGoal();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      await ApiClient.patch(`/goals/${id}/tasks/${taskId}`);
      fetchGoal();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <>
        <AppNavbar />
        <div className="text-center my-5">
          <Spinner />
        </div>
      </>
    );
  }

  if (!goal) return null;

  /* ================= DERIVED STATE ================= */
  const tasks: Task[] = goal.tasks || [];
  const members: Member[] = goal.members || [];

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  /* ================= RENDER ================= */
  return (
    <>
      <AppNavbar />

      <Container className="mt-4 mb-5" style={{ maxWidth: 900 }}>
        {/* ===== Breadcrumb ===== */}
        <div className="mb-3 text-muted small">
          <span
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/app/goals")}
          >
            Goals
          </span>{" "}
          / <strong>{goal.title}</strong>
        </div>

        <Card style={{ borderRadius: 12 }}>
          <Card.Body>
            {/* ===== Header ===== */}
            <h2 className="mb-1">{goal.title}</h2>
            <div className="text-muted mb-4">
              {goal.description || "No description provided."}
            </div>

            {/* ===== Timeline ===== */}
            <div className="mb-4">
              <div className="fw-semibold mb-1">Timeline</div>

              {goal.startDate || goal.endDate ? (
                <div className="text-muted small">
                  {goal.startDate
                    ? new Date(goal.startDate).toLocaleDateString()
                    : "—"}{" "}
                  →{" "}
                  {goal.endDate
                    ? new Date(goal.endDate).toLocaleDateString()
                    : "—"}
                </div>
              ) : (
                <div className="text-muted small">No timeline set</div>
              )}

              <Button
                size="sm"
                variant="outline-secondary"
                className="mt-2"
                onClick={() => setShowTimeline(true)}
              >
                Edit timeline
              </Button>
            </div>

            <hr />
            <div className="mb-4">
              <div className="fw-semibold mb-1">Progress</div>
              <ProgressBar now={progress} label={`${progress}%`} />
              <div className="text-muted small mt-1">
                {tasks.length === 0
                  ? "No tasks yet"
                  : `${completedCount} of ${tasks.length} tasks completed`}
              </div>
            </div>

            <hr />

            {/* ===== Tasks ===== */}
            <div className="mb-4">
              <div className="fw-semibold mb-2">Tasks</div>

              {tasks.length === 0 && (
                <div className="text-muted small mb-2">
                  No tasks yet. Add one below.
                </div>
              )}

              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="d-flex align-items-center mb-2"
                  style={{ gap: 8 }}
                >
                  <Form.Check
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task._id)}
                  />
                  <span
                    style={{
                      textDecoration: task.completed
                        ? "line-through"
                        : "none",
                      color: task.completed ? "#999" : "#000",
                    }}
                  >
                    {task.title}
                  </span>
                </div>
              ))}

              <Form.Control
                className="mt-2"
                placeholder="Add a task and press Enter…"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={handleAddTask}
              />
            </div>

            <hr />

            {/* ===== Members ===== */}
            <div className="mb-4">
              <div className="fw-semibold mb-2">Members</div>

              {members.length === 0 && (
                <div className="text-muted small mb-2">
                  No members assigned
                </div>
              )}

              <div className="d-flex gap-2 flex-wrap mb-2">
                {members.map((m) => (
                  <Badge
                    key={m.userId}
                    bg="light"
                    text="dark"
                    style={{
                      padding: "6px 10px",
                      borderRadius: 16,
                      border: "1px solid #ddd",
                    }}
                  >
                    {m.name}
                  </Badge>
                ))}
              </div>

              <Button size="sm" variant="outline-secondary">
                + Add / Change member
              </Button>
            </div>

            <hr />

            {/* ===== Activity ===== */}
            <div>
              <div className="fw-semibold mb-2">Activity</div>
              <div className="text-muted small">
                Activity will appear here when tasks are updated or members
                change.
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* ===== Timeline Modal ===== */}
      <EditTimelineModal
        show={showTimeline}
        onHide={() => setShowTimeline(false)}
        goal={goal}
        onUpdated={fetchGoal}
      />
    </>
  );
}
