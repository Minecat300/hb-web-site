import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import Login from "./components/login.jsx";
import Home from "./components/home.jsx";
import SendNotice from "./components/sendNotice.jsx";
import ReviewNotice from "./components/reviewNotice.jsx";
import NoticeStats from "./components/NoticeStats.jsx";
import AdminPanel from "./components/admin.jsx";
import NavBar from "./components/Nav.jsx";

const API_URL = "https://api.helsebygg.flameys.net/api/v1";

function RequireAuth({ user, children }) {
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

function RequireRole({ user, roles, children }) {
    const ok = roles.some(r => user.roles.includes(r));
    if (!ok) return <Navigate to="/" replace />;
    return children;
}

export default function App() {
    const [user, setUser] = useState(null);

    const logout = async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setUser(null);
        }
    };

    return (
        <BrowserRouter>
            <div className="app-layout">
                {user && <NavBar user={user} logout={logout} />}

                <main className="container">
                    <Routes>
                        <Route path="/login" element={<Login setUser={setUser} />} />

                        <Route
                            path="/"
                            element={
                                <RequireAuth user={user}>
                                    <Home user={user} />
                                </RequireAuth>
                            }
                        />

                        <Route
                            path="/send"
                            element={
                                <RequireAuth user={user}>
                                    <SendNotice />
                                </RequireAuth>
                            }
                        />

                        <Route
                            path="/review"
                            element={
                                <RequireAuth user={user}>
                                    <RequireRole user={user} roles={["admin", "management"]}>
                                        <ReviewNotice />
                                    </RequireRole>
                                </RequireAuth>
                            }
                        />

                        <Route
                            path="/review/stats"
                            element={
                                <RequireAuth user={user}>
                                    <RequireRole user={user} roles={["admin", "management"]}>
                                        <NoticeStats />
                                    </RequireRole>
                                </RequireAuth>
                            }
                        />

                        <Route
                            path="/admin"
                            element={
                                <RequireAuth user={user}>
                                    <RequireRole user={user} roles={["admin"]}>
                                        <AdminPanel user={user} />
                                    </RequireRole>
                                </RequireAuth>
                            }
                        />

                        <Route
                            path="*"
                            element={<Navigate to={user ? "/" : "/login"} />}
                        />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}