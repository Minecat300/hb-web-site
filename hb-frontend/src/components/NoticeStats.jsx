import { useState } from "react";

const API_URL = "https://api.helsebygg.flameys.net/api/v1";

function NoticeStats() {
    const [month, setMonth] = useState("");
    const [category, setCategory] = useState("");
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!month || !category.trim()) {
            return alert("Pick a month and category first!");
        }

        const [year, m] = month.split("-");
        setLoading(true);
        setTotal(null);

        try {
            const res = await fetch(
                `${API_URL}/notice/count?category=${encodeURIComponent(category)}&year=${year}&month=${m}`,
                { credentials: "include" }
            );

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to fetch stats");

            setTotal(data.total);

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatMonth = (value) => {
        if (!value) return "";
        const [y, m] = value.split("-");
        return new Date(y, m - 1).toLocaleString(undefined, {
            month: "long",
            year: "numeric"
        });
    };

    return (
        <div className="card stats-card">
            <h2>📊 Notice Statistics</h2>
            <p className="small">Check how many notices were created in a specific month and category.</p>

            <div className="filter-row">
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                />

                <input
                    placeholder="Category (e.g. maintenance)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <button
                    className="btn-blue"
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {loading ? "Checking..." : "Check"}
                </button>
            </div>

            {loading && (
                <div className="stats-result">
                    <span className="small">Fetching data...</span>
                </div>
            )}

            {total !== null && !loading && (
                <div className="stats-result">
                    <div className="stats-number">{total}</div>
                    <div className="stats-label">
                        {total === 1 ? "notice" : "notices"} found in
                    </div>
                    <div className="stats-meta">
                        <span className="badge">{category}</span>
                        <span className="badge">{formatMonth(month)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NoticeStats;