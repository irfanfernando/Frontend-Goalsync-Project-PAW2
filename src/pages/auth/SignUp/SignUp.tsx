import { useState, type ChangeEvent, type FormEvent } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import ApiClient from "../../../utils/ApiClient";
import AuthLayout from "../../../components/layout/AuthLayout";

export default function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await ApiClient.post("/signup", form);
      navigate("/signin", { replace: true });
    } catch (err: any) {
      alert(err?.response?.data?.message || "Signup gagal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking goals with your team."
    >
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            name="username"
            placeholder="Your name"
            value={form.username}
            onChange={onChange}
            required
          />
        </Form.Group>

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

        <Form.Group className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Button type="submit" className="w-100" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" /> : "Sign Up"}
        </Button>

        <div className="text-center mt-3">
          <NavLink to="/signin">Already have an account? Sign in</NavLink>
        </div>
      </Form>
    </AuthLayout>
  );
}
