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
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container style={{ maxWidth: 420, textAlign: "center" }}>
        <BrandLogo />
        <h2 className="mt-4 mb-1" style={{ fontWeight: 600 }}>
          {title}
        </h2>
        <p className="text-muted mb-4">{subtitle}</p>

        <div style={{ textAlign: "left" }}>
          {children}
        </div>
      </Container>
    </div>
  );
}
