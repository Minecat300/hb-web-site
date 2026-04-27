import { useState } from "react";

const API_URL = "https://api.helsebygg.flameys.net/api/v1";

function NoticeStats() {
    const [month, setMonth] = useState("");
    const [category, setCategory] = useState("");
    const [total, setTotal] = useState(null);

    const handleSearch = async () => {
        if (!month || !category) {
            return alert("Fill all fields");
        }

        const [year, m] = month.split("-");

        try {
            const res = await fetch(
                `${API_URL}/notice/count?category=${category}&year=${year}&month=${m}`,
                { credentials: "include" }
            );

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setTotal(data.total);

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="card stats-card">
            <h2>📊 Notice Stats</h2>

            <div className="filter-row">
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                />

                <input
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <button className="btn-blue" onClick={handleSearch}>
                    Check
                </button>
            </div>

            {total !== null && (
                <div className="stats-result">
                    <span className="stats-number">{total}</span>
                    <span className="stats-label">
                        notices in {category} for {month}
                    </span>
                </div>
            )}
        </div>
    );
}

export default NoticeStats;