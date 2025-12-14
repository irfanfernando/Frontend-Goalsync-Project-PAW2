import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import AppNavbar from "../../components/layout/AppNavbar";
import UpdateProgressModal from "./UpdateProgressModal";
import EditTimelineModal from "./EditTimelineModal";

export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

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

  const daysLeft =
    goal.endDate
      ? Math.ceil(
          (new Date(goal.endDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

  return (
    <>
      <AppNavbar />

      <Container className="mt-4 mb-5" style={{ maxWidth: 900 }}>
        {/* Breadcrumb */}
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
            <div className="mb-4 p-3 bg-light rounded">
              <div className="fw-semibold mb-2">Timeline</div>

              {goal.startDate && goal.endDate ? (
                <>
                  <div className="small text-muted">
                    {new Date(goal.startDate).toLocaleDateString()} →{" "}
                    {new Date(goal.endDate).toLocaleDateString()}
                  </div>

                  {daysLeft !== null && (
                    <div
                      className={`small mt-1 ${
                        daysLeft < 7 ? "text-danger" : "text-muted"
                      }`}
                    >
                      {daysLeft <= 0
                        ? "Deadline passed"
                        : `${daysLeft} days remaining`}
                    </div>
                  )}
                </>
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

            {/* PROGRESS */}
            <div className="mb-4 p-3 bg-light rounded">
              <div className="fw-semibold mb-2">Progress</div>

              <ProgressBar now={progress} label={`${progress}%`} />

              <div className="text-muted small mt-2">
                {progress === 0
                  ? "Not started yet"
                  : progress === 100
                  ? "Completed"
                  : "You're making progress. Keep going."}
              </div>

              <Button className="mt-3" onClick={() => setShowProgress(true)}>
                Update progress
              </Button>
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

      <EditTimelineModal
        show={showTimeline}
        onHide={() => setShowTimeline(false)}
        goal={goal}
        onUpdated={fetchGoal}
      />
    </>
  );
}
