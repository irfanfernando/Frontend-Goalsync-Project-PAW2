import { Container } from "react-bootstrap";
import BrandLogo from "../ui/BrandLogo";

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
        background: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container style={{ maxWidth: 420 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "32px 28px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          <BrandLogo />

          <h2 className="mt-4 mb-1" style={{ fontWeight: 600 }}>
            {title}
          </h2>

          <p className="text-muted mb-4">{subtitle}</p>

          <div style={{ textAlign: "left" }}>
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
