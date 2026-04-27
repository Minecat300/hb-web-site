import { NavLink } from "react-router-dom";

function NavBar({ user, logout }) {
    const isAdmin = user.roles.includes("admin");
    const isManagement = user.roles.includes("management");

    return (
        <nav className="nav">
            <div className="nav-left">
                <div className="brand">HelsePanel</div>

                <NavLink to="/" className="nav-item">Home</NavLink>
                <NavLink to="/send" className="nav-item">Send Notice</NavLink>

                {(isAdmin || isManagement) && (
                    <>
                        <NavLink to="/review" className="nav-item">
                            Review
                        </NavLink>
                        <NavLink to="/review/stats" className="nav-item">
                            Stats
                        </NavLink>
                    </>
                )}

                {isAdmin && (
                    <NavLink to="/admin" className="nav-item admin">
                        Admin
                    </NavLink>
                )}
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