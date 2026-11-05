import React from "react";
import { useForm, Link } from "@inertiajs/react";

export default function Create({ programs }) {
    const { data, setData, post, processing, errors } = useForm({
        program_id: programs[0]?.id || "",
        title: "",
        academic_year: "2025-2026",
        description: "",
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/prospectuses");
    };

    return (
        <div
            style={{
                maxWidth: "600px",
                margin: "40px auto",
                fontFamily: "sans-serif",
            }}
        >
            <h1>Add Prospectus</h1>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                <div>
                    <label>Program:</label>
                    <select
                        value={data.program_id}
                        onChange={(e) => setData("program_id", e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                    >
                        {programs.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.program_code} - {p.program_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Prospectus Title:</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                    />
                    {errors.title && (
                        <span style={{ color: "red" }}>{errors.title}</span>
                    )}
                </div>
                <div>
                    <label>Academic Year:</label>
                    <input
                        type="text"
                        value={data.academic_year}
                        onChange={(e) =>
                            setData("academic_year", e.target.value)
                        }
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        type="submit"
                        disabled={processing}
                        style={{
                            padding: "8px 16px",
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Save
                    </button>
                    <Link
                        href="/prospectuses"
                        style={{
                            padding: "8px 16px",
                            background: "#e5e7eb",
                            textDecoration: "none",
                            color: "#000",
                        }}
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
