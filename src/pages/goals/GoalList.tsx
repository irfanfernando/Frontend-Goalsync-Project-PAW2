import { useEffect, useMemo, useState } from "react";
import { Container, Button, Row, Col, Spinner, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import AppNavbar from "../../components/layout/AppNavbar";

const resolveAvatar = (avatar?: string | null, name?: string) => {
  if (avatar) {
    // If it's a relative path (starts with avatars/), prepend backend URL
    if (avatar.startsWith("avatars/")) {
      return `http://localhost:3000/${avatar}`;
    }
    return avatar;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=e5e7eb&color=374151`;
};

export default function GoalList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<any[]>([]);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const fetchGoals = async () => {
    try {
      const res = await ApiClient.get("/goals");
      setGoals(res.data?.data ?? res.data ?? []);
    } catch (e) {
      alert("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const buckets = useMemo(() => {
    const normalize = (v: any) => {
      const n = typeof v === "number" ? v : 0;
      if (n < 0) return 0;
      if (n > 100) return 100;
      return Math.round(n);
    };

    const getObjectIdTime = (id?: string) => {
      if (!id || id.length < 8) return 0;
      return parseInt(id.substring(0, 8), 16) * 1000;
    };

    const list = (goals || []).map(g => ({
      ...g,
      progress: normalize(g.progress),
      __sortTime: g.createdAt ? new Date(g.createdAt).getTime() : getObjectIdTime(g._id),
    }))
    // newest first
    .sort((a, b) => (b.__sortTime || 0) - (a.__sortTime || 0));

    return {
      notStarted: list.filter(g => (g.progress ?? 0) === 0),
      inProgress: list.filter(g => (g.progress ?? 0) > 0 && (g.progress ?? 0) < 100),
      completed: list.filter(g => (g.progress ?? 0) === 100),
    };
  }, [goals]);

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

  const GoalCard = ({ g }: { g: any }) => {
    const hovered = hoverId === g._id;
    const progress = Math.round(g.progress || 0);
    return (
      <Col md={6} key={g._id}>
        <div
          role="button"
          onClick={() => navigate(`/app/goals/${g._id}`)}
          onMouseEnter={() => setHoverId(g._id)}
          onMouseLeave={() => setHoverId(null)}
          className="p-3"
          style={{
            backgroundColor: hovered ? "#ffffff" : "#ffffff",
            border: `1px solid ${hovered ? "#c7d2fe" : "#e5e7eb"}`,
            borderRadius: 8,
            boxShadow: hovered ? "0 4px 14px rgba(99,102,241,0.15)" : "none",
            transition: "all 160ms ease",
          }}
        >
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div style={{ minWidth: 0 }}>
              <div
                className="fw-semibold"
                style={{
                  fontSize: 16,
                  color: "#111",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {g.title}
              </div>
              {g.description && (
                <div
                  className="text-muted"
                  style={{
                    fontSize: 13,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as any,
                    overflow: "hidden",
                  }}
                >
                  {g.description}
                </div>
              )}
            </div>
            <div className="d-flex align-items-center gap-1">
              {(g.members || []).slice(0, 3).map((m: any, idx: number) => (
                <Image
                  key={idx}
                  src={resolveAvatar(m.avatar, m.name || m.email)}
                  roundedCircle
                  width={24}
                  height={24}
                />
              ))}
            </div>
          </div>

          {/* Custom progress bar (indigo) */}
          <div
            style={{
              height: 8,
              background: "#e5e7eb",
              borderRadius: 9999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#6366f1",
              }}
            />
          </div>
          <div className="mt-1" style={{ fontSize: 12, color: "#6b7280" }}>
            {progress}% complete
          </div>
        </div>
      </Col>
    );
  };

  return (
    <>
      <AppNavbar />

      <Container className="mt-4 mb-5" style={{ maxWidth: 920 }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 className="fw-semibold mb-1" style={{ color: "#111" }}>Goals</h2>
            <div className="text-muted" style={{ fontSize: 14 }}>Track progress and stay focused.</div>
          </div>
          <Button
            onClick={() => navigate("/app/goals/add")}
            style={{ backgroundColor: "#6366f1", borderColor: "#6366f1" }}
          >
            New goal
          </Button>
        </div>

        {/* Empty state */}
        {goals.length === 0 ? (
          <div className="text-center p-5" style={{ color: "#6b7280", fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            <div className="mb-1">No goals yet.</div>
            <div>Create your first goal to get started.</div>
            <div className="mt-3">
              <Button onClick={() => navigate("/app/goals/add")} style={{ backgroundColor: "#6366f1", borderColor: "#6366f1" }}>
                New goal
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Not started */}
            {buckets.notStarted.length > 0 && (
              <div className="mb-4">
                <div className="d-flex align-items-baseline justify-content-between mb-2">
                  <div style={{ fontSize: 12, color: "#111", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
                    🚀 Not started
                  </div>
                  <div className="text-muted small">{buckets.notStarted.length}</div>
                </div>
                <Row className="g-3">
                  {buckets.notStarted.map((g: any) => (
                    <GoalCard key={g._id} g={g} />
                  ))}
                </Row>
              </div>
            )}

            {/* In progress */}
            {buckets.inProgress.length > 0 && (
              <div className="mb-4">
                <div className="d-flex align-items-baseline justify-content-between mb-2">
                  <div style={{ fontSize: 12, color: "#111", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
                    ⚡ In progress
                  </div>
                  <div className="text-muted small">{buckets.inProgress.length}</div>
                </div>
                <Row className="g-3">
                  {buckets.inProgress.map((g: any) => (
                    <GoalCard key={g._id} g={g} />
                  ))}
                </Row>
              </div>
            )}

            {/* Completed */}
            {buckets.completed.length > 0 && (
              <div className="mb-4">
                <div className="d-flex align-items-baseline justify-content-between mb-2">
                  <div style={{ fontSize: 12, color: "#111", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
                    ✅ Completed
                  </div>
                  <div className="text-muted small">{buckets.completed.length}</div>
                </div>
                <Row className="g-3">
                  {buckets.completed.map((g: any) => (
                    <GoalCard key={g._id} g={g} />
                  ))}
                </Row>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}
