import { Link, useForm } from "@inertiajs/react";

export default function Update({ book, programs, subjects }) {
	const { data, setData, put, processing } = useForm({
		program_id: book.program_id || "",
		subject_id: book.subject_id || "",
		title: book.title || "",
		isbn: book.isbn || "",
		publication_year: book.publication_year || 2025,
		publisher: book.publisher || "",
		total_copies: book.total_copies || 1,
		availability_status: book.availability_status || "Available",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		put(`/books/${book.id}`);
	};

	return (
		<div
			style={{
				maxWidth: "600px",
				margin: "40px auto",
				fontFamily: "sans-serif",
			}}
		>
			<h1>Edit Book: {book.title}</h1>
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
						Update
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
