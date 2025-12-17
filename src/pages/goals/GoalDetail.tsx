import { useEffect, useState } from "react";
import {
  Container,
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

//Helpers
const resolveAvatar = (avatar?: string | null, name?: string) => {
  if (avatar) {
    // If it's a relative path (starts with avatars/), prepend backend URL
    if (avatar.startsWith("avatars/")) {
      return `http://localhost:3000/${avatar}`;
    }
    return avatar;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "U"
  )}&background=e5e7eb&color=374151`;
};

const timeAgo = (date: string) => {
  const diff = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const getActivityIcon = (note: string) => {
  if (note.includes("Added subtask")) return { icon: "📝", color: "#8b5cf6", bg: "#faf5ff" };
  if (note.includes("completed subtask")) return { icon: "✓", color: "#059669", bg: "#ecfdf5" };
  if (note.includes("reopened subtask")) return { icon: "↻", color: "#ea580c", bg: "#fff7ed" };
  if (note.includes("Assigned subtask")) return { icon: "👤", color: "#3b82f6", bg: "#eff6ff" };
  if (note.includes("Added task")) return { icon: "➕", color: "#4f46e5", bg: "#eef2ff" };
  if (note.includes("Completed task")) return { icon: "✅", color: "#059669", bg: "#ecfdf5" };
  if (note.includes("Reopened task")) return { icon: "🔄", color: "#ea580c", bg: "#fff7ed" };
  if (note.includes("Added member")) return { icon: "👤", color: "#3b82f6", bg: "#eff6ff" };
  if (note.includes("Removed member")) return { icon: "👤❌", color: "#dc2626", bg: "#fef2f2" };
  if (note.includes("updated")) return { icon: "✏️", color: "#8b5cf6", bg: "#faf5ff" };
  return { icon: "📝", color: "#6b7280", bg: "#f9fafb" };
};

export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [showMember, setShowMember] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [newSubtaskInputs, setNewSubtaskInputs] = useState<Record<string, string>>({});
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState("");
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editingGoalTitle, setEditingGoalTitle] = useState("");
  const [editingGoalDescription, setEditingGoalDescription] = useState("");

  const fetchGoal = async () => {
    try {
      const res = await ApiClient.get(`/goals/${id}`);
      setGoal(res.data?.data ?? res.data);
    } catch (err) {
      alert("Failed to load goal");
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
          <Spinner />
        </div>
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
    try {
      await ApiClient.patch(
        `/goals/${goal._id}/tasks/${taskId}/toggle`
      );
      fetchGoal();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to toggle task");
    }
  };

  const toggleTaskExpand = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const addSubtask = async (taskId: string) => {
    const title = newSubtaskInputs[taskId]?.trim();
    if (!title) return;

    try {
      await ApiClient.post(
        `/goals/${goal._id}/tasks/${taskId}/subtasks`,
        { title }
      );
      setNewSubtaskInputs({ ...newSubtaskInputs, [taskId]: "" });
      fetchGoal();
    } catch (err) {
      alert("Failed to add subtask");
    }
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    try {
      await ApiClient.patch(
        `/goals/${goal._id}/tasks/${taskId}/subtasks/${subtaskId}/toggle`
      );
      fetchGoal();
    } catch (err) {
      alert("Failed to toggle subtask");
    }
  };

  const startEditingTask = (taskId: string, currentTitle: string) => {
    setEditingTaskId(taskId);
    setEditingTaskTitle(currentTitle);
  };

  const saveTaskEdit = async (taskId: string) => {
    if (!editingTaskTitle.trim()) {
      setEditingTaskId(null);
      return;
    }

    try {
      await ApiClient.patch(
        `/goals/${goal._id}/tasks/${taskId}/edit`,
        { title: editingTaskTitle }
      );
      setEditingTaskId(null);
      fetchGoal();
    } catch (err) {
      alert("Failed to update task");
    }
  };

  const cancelTaskEdit = () => {
    setEditingTaskId(null);
    setEditingTaskTitle("");
  };

  const startEditingSubtask = (subtaskId: string, currentTitle: string) => {
    setEditingSubtaskId(subtaskId);
    setEditingSubtaskTitle(currentTitle);
  };

  const saveSubtaskEdit = async (taskId: string, subtaskId: string) => {
    if (!editingSubtaskTitle.trim()) {
      setEditingSubtaskId(null);
      return;
    }

    try {
      await ApiClient.patch(
        `/goals/${goal._id}/tasks/${taskId}/subtasks/${subtaskId}/edit`,
        { title: editingSubtaskTitle }
      );
      setEditingSubtaskId(null);
      fetchGoal();
    } catch (err) {
      alert("Failed to update subtask");
    }
  };

  const cancelSubtaskEdit = () => {
    setEditingSubtaskId(null);
    setEditingSubtaskTitle("");
  };

  const startEditingGoal = () => {
    setEditingGoalTitle(goal.title || "");
    setEditingGoalDescription(goal.description || "");
    setIsEditingGoal(true);
  };

  const saveGoalEdit = async () => {
    if (!editingGoalTitle.trim()) {
      alert("Goal title cannot be empty");
      return;
    }
    try {
      await ApiClient.patch(`/goals/${goal._id}`, {
        title: editingGoalTitle.trim(),
        description: editingGoalDescription.trim(),
      });
      setIsEditingGoal(false);
      fetchGoal();
    } catch (err) {
      alert("Failed to update goal");
    }
  };

  const cancelGoalEdit = () => {
    setIsEditingGoal(false);
    setEditingGoalTitle("");
    setEditingGoalDescription("");
  };

  const removeMember = async (userId: string) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      await ApiClient.delete(`/goals/${goal._id}/members`, { data: { userId } });
      fetchGoal();
    }
  };

  const activities =
    goal.actions
      ?.slice()
      .reverse()
      .slice(0, 6) ?? [];

  return (
    <>
      <AppNavbar />

      <Container className="mt-4 mb-5" style={{ maxWidth: 900 }}>
        {/* Breadcrumb */}
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

        {/* Header */}
        {isEditingGoal ? (
          <div className="mb-3">
            <Form.Control
              value={editingGoalTitle}
              onChange={(e) => setEditingGoalTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  saveGoalEdit();
                } else if (e.key === "Escape") {
                  cancelGoalEdit();
                }
              }}
              placeholder="Goal title"
              autoFocus
              style={{ fontSize: "24px", fontWeight: "600", borderColor: "#6366f1", marginBottom: "12px" }}
            />
            <Form.Control
              as="textarea"
              rows={2}
              value={editingGoalDescription}
              onChange={(e) => setEditingGoalDescription(e.target.value)}
              placeholder="Goal description (optional)"
              style={{ fontSize: "14px", borderColor: "#6366f1", marginBottom: "12px" }}
            />
            <div className="d-flex gap-2">
              <Button
                size="sm"
                onClick={saveGoalEdit}
                style={{ backgroundColor: "#6366f1", borderColor: "#6366f1", fontSize: "12px" }}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={cancelGoalEdit}
                style={{ fontSize: "12px" }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="d-flex align-items-start gap-2 mb-1">
              <h2
                className="fw-semibold mb-0"
                onClick={goal.isOwner ? startEditingGoal : undefined}
                style={{
                  cursor: goal.isOwner ? "pointer" : "default",
                  flex: 1,
                  padding: "4px 0",
                  borderRadius: "4px",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (goal.isOwner) {
                    (e.target as HTMLElement).style.backgroundColor = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = "transparent";
                }}
                title={goal.isOwner ? "Click to edit" : ""}
              >
                {goal.title}
              </h2>
            </div>

            {isEditingGoal || goal.description ? (
              <p
                className="text-muted mb-3"
                onClick={goal.isOwner ? startEditingGoal : undefined}
                style={{
                  cursor: goal.isOwner ? "pointer" : "default",
                  padding: "4px 0",
                  borderRadius: "4px",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (goal.isOwner) {
                    (e.target as HTMLElement).style.backgroundColor = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = "transparent";
                }}
                title={goal.isOwner ? "Click to edit" : ""}
              >
                {goal.description || (goal.isOwner ? "Add a description..." : "")}
              </p>
            ) : (
              goal.isOwner && (
                <p
                  className="text-muted mb-3"
                  onClick={startEditingGoal}
                  style={{
                    cursor: "pointer",
                    fontStyle: "italic",
                    padding: "4px 0",
                    borderRadius: "4px",
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = "transparent";
                  }}
                  title="Click to add description"
                >
                  Add a description...
                </p>
              )
            )}
          </>
        )}

        {/* Owner Section */}
        <div className="mb-4 p-3" style={{ backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            👤 Owner
          </div>
          <div className="d-flex align-items-center gap-2">
            <Image
              src={resolveAvatar(goal.createdBy?.avatar, goal.createdBy?.username)}
              roundedCircle
              width={40}
              height={40}
              style={{ objectFit: "cover" }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: "500", color: "#111" }}>
                {goal.createdBy?.username || "Unknown"}
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                {goal.createdBy?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4" style={{ padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>📊 Progress</div>
          <ProgressBar now={progress} style={{ height: 8, backgroundColor: "#e5e7eb" }} />
          <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "8px" }}>
            {completed} of {tasks.length} tasks completed
          </div>
        </div>

        <Row className="g-4 align-items-start">
          {/* Tasks */}
          <Col md={8}>
            <div style={{ padding: "20px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <h6 className="fw-semibold mb-3" style={{ fontSize: "14px", color: "#111" }}>✓ Tasks</h6>

              {tasks.length === 0 && (
                <div style={{ fontSize: "14px", color: "#9ca3af", fontStyle: "italic", textAlign: "center", padding: "32px 0" }}>
                  Break your goal into actionable tasks and subtasks to get started.
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {tasks.map((task: any) => {
                  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
                  const isExpanded = expandedTasks.has(task._id);
                  const completedSubtasks = hasSubtasks ? task.subtasks.filter((st: any) => st.completed).length : 0;
                  const totalSubtasks = hasSubtasks ? task.subtasks.length : 0;

                  return (
                    <div
                      key={task._id}
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "16px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {/* Main Task Row */}
                      <div className="d-flex align-items-start gap-3">
                        {/* Checkbox (always shown) */}
                        <Form.Check
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task._id)}
                          disabled={hasSubtasks}
                          style={{ marginTop: "2px", cursor: hasSubtasks ? "not-allowed" : "pointer" }}
                        />

                        {/* Task Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {editingTaskId === task._id ? (
                            <div className="d-flex gap-2 align-items-center mb-2">
                              <Form.Control
                                size="sm"
                                value={editingTaskTitle}
                                onChange={(e) => setEditingTaskTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    saveTaskEdit(task._id);
                                  } else if (e.key === "Escape") {
                                    cancelTaskEdit();
                                  }
                                }}
                                autoFocus
                                style={{ fontSize: "14px", borderColor: "#6366f1" }}
                              />
                              <Button
                                size="sm"
                                onClick={() => saveTaskEdit(task._id)}
                                style={{
                                  backgroundColor: "#6366f1",
                                  borderColor: "#6366f1",
                                  fontSize: "12px",
                                  padding: "4px 12px",
                                }}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-secondary"
                                onClick={cancelTaskEdit}
                                style={{ fontSize: "12px", padding: "4px 12px" }}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div
                              onClick={() => startEditingTask(task._id, task.title)}
                              style={{
                                fontSize: "14px",
                                fontWeight: hasSubtasks ? "600" : "500",
                                color: task.completed ? "#9ca3af" : "#111",
                                textDecoration: task.completed ? "line-through" : "none",
                                marginBottom: hasSubtasks ? "6px" : "0",
                                cursor: "pointer",
                                padding: "4px 0",
                                borderRadius: "4px",
                              }}
                              onMouseEnter={(e) => {
                                if (!task.completed) {
                                  (e.target as HTMLElement).style.backgroundColor = "#f9fafb";
                                }
                              }}
                              onMouseLeave={(e) => {
                                (e.target as HTMLElement).style.backgroundColor = "transparent";
                              }}
                              title="Click to edit"
                            >
                              {task.title}
                            </div>
                          )}

                          {hasSubtasks && (
                            <div style={{ fontSize: "13px", color: "#6b7280" }}>
                              {completedSubtasks} / {totalSubtasks} subtasks completed
                            </div>
                          )}

                          {/* Subtasks (expanded) */}
                          {isExpanded && (
                            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f3f4f6" }}>
                              {hasSubtasks && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
                                  {task.subtasks.map((subtask: any) => (
                                    <div
                                      key={subtask._id}
                                      className="d-flex align-items-start gap-2"
                                      style={{
                                        padding: "10px 12px",
                                        backgroundColor: "#f9fafb",
                                        borderRadius: "6px",
                                        border: "1px solid #f3f4f6",
                                      }}
                                    >
                                      <Form.Check
                                        type="checkbox"
                                        checked={subtask.completed}
                                        onChange={() => toggleSubtask(task._id, subtask._id)}
                                        style={{ marginTop: "2px" }}
                                      />
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        {editingSubtaskId === subtask._id ? (
                                          <div className="d-flex gap-2 align-items-center">
                                            <Form.Control
                                              size="sm"
                                              value={editingSubtaskTitle}
                                              onChange={(e) => setEditingSubtaskTitle(e.target.value)}
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                  saveSubtaskEdit(task._id, subtask._id);
                                                } else if (e.key === "Escape") {
                                                  cancelSubtaskEdit();
                                                }
                                              }}
                                              autoFocus
                                              style={{ fontSize: "14px", borderColor: "#6366f1" }}
                                            />
                                            <Button
                                              size="sm"
                                              onClick={() => saveSubtaskEdit(task._id, subtask._id)}
                                              style={{
                                                backgroundColor: "#6366f1",
                                                borderColor: "#6366f1",
                                                fontSize: "11px",
                                                padding: "2px 8px",
                                                whiteSpace: "nowrap",
                                              }}
                                            >
                                              Save
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline-secondary"
                                              onClick={cancelSubtaskEdit}
                                              style={{ fontSize: "11px", padding: "2px 8px" }}
                                            >
                                              ✕
                                            </Button>
                                          </div>
                                        ) : (
                                          <>
                                            <div
                                              onClick={() => startEditingSubtask(subtask._id, subtask.title)}
                                              style={{
                                                fontSize: "14px",
                                                color: subtask.completed ? "#9ca3af" : "#374151",
                                                textDecoration: subtask.completed ? "line-through" : "none",
                                                cursor: "pointer",
                                                padding: "2px 0",
                                                borderRadius: "4px",
                                              }}
                                              onMouseEnter={(e) => {
                                                if (!subtask.completed) {
                                                  (e.target as HTMLElement).style.backgroundColor = "#ffffff";
                                                }
                                              }}
                                              onMouseLeave={(e) => {
                                                (e.target as HTMLElement).style.backgroundColor = "transparent";
                                              }}
                                              title="Click to edit"
                                            >
                                              {subtask.title}
                                            </div>
                                            {subtask.assignedTo && (
                                              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
                                                Assigned to {subtask.assignedTo.username || "Unknown"}
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Add Subtask Input */}
                              <div className="d-flex gap-2">
                                <Form.Control
                                  size="sm"
                                  placeholder="Add a subtask..."
                                  value={newSubtaskInputs[task._id] || ""}
                                  onChange={(e) =>
                                    setNewSubtaskInputs({
                                      ...newSubtaskInputs,
                                      [task._id]: e.target.value,
                                    })
                                  }
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addSubtask(task._id);
                                    }
                                  }}
                                  style={{ fontSize: "14px", borderColor: "#e5e7eb" }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => addSubtask(task._id)}
                                  style={{
                                    backgroundColor: "#6366f1",
                                    borderColor: "#6366f1",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Add Subtask Button (when collapsed and no subtasks) */}
                          {!isExpanded && !hasSubtasks && (
                            <Button
                              size="sm"
                              variant="link"
                              onClick={() => toggleTaskExpand(task._id)}
                              style={{
                                padding: 0,
                                marginTop: "8px",
                                color: "#8b5cf6",
                                textDecoration: "none",
                                fontSize: "13px",
                                fontWeight: "500",
                              }}
                            >
                              + Add subtasks
                            </Button>
                          )}
                        </div>

                        {/* Expand/Collapse Toggle (right side) */}
                        {hasSubtasks && (
                          <Button
                            variant="link"
                            onClick={() => toggleTaskExpand(task._id)}
                            style={{
                              padding: "4px 8px",
                              minWidth: "28px",
                              height: "28px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#6b7280",
                              textDecoration: "none",
                              fontSize: "14px",
                              borderRadius: "4px",
                              backgroundColor: isExpanded ? "#f3f4f6" : "transparent",
                            }}
                            title={isExpanded ? "Collapse subtasks" : "Expand subtasks"}
                          >
                            {isExpanded ? "▼" : "▶"}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Task */}
              <div className="d-flex gap-2 mt-4">
                <Form.Control
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTask();
                    }
                  }}
                  style={{ fontSize: "14px", borderColor: "#e5e7eb", padding: "8px 12px" }}
                />
                <Button
                  onClick={addTask}
                  style={{
                    backgroundColor: "#6366f1",
                    borderColor: "#6366f1",
                    fontSize: "14px",
                    fontWeight: "600",
                    padding: "10px 20px",
                  }}
                >
                  Add Task
                </Button>
              </div>
            </div>
          </Col>

          {/* Right Column */}
          <Col md={4}>
            {/* Timeline */}
            <div className="mb-4" style={{ padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="fw-semibold mb-1" style={{ fontSize: "14px", color: "#111" }}>📅 Timeline</h6>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>Project duration</div>
                </div>
                <Button
                  size="sm"
                  variant="link"
                  style={{ padding: 0, color: "#6366f1", textDecoration: "none", fontSize: "13px" }}
                  onClick={() => setShowTimeline(true)}
                >
                  ✏️ Edit
                </Button>
              </div>

              {goal.startDate ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#6b7280", minWidth: "40px" }}>From:</span>
                    <span style={{ fontSize: "13px", color: "#111", fontWeight: "500" }}>
                      {new Date(goal.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#6b7280", minWidth: "40px" }}>To:</span>
                    <span style={{ fontSize: "13px", color: "#111", fontWeight: "500" }}>
                      {new Date(goal.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: "13px", color: "#9ca3af", fontStyle: "italic" }}>
                  No timeline set yet. Click Edit to add dates.
                </div>
              )}
            </div>

            {/* Members */}
            <div style={{ padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="fw-semibold mb-1" style={{ fontSize: "14px", color: "#111" }}>👥 Members</h6>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>{goal.members?.length || 0} member{goal.members?.length !== 1 ? "s" : ""}</div>
                </div>
                <Button
                  size="sm"
                  variant="link"
                  style={{ padding: 0, color: "#6366f1", textDecoration: "none", fontSize: "13px" }}
                  onClick={() => setShowMember(true)}
                >
                  + Add
                </Button>
              </div>

              {goal.members?.length === 0 && (
                <div style={{ fontSize: "13px", color: "#9ca3af", fontStyle: "italic", textAlign: "center", padding: "12px 0" }}>
                  No members yet. Invite collaborators to work together.
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {goal.members?.map((m: any) => (
                  <div
                    key={m.userId}
                    className="d-flex align-items-center justify-content-between p-2"
                    style={{ backgroundColor: "white", borderRadius: "6px", border: "1px solid #f3f4f6" }}
                  >
                    <div className="d-flex align-items-center gap-2" style={{ flex: 1 }}>
                      <Image
                        src={resolveAvatar(m.userId?.avatar || m.avatar, m.userId?.username || m.name || m.email)}
                        roundedCircle
                        width={36}
                        height={36}
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="fw-medium" style={{ fontSize: "13px", color: "#111" }}>
                          {m.name || "Unknown"}
                        </div>
                        <div style={{ fontSize: "11px", color: "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {m.email}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ fontSize: "11px", color: "#9ca3af", backgroundColor: "#f3f4f6", padding: "4px 8px", borderRadius: "4px", whiteSpace: "nowrap" }}>
                        {m.role || "member"}
                      </div>
                      <Button
                        size="sm"
                        variant="link"
                        style={{ padding: "0 6px", color: "#dc2626", textDecoration: "none", fontSize: "12px" }}
                        onClick={() => removeMember(m.userId)}
                        title="Remove member"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div style={{ padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <h6 className="fw-semibold mb-3" style={{ fontSize: "14px", color: "#111" }}>📋 Activity</h6>
              <div style={{ maxHeight: 320, overflowY: "auto" }}>

                {activities.length === 0 && (
                  <div className="text-muted small text-center py-3">
                    No activity yet.
                  </div>
                )}

                {activities.map((a: any, i: number) => {
                  const { icon, color, bg } = getActivityIcon(a.note);
                  return (
                    <div
                      key={i}
                      className="d-flex gap-2 mb-2 p-2 rounded"
                      style={{ backgroundColor: bg }}
                    >
                      <div
                        style={{
                          fontSize: "18px",
                          minWidth: "28px",
                          textAlign: "center",
                          flexShrink: 0,
                        }}
                      >
                        {icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="small fw-medium" style={{ color }}>
                          {a.userId?.username || "Someone"}
                        </div>
                        <div
                          className="small"
                          style={{
                            color: "#374151",
                            wordBreak: "break-word",
                          }}
                        >
                          {a.note}
                        </div>
                        <div
                          className="small"
                          style={{ color: "#9ca3af", marginTop: "4px" }}
                        >
                          {timeAgo(a.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modals */}
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
