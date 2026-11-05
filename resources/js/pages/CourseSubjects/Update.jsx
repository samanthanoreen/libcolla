import { Link, useForm } from "@inertiajs/react";

export default function Update({ subject, programs, prospectuses }) {
	const { data, setData, put, processing } = useForm({
		program_id: subject.program_id || "",
		prospectus_id: subject.prospectus_id || "",
		subject_code: subject.subject_code || "",
		subject_title: subject.subject_title || "",
		credit_units: subject.credit_units || 3.0,
		semester_offered: subject.semester_offered || "First",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		put(`/course-subjects/${subject.id}`);
	};

	return (
		<div
			style={{
				maxWidth: "600px",
				margin: "40px auto",
				fontFamily: "sans-serif",
			}}
		>
			<h1>Edit Subject: {subject.subject_code}</h1>
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
						onChange={(e) => setData("prospectus_id", e.target.value)}
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
						onChange={(e) => setData("subject_code", e.target.value)}
						style={{ width: "100%", padding: "8px" }}
					/>
				</div>
				<div>
					<label>Subject Title:</label>
					<input
						type="text"
						value={data.subject_title}
						onChange={(e) => setData("subject_title", e.target.value)}
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
