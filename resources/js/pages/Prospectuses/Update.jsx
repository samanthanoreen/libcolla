import React from "react";
import { useForm, Link } from "@inertiajs/react";

export default function Update({ prospectus, programs }) {
    const { data, setData, put, processing, errors } = useForm({
        program_id: prospectus.program_id || "",
        title: prospectus.title || "",
        academic_year: prospectus.academic_year || "",
        description: prospectus.description || "",
        is_active: prospectus.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/prospectuses/${prospectus.id}`);
    };

    return (
        <div
            style={{
                maxWidth: "600px",
                margin: "40px auto",
                fontFamily: "sans-serif",
            }}
        >
            <h1>Edit Prospectus: {prospectus.title}</h1>
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
                        Update
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
