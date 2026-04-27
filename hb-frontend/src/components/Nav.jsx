import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function NavBar({ user, logout }) {
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState("dark");

    const isAdmin = user.roles.includes("admin");
    const isManagement = user.roles.includes("management");

    const closeMenu = () => setOpen(false);
    
    useEffect(() => {
        const saved = localStorage.getItem("theme");

        if (saved) {
            if (saved === "light") {
                document.body.classList.add("light");
                setTheme("light");
            } else {
                document.body.classList.remove("light");
                setTheme("dark");
            }
        } else {
            const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

            if (systemPrefersLight) {
                document.body.classList.add("light");
                setTheme("light");
            } else {
                document.body.classList.remove("light");
                setTheme("dark");
            }
        }
    }, []);

    return (
        <nav className="nav">
            <div className="nav-left">
                <div className="brand">HelsePanel</div>

                <button
                    className="menu-btn"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>

                <div className={`nav-links ${open ? "open" : ""}`}>
                    <NavLink onClick={closeMenu} to="/" className="nav-item">
                        Home
                    </NavLink>

                    <NavLink onClick={closeMenu} to="/send" className="nav-item">
                        Send Notice
                    </NavLink>

                    {(isAdmin || isManagement) && (
                        <>
                            <NavLink onClick={closeMenu} to="/review" className="nav-item">
                                Review
                            </NavLink>

                            <NavLink onClick={closeMenu} to="/review/stats" className="nav-item">
                                Stats
                            </NavLink>
                        </>
                    )}

                    {isAdmin && (
                        <NavLink onClick={closeMenu} to="/admin" className="nav-item admin">
                            Admin
                        </NavLink>
                    )}
                </div>
            </div>

            <div className="nav-right">
                <button
                    className="btn-gray"
                    onClick={toggleTheme}
                    title="Toggle theme"
                >
                    {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                </button>

                <div className="user-pill">
                    {user.username}
                </div>

                <button className="logout-btn" onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default NavBar;