import { useEffect, useState } from "react";

const API_URL = "https://api.helsebygg.flameys.net/api/v1";

function ReviewNotice() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotices = async () => {
        try {
            const res = await fetch(`${API_URL}/notices`, {
                credentials: "include"
            });

            const data = await res.json();
            setNotices(data || []);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const res = await fetch(`${API_URL}/notices/${id}/status`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            fetchNotices();
        } catch (err) {
            alert(err.message);
        }
    };

    const deleteNotice = async (id) => {
        const ok = confirm("Delete this notice permanently?");
        if (!ok) return;

        try {
            const res = await fetch(`${API_URL}/notices/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setNotices((prev) => prev.filter((n) => n.uuid !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) {
        return <div className="card">Loading notices...</div>;
    }

    return (
        <div className="card">
            <h2>👁 Review Notices</h2>

            <div className="notice-grid">
                {notices.map((n) => (
                    <div key={n.uuid} className="notice-item">
                        <div className="notice-header">
                            <h3>{n.title}</h3>
                            <span className={`badge status-${n.status}`}>
                                {n.status}
                            </span>
                        </div>

                        <p className="notice-desc">{n.description}</p>

                        <div className="notice-meta">
                            <span>
                                📌 {n.category} • 🕒{" "}
                                {new Date(n.created_at).toLocaleString()}
                            </span>
                        </div>

                        <div className="notice-actions">
                            <button
                                className="btn-blue"
                                onClick={() => updateStatus(n.uuid, "published")}
                            >
                                Publish
                            </button>

                            <button
                                className="btn-gray"
                                onClick={() => updateStatus(n.uuid, "draft")}
                            >
                                Draft
                            </button>

                            <button
                                className="btn-red"
                                onClick={() => updateStatus(n.uuid, "archived")}
                            >
                                Archive
                            </button>

                            <button
                                className="btn-red"
                                onClick={() => deleteNotice(n.uuid)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReviewNotice;