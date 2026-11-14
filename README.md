# LibColla — Library Collection Assessment System

LibColla is a web-based Library Collection Assessment and Accreditation Management System built with Laravel, Inertia.js, and React.

## 🚀 Getting Started on a Team Member's Laptop

Follow these simple steps after cloning or pulling the repository:

### 1. Pull Latest Code & Database
```bash
git pull origin jaele
```
*(The repository already includes the pre-configured SQLite database at `database/database.sqlite` with all users, programs, curricula, and books).*

### 2. Environment Setup
Make sure your `.env` file exists and has an `APP_KEY`:
```bash
# If .env does not exist yet:
cp .env.example .env
php artisan key:generate
```

### 3. Install & Build Frontend Assets
```bash
npm install
npm run build
```

### 4. Run the Development Server
```bash
php artisan serve
```
Open **[http://127.0.0.1:8000](http://127.0.0.1:8000)** in your web browser.

---

## 🔑 Default Login Credentials

| Role | Username / Email | Password | Access / Features |
| :--- | :--- | :--- | :--- |
| **Librarian (Admin)** | `samanacele` or `samana@gmail.com` | `samana123` | Full Access (Assessment Reports, Manage Users, Catalog, Support) |
| **Staff / Assistant** | `jelly` or `jaelbohol@gmail.com` | `samana123` | Book Management, Program Assessment |

---

## 🛠️ Database Reset (Optional)
If you ever need to reset or refresh your database to initial state:
```bash
php artisan migrate:fresh --seed
```
This automatically restores all default users, BSIT-BTM 53 subjects, reference books, and sample reports.
