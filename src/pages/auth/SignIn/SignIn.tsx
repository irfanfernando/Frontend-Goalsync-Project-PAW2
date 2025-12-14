import { useState, type ChangeEvent, type FormEvent } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import ApiClient from "../../../utils/ApiClient";
import AuthLayout from "../../../components/layout/AuthLayout";

export default function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await ApiClient.post("/signin", form);
      const token = res.data?.data?.token;
      if (token) {
        localStorage.setItem("AuthToken", token);
        navigate("/app/goals", { replace: true });
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login gagal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to GoalSync"
      subtitle="Track goals and progress together."
    >
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Button type="submit" className="w-100" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" /> : "Sign In"}
        </Button>

        <div className="text-center mt-3">
          <NavLink to="/signup">Don’t have an account? Sign up</NavLink>
        </div>
      </Form>
    </AuthLayout>
  );
}
