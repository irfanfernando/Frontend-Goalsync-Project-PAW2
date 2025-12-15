import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  ProgressBar,
  Form,
  Row,
  Col,
  Breadcrumb,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import AppNavbar from "../../components/layout/AppNavbar";
import AddMemberModal from "./AddMemberModal";
import EditTimelineModal from "./EditTimelineModal";

/* =======================
   Helper
======================= */
const timeAgo = (date: string) => {
  const diff = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [showMember, setShowMember] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const fetchGoal = async () => {
    const res = await ApiClient.get(`/goals/${id}`);
    setGoal(res.data?.data ?? res.data);
  };

  useEffect(() => {
    fetchGoal().finally(() => setLoading(false));
  }, [id]);

  if (loading || !goal) {
    return (
      <>
        <AppNavbar />
        <div className="text-center mt-5">Loading...</div>
      </>
    );
  }

  const tasks = goal.tasks || [];
  const completed = tasks.filter((t: any) => t.completed).length;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const addTask = async () => {
    if (!newTask.trim()) return;
    await ApiClient.post(`/goals/${goal._id}/tasks`, {
      title: newTask,
    });
    setNewTask("");
    fetchGoal();
  };

  const toggleTask = async (taskId: string) => {
    await ApiClient.patch(
      `/goals/${goal._id}/tasks/${taskId}/toggle`
    );
    fetchGoal();
  };

  const activities =
    goal.actions?.slice().reverse().slice(0, 8) ?? [];

  return (
    <>
      <AppNavbar />

      <Container className="mt-4 mb-5" style={{ maxWidth: 900 }}>
        {/* Breadcrumb */}
        <Breadcrumb className="mb-3">
          <Breadcrumb.Item
            linkAs="span"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/app/goals")}
          >
            Goals
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{goal.title}</Breadcrumb.Item>
        </Breadcrumb>

        <h2 className="fw-semibold mb-1">{goal.title}</h2>
        {goal.description && (
          <p className="text-muted mb-3">{goal.description}</p>
        )}

        {/* Progress */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <ProgressBar now={progress} style={{ height: 8 }} />
            <div className="small text-muted mt-2">
              {completed} of {tasks.length} tasks completed
            </div>
          </Card.Body>
        </Card>

        <Row className="g-4 align-items-start">
          {/* Tasks */}
          <Col md={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-semibold mb-3">Tasks</h6>

                {tasks.length === 0 && (
                  <div className="text-muted small mb-3">
                    No tasks yet.
                  </div>
                )}

                {tasks.map((task: any) => (
                  <Form.Check
                    key={task._id}
                    type="checkbox"
                    className="mb-2"
                    checked={task.completed}
                    onChange={() => toggleTask(task._id)}
                    label={
                      <span
                        style={{
                          textDecoration: task.completed
                            ? "line-through"
                            : "none",
                          color: task.completed ? "#9ca3af" : "#111",
                        }}
                      >
                        {task.title}
                      </span>
                    }
                  />
                ))}

                <div className="d-flex gap-2 mt-3">
                  <Form.Control
                    placeholder="Add a task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                  <Button onClick={addTask}>Add</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column */}
          <Col md={4}>
            {/* Members */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between mb-3">
                  <h6 className="fw-semibold mb-0">Members</h6>
                  <Button size="sm" onClick={() => setShowMember(true)}>
                    Add
                  </Button>
                </div>

                {goal.members?.map((m: any) => (
                  <div
                    key={m.userId}
                    className="d-flex align-items-center gap-2 mb-3"
                  >
                    <div className="small" style={{ flex: 1 }}>
                      <div className="fw-medium">
                        {m.name || m.username || "Unknown"}
                      </div>
                      <div className="text-muted" style={{ fontSize: "0.85em" }}>
                        {m.email}
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>

            {/* ======================
                ACTIVITY (MODERN)
               ====================== */}
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-semibold mb-3">Activity</h6>

                <div style={{ maxHeight: 350, overflowY: "auto", paddingRight: 8 }}>
                  {activities.length === 0 && (
                    <div className="text-muted small">
                      No activity yet.
                    </div>
                  )}

                  {activities.map((a: any, i: number) => {
                    const getIcon = () => {
                      switch (a.type) {
                        case "TASK_COMPLETED":
                          return "✅";
                        case "TASK_REOPENED":
                          return "🔄";
                        case "TASK_ADDED":
                          return "➕";
                        default:
                          return "📝";
                      }
                    };

                    return (
                      <div
                        key={i}
                        className="mb-3 pb-2 border-bottom small"
                        style={{ display: "flex", gap: "8px" }}
                      >
                        <span style={{ fontSize: "1.2em", minWidth: "24px" }}>
                          {getIcon()}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div className="fw-medium">
                            {(a.performedBy?.username || "Someone")}{" "}
                            <span style={{ color: "#6b7280" }}>
                              {a.type === "TASK_COMPLETED"
                                ? "completed"
                                : a.type === "TASK_REOPENED"
                                ? "reopened"
                                : a.type === "TASK_ADDED"
                                ? "added a task"
                                : "updated"}
                            </span>
                          </div>

                          <div className="fst-italic" style={{ color: "#4b5563", marginTop: "4px" }}>
                            "{a.taskTitle || a.note}"
                          </div>

                          <div className="text-muted" style={{ fontSize: "0.85em", marginTop: "4px" }}>
                            {timeAgo(a.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <AddMemberModal
        show={showMember}
        onHide={() => setShowMember(false)}
        goalId={goal._id}
        onUpdated={fetchGoal}
      />

      <EditTimelineModal
        show={showTimeline}
        onHide={() => setShowTimeline(false)}
        goal={goal}
        onUpdated={fetchGoal}
      />
    </>
  );
}
