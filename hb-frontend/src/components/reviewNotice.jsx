import { useEffect, useState } from "react";

const API_URL = "https://api.helsebygg.flameys.net/api/v1";

const CATEGORIES = [
    "Patient Injury",
    "Medication",
    "Routine Violation"
];

const MONTHS = [
    "01","02","03","04","05","06",
    "07","08","09","10","11","12"
];

function getYears() {
    const y = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => y - i);
}

function ReviewNotice({ user }) {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [category, setCategory] = useState("");

    const isAdmin = user?.roles?.includes("admin");

    /* ---------------- FETCH ---------------- */
    const fetchAll = async () => {
        setLoading(true);

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

    const fetchFiltered = async () => {
        if (!month || !year || !category) {
            return alert("Pick month, year and category");
        }

        setLoading(true);

        try {
            const res = await fetch(
                `${API_URL}/notices/filter?category=${encodeURIComponent(category)}&year=${year}&month=${month}`,
                { credentials: "include" }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setNotices(data || []);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    /* ---------------- ACTIONS ---------------- */
    const updateStatus = async (id, status) => {
        try {
            const res = await fetch(`${API_URL}/notices/${id}/status`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            fetchAll();
        } catch (err) {
            alert(err.message);
        }
    };

    const deleteNotice = async (id) => {
        if (!isAdmin) return;

        const ok = confirm("Delete this notice permanently?");
        if (!ok) return;

        try {
            const res = await fetch(`${API_URL}/notices/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setNotices(prev => prev.filter(n => n.uuid !== id));
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

            {/* FILTER UI */}
            <div className="filter-row wrap">
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    <option value="">Month</option>
                    {MONTHS.map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>

                <select value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">Year</option>
                    {getYears().map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Category</option>
                    {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                <button className="btn-blue" onClick={fetchFiltered}>
                    Filter
                </button>

                <button className="btn-gray" onClick={fetchAll}>
                    Reset
                </button>
            </div>

            {/* RESULTS */}
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
                            📌 {n.category} • 🕒{" "}
                            {new Date(n.created_at).toLocaleString()}
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

                            {isAdmin && (
                                <button
                                    className="btn-red"
                                    onClick={() => deleteNotice(n.uuid)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {notices.length === 0 && (
                <div className="small" style={{ marginTop: 12 }}>
                    No notices found.
                </div>
            )}
        </div>
    );
}

export default ReviewNotice;