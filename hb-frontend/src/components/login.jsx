import { useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = "https://api.helsebygg.flameys.net/api/v1";

function Login({ setUser }) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`${API_URL}/auth/login`, {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (!res.ok) return alert(data.message);

        setUser({
            username: data.username,
            roles: data.roles || []
        });

        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
                <input name="username" onChange={handleChange} placeholder="Username" />
                <input name="password" type="password" onChange={handleChange} placeholder="Password" />

                <button className="bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;