import { Container } from "react-bootstrap";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <Container style={{ maxWidth: 420 }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "48px 40px",
            boxShadow: "0 10px 40px rgba(99, 102, 241, 0.08)",
            border: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>🎯</div>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "#6366f1", marginBottom: "24px" }}>
            GoalSync
          </div>

          <h2 className="mt-2 mb-2" style={{ fontWeight: "700", fontSize: "28px", color: "#111827" }}>
            {title}
          </h2>

          <p style={{ color: "#6b7280", marginBottom: "32px", fontSize: "14px" }}>
            {subtitle}
          </p>

          <div style={{ textAlign: "left" }}>
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
