import { useState,type ChangeEvent, type FormEvent } from "react";
import {Form, Button, Card, Spinner} from "react-bootstrap"
import ApiClient from "../../../utils/ApiClient";
import {NavLink, useNavigate} from "react-router-dom";

interface SignUpForm {
    username: string,
    email: string,
    password: string,
}

function SignUp() {
    const navigate = useNavigate();
    const [form, setform] = useState<SignUpForm>({
        username: "",
        email: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false);

    const onHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value} = event.target

        setform({
            ...form,
            [name]: value
        })
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true);

        try{
            const payload = { ...form, email: form.email.trim() };
            const response = await ApiClient.post("/signup", payload)

            console.log("Signup response:", response.data)
            alert("Signup berhasil, silahkan login !")
            //navigate ini dibuat agar setelah signup langsung diarahkan ke halaman signin
            navigate("/signin", { replace: true });
        } catch (error: any){
            console.error("Signup error:", error)
            
            if (error.response) {
                console.error("Response status:", error.response.status)
                console.error("Response data:", error.response.data)
                console.error("Response headers:", error.response.headers)
                alert(`Signup Gagal: ${error.response.data?.message || error.response.statusText || "Unknown error"}`)
            } else if (error.request) {
                console.error("No response received:", error.request)
                alert("Signup Gagal: Tidak ada respons dari server")
            } else {
                console.error("Error:", error.message)
                alert("Signup Gagal: " + error.message)
            }
        }
    }

    return (
        <div className="page-center">
            <Card className="auth-card shadow-sm">
                <Card.Body>
                    <h2 className="mb-2">Sign Up to GoalSync</h2>
                    <p className="text-muted small">Masukkan Username, Email, dan Password Anda.</p>

                    <Form onSubmit={onSubmit} className="mt-3">

                        <Form.Group className="mb-3" controlId="formusername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            onChange={onHandleChange}
                            value={form.username}
                            name="username"
                            type="text"
                            placeholder="Masukkan Username"
                            required
                            autoComplete="name"
                        />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formemail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            onChange={onHandleChange}
                            value={form.email}
                            name="email"
                            type="email"
                            placeholder="Masukkan Email"
                            required
                            autoComplete="email"
                        />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formpassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            onChange={onHandleChange}
                            value={form.password}
                            name="password"
                            type="password"
                            placeholder="Masukkan Password"
                            required
                            autoComplete="new-password"
                        />
                        </Form.Group>

                        <div className="d-flex align-items-center justify-content-between gap-2">
                        <Button type="submit" variant="primary" disabled={isLoading}>
                            {isLoading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                {"  "}Loading...
                            </>
                            ) : (
                            "Sign In"
                            )}
                        </Button>

                        <NavLink to="/signin" className="small">
                            Sudah punya akun? Sign In
                        </NavLink>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default SignUp