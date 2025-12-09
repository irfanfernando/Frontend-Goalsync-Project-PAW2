import { useState,type ChangeEvent, type FormEvent } from "react";
import {Form, Button, FormGroup, FormLabel, FormControl} from "react-bootstrap"
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
            setIsLoading(false);
        }
    }
    
    return (
        <div className="container mx-auto">
            <h1>SIGN IN PAGE</h1>

            <Form onSubmit={onSubmit}>

                <FormGroup className="mb-3" controlId="formemail">
                    <FormLabel>Email</FormLabel>
                    <FormControl
                        onChange={onHandleChange}
                        value={form.email}
                        name="email"
                        type="email"
                        placeholder="Email">
                    </FormControl>

                </FormGroup>

                <FormGroup className="mb-3" controlId="formpassword">
                    <FormLabel>Password</FormLabel>
                    <FormControl
                        onChange={onHandleChange}
                        value={form.password}
                        name="password"
                        type="password"
                        placeholder="Password">
                    </FormControl>

                </FormGroup>

                <Button type="submit" variant="primary" disabled={isLoading}>{isLoading ? "Loading..." : "Sign In"}</Button>

                <NavLink to="/signup">Belum punya akun? Sign Up </NavLink>

            </Form>

        </div>
    )


}


export default SignIn