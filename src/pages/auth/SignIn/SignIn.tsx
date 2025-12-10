import { useState,type ChangeEvent, type FormEvent } from "react";
import {Form, Button, Card, Spinner} from "react-bootstrap"
import ApiClient from "../../../utils/ApiClient";
import {NavLink, useNavigate} from "react-router-dom";

type SignInForm =  {
    email: string,
    password: string,
}

function SignIn(){
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [form, setform] = useState<SignInForm>({
        email: "",
        password: "",
    })

    const onHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value} = event.target;

        setform((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        try{
            const response = await ApiClient.post("/signin", form)

            console.log("Login response:", response.data)

            if(response.status === 200) {
                const token = response.data?.token || response.data?.data?.token

                if(token) {
                    localStorage.setItem("AuthToken", token)

                    navigate("/app/goals", {
                        replace: true
                    })
                }
            }
            setIsLoading(false);
        } catch (error: any){
            console.error("Signin error:", error)
            
            if (error.response) {
                console.error("Response status:", error.response.status)
                console.error("Response data:", error.response.data)
                console.error("Response headers:", error.response.headers)
                alert(`Signin Gagal: ${error.response.data?.message || error.response.statusText || "Unknown error"}`)
            } else if (error.request) {
                console.error("No response received:", error.request)
                alert("Signin Gagal: Tidak ada respons dari server")
            } else {
                console.error("Error:", error.message)
                alert("Signin Gagal: " + error.message)
            }
            setIsLoading(false);
        }
    }
    
    return (
        <div className="page-center">
            <Card className="auth-card shadow-sm">
                <Card.Body>
                    <h2 className="mb-2">Sign in to GoalSync</h2>
                    <p className="text-muted small">Masukkan email & password Anda.</p>

                    <Form onSubmit={onSubmit} className="mt-3">
                        <Form.Group className="mb-3" controlId="formemail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            onChange={onHandleChange}
                            value={form.email}
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            autoComplete="username"
                        />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formpassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            onChange={onHandleChange}
                            value={form.password}
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            autoComplete="current-password"
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

                        <NavLink to="/signup" className="small">
                            Belum punya akun? Sign Up
                        </NavLink>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )


}


export default SignIn