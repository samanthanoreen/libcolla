import { Link, useForm } from "@inertiajs/react";

export default function Update({ program }) {
	const { data, setData, put, processing, errors } = useForm({
		program_code: program.program_code || "",
		program_name: program.program_name || "",
		college: program.college || "",
		major: program.major || "",
		level: program.level || "Bachelor",
		duration: program.duration || 4,
		status: program.status || "active",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		put(`/programs/${program.id}`);
	};

	return (
		<div
			style={{
				maxWidth: "600px",
				margin: "40px auto",
				fontFamily: "sans-serif",
			}}
		>
			<h1>Edit Program: {program.program_code}</h1>
			<form
				onSubmit={handleSubmit}
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "12px",
				}}
			>
				<div>
					<label>Program Code:</label>
					<input
						type="text"
						value={data.program_code}
						onChange={(e) => setData("program_code", e.target.value)}
						style={{ width: "100%", padding: "8px" }}
					/>
					{errors.program_code && (
						<span style={{ color: "red" }}>{errors.program_code}</span>
					)}
				</div>
				<div>
					<label>Program Name:</label>
					<input
						type="text"
						value={data.program_name}
						onChange={(e) => setData("program_name", e.target.value)}
						style={{ width: "100%", padding: "8px" }}
					/>
					{errors.program_name && (
						<span style={{ color: "red" }}>{errors.program_name}</span>
					)}
				</div>
				<div>
					<label>College:</label>
					<input
						type="text"
						value={data.college}
						onChange={(e) => setData("college", e.target.value)}
						style={{ width: "100%", padding: "8px" }}
					/>
					{errors.college && (
						<span style={{ color: "red" }}>{errors.college}</span>
					)}
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
						href="/programs"
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
