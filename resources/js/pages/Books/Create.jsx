import { Link, useForm } from "@inertiajs/react";

export default function Create({ programs, subjects }) {
	const { data, setData, post, processing, errors } = useForm({
		program_id: programs[0]?.id || "",
		subject_id: subjects[0]?.id || "",
		title: "",
		isbn: "",
		publication_year: 2025,
		publisher: "",
		total_copies: 1,
		availability_status: "Available",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		post("/books");
	};

	return (
		<div
			style={{
				maxWidth: "600px",
				margin: "40px auto",
				fontFamily: "sans-serif",
			}}
		>
			<h1>Add Book</h1>
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
					<label>Course Subject:</label>
					<select
						value={data.subject_id}
						onChange={(e) => setData("subject_id", e.target.value)}
						style={{ width: "100%", padding: "8px" }}
					>
						{subjects.map((s) => (
							<option key={s.id} value={s.id}>
								{s.subject_code} - {s.subject_title}
							</option>
						))}
					</select>
				</div>
				<div>
					<label>Book Title:</label>
					<input
						type="text"
						value={data.title}
						onChange={(e) => setData("title", e.target.value)}
						style={{ width: "100%", padding: "8px" }}
					/>
					{errors.title && <span style={{ color: "red" }}>{errors.title}</span>}
				</div>
				<div>
					<label>ISBN:</label>
					<input
						type="text"
						value={data.isbn}
						onChange={(e) => setData("isbn", e.target.value)}
						style={{ width: "100%", padding: "8px" }}
					/>
				</div>
				<div>
					<label>Publisher:</label>
					<input
						type="text"
						value={data.publisher}
						onChange={(e) => setData("publisher", e.target.value)}
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
						href="/books"
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
