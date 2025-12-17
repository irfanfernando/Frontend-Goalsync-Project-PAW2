import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Container>
          <div className="navbar-brand fw-bold" style={{ fontSize: "20px", color: "#6366f1" }}>
            🎯 GoalSync
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="ms-auto d-flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => navigate("/signin")}
                style={{ borderColor: "#d1d5db", color: "#374151" }}
              >
                Sign in
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/signup")}
                style={{ backgroundColor: "#6366f1", borderColor: "#6366f1" }}
              >
                Get started free
              </Button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section style={{ backgroundColor: "#ffffff", paddingTop: "80px", paddingBottom: "80px" }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="mb-4">
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: "#eef2ff",
                    color: "#6366f1",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "20px",
                  }}
                >
                  ✨ Welcome to GoalSync
                </span>
              </div>

              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "700",
                  lineHeight: "1.2",
                  marginBottom: "20px",
                  color: "#111827",
                }}
              >
                Set Goals. Track Progress. <span style={{ color: "#6366f1" }}>Achieve Together</span>
              </h1>

              <p
                style={{
                  fontSize: "16px",
                  color: "#6b7280",
                  lineHeight: "1.6",
                  marginBottom: "30px",
                }}
              >
                GoalSync is a collaborative goal management platform that helps teams and individuals stay focused, track progress in real-time, and celebrate wins together.
              </p>

              <div className="d-flex gap-3 flex-wrap">
                <Button
                  size="lg"
                  onClick={() => navigate("/signup")}
                  style={{
                    backgroundColor: "#6366f1",
                    borderColor: "#6366f1",
                    fontSize: "16px",
                    fontWeight: "600",
                    padding: "12px 32px",
                  }}
                >
                  Start for free
                </Button>
                <Button
                  size="lg"
                  variant="outline-secondary"
                  onClick={() => navigate("/signin")}
                  style={{
                    borderColor: "#d1d5db",
                    color: "#374151",
                    fontSize: "16px",
                    fontWeight: "600",
                    padding: "12px 32px",
                  }}
                >
                  Sign in
                </Button>
              </div>

              <div style={{ marginTop: "40px", fontSize: "13px", color: "#9ca3af" }}>
                ✓ Always free &nbsp; • &nbsp; ✓ No credit card &nbsp; • &nbsp; ✓ Start in seconds
              </div>
            </Col>

            {/* Hero Visual */}
            <Col lg={6}>
              <div
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  borderRadius: "20px",
                  padding: "40px",
                  color: "white",
                  textAlign: "center",
                  boxShadow: "0 20px 60px rgba(99, 102, 241, 0.2)",
                }}
              >
                <div style={{ fontSize: "80px", marginBottom: "20px" }}>🎯</div>
                <h3 style={{ marginBottom: "15px", fontWeight: "700" }}>Your Goals, Visualized</h3>
                <p style={{ marginBottom: 0, opacity: 0.9 }}>
                  See progress at a glance with real-time dashboards, task tracking, and activity feeds
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section style={{ backgroundColor: "#f9fafb", paddingTop: "80px", paddingBottom: "80px" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "36px",
                fontWeight: "700",
                marginBottom: "16px",
                color: "#111827",
              }}
            >
              Everything you need to succeed
            </h2>
            <p style={{ fontSize: "16px", color: "#6b7280" }}>
              Powerful features designed for modern goal-driven teams
            </p>
          </div>

          <Row className="g-4">
            {[
              {
                icon: "📊",
                title: "Real-time Progress Tracking",
                desc: "Track tasks, monitor progress bars, and celebrate milestones as they happen. See exactly where every goal stands.",
              },
              {
                icon: "👥",
                title: "Seamless Collaboration",
                desc: "Invite team members, assign tasks, and stay in sync. Activity logs show who did what and when.",
              },
              {
                icon: "🎯",
                title: "Smart Goal Organization",
                desc: "Create, categorize, and prioritize goals. Filter by status (Not started, In progress, Completed) instantly.",
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Built with modern tech for speed and reliability. Get instant updates without refreshing.",
              },
            ].map((feature, idx) => (
              <Col md={6} lg={3} key={idx}>
                <div
                  style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ fontSize: "40px", marginBottom: "15px" }}>{feature.icon}</div>
                  <h5 style={{ fontWeight: "600", marginBottom: "10px", color: "#111827" }}>
                    {feature.title}
                  </h5>
                  <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: 0 }}>
                    {feature.desc}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "36px",
                fontWeight: "700",
                marginBottom: "16px",
                color: "#111827",
              }}
            >
              Get started in 3 simple steps
            </h2>
            <p style={{ fontSize: "16px", color: "#6b7280" }}>
              From signup to success in minutes
            </p>
          </div>

          <Row className="g-4">
            {[
              {
                num: "1",
                title: "Create an Account",
                desc: "Sign up with your email. No credit card required.",
              },
              {
                num: "2",
                title: "Set Your Goals",
                desc: "Define your goals with descriptions, timelines, and tasks.",
              },
              {
                num: "3",
                title: "Collaborate & Track",
                desc: "Invite team members and start tracking progress together.",
              },
            ].map((step, idx) => (
              <Col md={4} key={idx}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#6366f1",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      fontWeight: "700",
                      margin: "0 auto 20px",
                    }}
                  >
                    {step.num}
                  </div>
                  <h5 style={{ fontWeight: "600", marginBottom: "10px", color: "#111827" }}>
                    {step.title}
                  </h5>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>
                    {step.desc}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: "#6366f1", paddingTop: "60px", paddingBottom: "60px" }}>
        <Container>
          <div style={{ textAlign: "center", color: "white" }}>
            <h2 style={{ fontSize: "40px", fontWeight: "700", marginBottom: "20px" }}>
              Ready to achieve your goals?
            </h2>
            <p style={{ fontSize: "16px", marginBottom: "30px", opacity: 0.9 }}>
              Join thousands of teams already using GoalSync to stay focused and productive.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              style={{
                backgroundColor: "white",
                color: "#6366f1",
                borderColor: "white",
                fontSize: "16px",
                fontWeight: "600",
                padding: "14px 40px",
              }}
            >
              Get started free
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#111827", color: "white", paddingTop: "40px", paddingBottom: "20px" }}>
        <Container>
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>
                🎯 GoalSync
              </div>
              <p style={{ fontSize: "13px", color: "#9ca3af" }}>
                Goal management for teams that want to achieve more.
              </p>
            </Col>
            <Col md={3} className="mb-3">
              <div style={{ fontWeight: "600", marginBottom: "10px" }}>Product</div>
              <div style={{ fontSize: "13px", color: "#9ca3af" }}>
                <div style={{ marginBottom: "8px", cursor: "pointer" }}>Features</div>
                <div style={{ marginBottom: "8px", cursor: "pointer" }}>Pricing</div>
                <div style={{ cursor: "pointer" }}>Security</div>
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <div style={{ fontWeight: "600", marginBottom: "10px" }}>Company</div>
              <div style={{ fontSize: "13px", color: "#9ca3af" }}>
                <div style={{ marginBottom: "8px", cursor: "pointer" }}>About</div>
                <div style={{ marginBottom: "8px", cursor: "pointer" }}>Blog</div>
                <div style={{ cursor: "pointer" }}>Contact</div>
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <div style={{ fontWeight: "600", marginBottom: "10px" }}>Legal</div>
              <div style={{ fontSize: "13px", color: "#9ca3af" }}>
                <div style={{ marginBottom: "8px", cursor: "pointer" }}>Privacy</div>
                <div style={{ cursor: "pointer" }}>Terms</div>
              </div>
            </Col>
          </Row>
          <div style={{ borderTop: "1px solid #374151", paddingTop: "20px", textAlign: "center", color: "#6b7280", fontSize: "13px" }}>
            © 2025 GoalSync. All rights reserved.
          </div>
        </Container>
      </footer>
    </div>
  );
}
