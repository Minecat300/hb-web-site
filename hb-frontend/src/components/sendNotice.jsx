import { useState } from "react";

const API_URL = "https://api.helsebygg.flameys.net/api/v1";

function SendNotice() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        topic: "",
        status: "draft"
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/notices`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed");

            alert("Notice created!");

            setForm({
                title: "",
                description: "",
                topic: "",
                status: "draft"
            });

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card notice-card">
            <h2>📢 Send Notice</h2>

            <form onSubmit={handleSubmit} className="notice-form">
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                />

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows={4}
                    required
                />

                <input
                    name="topic"
                    value={form.topic}
                    onChange={handleChange}
                    placeholder="Topic (e.g. maintenance, alert)"
                />

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                </select>

                <button
                    className="btn-blue full"
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Create Notice"}
                </button>
            </form>
        </div>
    );
}

export default SendNotice;