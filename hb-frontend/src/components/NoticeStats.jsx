import { useState } from "react";

const API_URL = "https://api.helsebygg.flameys.net/api/v1";

const CATEGORIES = [
    "Patient Injury",
    "Medication",
    "Routine Violation"
];

const MONTHS = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
];

function getYearOptions() {
    const current = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => current - i);
}

function NoticeStats() {
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [category, setCategory] = useState("");
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!month || !year || !category) {
            return alert("Pick month, year, and category!");
        }

        setLoading(true);
        setTotal(null);

        try {
            const res = await fetch(
                `${API_URL}/notices/count?category=${encodeURIComponent(category)}&year=${year}&month=${month}`,
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

    const selectedMonthLabel = MONTHS.find(m => m.value === month)?.label;

    return (
        <div className="card stats-card">
            <h2>📊 Notice Statistics</h2>
            <p className="small">
                Get a quick overview of notices by category and time.
            </p>

            <div className="filter-row">
                {/* Month */}
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    <option value="">Month</option>
                    {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                            {m.label}
                        </option>
                    ))}
                </select>

                {/* Year */}
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">Year</option>
                    {getYearOptions().map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>

                {/* Category */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Category</option>
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

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
                    <span className="small">Crunching numbers...</span>
                </div>
            )}

            {total !== null && !loading && (
                <div className="stats-result">
                    <div className="stats-number">{total}</div>
                    <div className="stats-label">
                        {total === 1 ? "notice" : "notices"} found
                    </div>

                    <div className="stats-meta">
                        <span className="badge">{category}</span>
                        <span className="badge">
                            {selectedMonthLabel} {year}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NoticeStats;