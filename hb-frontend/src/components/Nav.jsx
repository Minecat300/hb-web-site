import { useState } from "react";
import { NavLink } from "react-router-dom";

function NavBar({ user, logout }) {
    const [open, setOpen] = useState(false);

    const isAdmin = user.roles.includes("admin");
    const isManagement = user.roles.includes("management");

    const closeMenu = () => setOpen(false);

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