import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function NavBar({ user, logout }) {
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState("dark");

    const isAdmin = user.roles.includes("admin");
    const isManagement = user.roles.includes("management");

    const closeMenu = () => setOpen(false);

    /* LOAD SAVED THEME */
    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "light") {
            document.body.classList.add("light");
            setTheme("light");
        }
    }, []);

    /* TOGGLE THEME */
    const toggleTheme = () => {
        if (theme === "light") {
            document.body.classList.remove("light");
            localStorage.setItem("theme", "dark");
            setTheme("dark");
        } else {
            document.body.classList.add("light");
            localStorage.setItem("theme", "light");
            setTheme("light");
        }
    };

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