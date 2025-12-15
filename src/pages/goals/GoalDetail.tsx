import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  ProgressBar,
  Form,
  Row,
  Col,
  Spinner,
  Image,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import AppNavbar from "../../components/layout/AppNavbar";
import AddMemberModal from "./AddMemberModal";
import EditTimelineModal from "./EditTimelineModal";

const API_BASE_URL = "http://localhost:3000";

const resolveAvatar = (avatar?: string | null, name?: string) => {
  if (avatar) return `${API_BASE_URL}${avatar}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "U"
  )}`;
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
    setLoading(false);
  };

  useEffect(() => {
    fetchGoal();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner />
      </div>
    );
  }

  const tasks = goal.tasks || [];
  const completed = tasks.filter((t: any) => t.completed).length;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const addTask = async () => {
    if (!newTask.trim()) return;
    await ApiClient.post(`/goals/${goal._id}/tasks`, { title: newTask });
    setNewTask("");
    fetchGoal();
  };

  const toggleTask = async (taskId: string) => {
    await ApiClient.patch(
      `/goals/${goal._id}/tasks/${taskId}/toggle`
    );
    fetchGoal();
  };

  /* =====================
     Activity (UX FIX)
  ===================== */
  const activities =
    goal.actions
      ?.slice()
      .reverse()
      .slice(0, 6) ?? [];

  return (
    <>
      <AppNavbar />

      <Container className="mt-4 mb-5" style={{ maxWidth: 900 }}>
        {/* BREADCRUMB */}
        <div className="mb-3 small text-muted">
          <span
            role="button"
            className="text-primary"
            onClick={() => navigate("/app/goals")}
          >
            Goals
          </span>{" "}
          / {goal.title}
        </div>

        {/* HEADER */}
        <h2 className="fw-semibold mb-1">{goal.title}</h2>
        {goal.description && (
          <p className="text-muted mb-4">{goal.description}</p>
        )}

        {/* PROGRESS */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <ProgressBar now={progress} style={{ height: 8 }} />
            <div className="small text-muted mt-2">
              {completed} of {tasks.length} tasks completed
            </div>
          </Card.Body>
        </Card>

        <Row className="g-4">
          {/* TASKS */}
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
                          color: task.completed ? "#999" : "#000",
                        }}
                      >
                        {task.title}
                      </span>
                    }
                  />
                ))}

                <div className="d-flex gap-2 mt-3">
                  <Form.Control
                    placeholder="Add a task and press Add"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                  <Button onClick={addTask}>Add</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* RIGHT SIDE */}
          <Col md={4}>
            {/* TIMELINE */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h6 className="fw-semibold mb-0">Timeline</h6>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => setShowTimeline(true)}
                  >
                    Edit
                  </Button>
                </div>

                {goal.startDate ? (
                  <div className="text-muted small">
                    {new Date(goal.startDate).toLocaleDateString()} –{" "}
                    {new Date(goal.endDate).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="text-muted small">
                    No timeline set
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* MEMBERS (AVATAR) */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-semibold mb-0">Members</h6>
                  <Button
                    size="sm"
                    onClick={() => setShowMember(true)}
                  >
                    Add
                  </Button>
                </div>

                {goal.members?.length === 0 && (
                  <div className="text-muted small">
                    No members assigned
                  </div>
                )}

                {goal.members?.map((m: any) => (
                  <div
                    key={m.userId}
                    className="d-flex align-items-center gap-2 mb-2"
                  >
                    <Image
                      src={resolveAvatar(m.avatar, m.name || m.email)}
                      roundedCircle
                      width={32}
                      height={32}
                    />
                    <div className="small">
                      <div className="fw-medium">
                        {m.name || "Unknown"}
                      </div>
                      <div className="text-muted">
                        {m.email}
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>

            {/* ACTIVITY (LIMITED + SCROLLABLE) */}
            <Card className="border-0 shadow-sm">
              <Card.Body
                style={{ maxHeight: 260, overflowY: "auto" }}
              >
                <h6 className="fw-semibold mb-2">Activity</h6>

                {activities.length === 0 && (
                  <div className="text-muted small">
                    No activity yet.
                  </div>
                )}

                {activities.map((a: any, i: number) => (
                  <div
                    key={i}
                    className="small mb-2 d-flex gap-2"
                  >
                    <span>
                      {a.delta > 0 ? "✔" : "↺"}
                    </span>
                    <div>
                      <div>{a.note}</div>
                      <div className="text-muted">
                        {new Date(a.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
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
