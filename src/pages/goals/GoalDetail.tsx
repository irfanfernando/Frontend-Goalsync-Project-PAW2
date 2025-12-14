import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  ProgressBar,
  Spinner,
  Image,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import AppNavbar from "../../components/layout/AppNavbar";
import UpdateProgressModal from "./UpdateProgressModal";
import ChangeMemberModal from "./ChangeMemberModal";

export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const fetchGoal = async () => {
    setLoading(true);
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

  const progress = goal.progress ?? 0;

  const progressText =
    progress === 0
      ? "Not started yet"
      : progress === 100
      ? "Completed"
      : "You're making progress. Keep going.";

  return (
    <>
      <AppNavbar />

      <Container className="mt-4 mb-5" style={{ maxWidth: 900 }}>
        {/* BREADCRUMB */}
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
            {/* TITLE */}
            <h2 className="mb-1">{goal.title}</h2>
            <div className="text-muted mb-4">
              {goal.description || "No description provided."}
            </div>

            {/* TIMELINE */}
            <div
              className="mb-4 p-3"
              style={{ background: "#f8f9fa", borderRadius: 8 }}
            >
              <div className="fw-semibold mb-2">Timeline</div>

              {goal.startDate && goal.endDate ? (
                <div className="small">
                  📅{" "}
                  {new Date(goal.startDate).toLocaleDateString()} →{" "}
                  {new Date(goal.endDate).toLocaleDateString()}
                </div>
              ) : (
                <div className="text-muted small">No timeline set</div>
              )}

              <Button
                size="sm"
                variant="outline-secondary"
                className="mt-2"
              >
                Edit timeline
              </Button>
            </div>

            {/* PROGRESS */}
            <div
              className="mb-4 p-3"
              style={{ background: "#f8f9fa", borderRadius: 8 }}
            >
              <div className="fw-semibold mb-2">Progress</div>

              <ProgressBar now={progress} label={`${progress}%`} />

              <div className="text-muted small mt-2">{progressText}</div>

              <Button
                size="sm"
                className="mt-2"
                onClick={() => setShowProgress(true)}
              >
                Update progress
              </Button>
            </div>

            <hr />

            {/* MEMBERS */}
            <div className="mb-4">
              <div className="fw-semibold mb-2">Members</div>

              <div className="d-flex gap-2 flex-wrap mb-2">
                {goal.members?.length ? (
                  goal.members.map((m: any) => (
                    <div
                      key={m.userId}
                      className="d-flex align-items-center gap-2"
                    >
                      <Image
                        roundedCircle
                        width={32}
                        height={32}
                        src={
                          m.avatar ??
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            m.name || "U"
                          )}`
                        }
                      />
                      <span className="small">{m.name}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-muted small">
                    No members assigned
                  </span>
                )}
              </div>

              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => setShowMemberModal(true)}
              >
                + Add / Change member
              </Button>
            </div>

            <hr />

            {/* ACTIVITY */}
            <div>
              <div className="fw-semibold mb-2">Activity</div>
              <div className="text-muted small">
                Activity will appear here when progress or members change.
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* MODALS */}
      <UpdateProgressModal
        show={showProgress}
        onHide={() => setShowProgress(false)}
        goal={goal}
        onUpdated={fetchGoal}
      />

      <ChangeMemberModal
        show={showMemberModal}
        onHide={() => setShowMemberModal(false)}
        goal={goal}
        onUpdated={fetchGoal}
      />
    </>
  );
}
