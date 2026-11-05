import React from "react";
import { useForm, Link } from "@inertiajs/react";

export default function Create({ programs, prospectuses }) {
    const { data, setData, post, processing, errors } = useForm({
        program_id: programs[0]?.id || "",
        prospectus_id: prospectuses[0]?.id || "",
        subject_code: "",
        subject_title: "",
        credit_units: 3.0,
        semester_offered: "First",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/course-subjects");
    };

    return (
        <div
            style={{
                maxWidth: "600px",
                margin: "40px auto",
                fontFamily: "sans-serif",
            }}
        >
            <h1>Add Course Subject</h1>
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
                                {p.program_code}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Prospectus:</label>
                    <select
                        value={data.prospectus_id}
                        onChange={(e) =>
                            setData("prospectus_id", e.target.value)
                        }
                        style={{ width: "100%", padding: "8px" }}
                    >
                        {prospectuses.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Subject Code:</label>
                    <input
                        type="text"
                        value={data.subject_code}
                        onChange={(e) =>
                            setData("subject_code", e.target.value)
                        }
                        style={{ width: "100%", padding: "8px" }}
                    />
                    {errors.subject_code && (
                        <span style={{ color: "red" }}>
                            {errors.subject_code}
                        </span>
                    )}
                </div>
                <div>
                    <label>Subject Title:</label>
                    <input
                        type="text"
                        value={data.subject_title}
                        onChange={(e) =>
                            setData("subject_title", e.target.value)
                        }
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div>
                    <label>Credit Units:</label>
                    <input
                        type="number"
                        step="0.5"
                        value={data.credit_units}
                        onChange={(e) =>
                            setData("credit_units", e.target.value)
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
                        href="/course-subjects"
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
