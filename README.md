<img src="https://github.com/user-attachments/assets/1584db18-254d-43ed-9b36-6b293f6b6d4b" alt="repolink logo" width="350"/>

**repol.ink** is a lightweight URL shortener tailored for GitHub repositories. It lets you generate clean, custom short links like `repol.ink/my-cool-repo` and access them quickly — perfect for sharing projects with style.

TRY IT OUT: [repol.ink](https://repol.ink)

## ✨ Features

- 🔗 Shorten GitHub repo URLs with custom aliases
- 🔍 Real-time validation and preview
- 🍪 Stores created links locally using `localStorage`
- 📋 One-click copy to clipboard
- 🎨 Animated UI with show/hide toggle for saved links
- ☁️ Hosted on [PythonAnywhere](https://www.pythonanywhere.com/) (backend)

## 🛠 Tech Stack

- **Frontend:** React + Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS (or custom CSS classes)
- **Backend:** Flask (Python) + Supabase (PostgreSQL)
- **Storage:** `localStorage` for saved links (client-side)

## 🚀 Getting Started (locally)

### 1. Clone the repo

```bash
git clone https://github.com/javud/repol.ink.git
cd repol.ink
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Backend (Flask)

### ✅ Step 1: Install Python & Virtual Environment (if not already)

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

---

### ✅ Step 2: Install dependencies

Make sure your `requirements.txt` includes these:

```txt
flask
supabase
python-dotenv
```

Then install them:

```bash
pip install -r requirements.txt
```

---

### ✅ Step 3: Create `.env` file

Inside your project folder, make a `.env` file with the following content:

```
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-anon-or-service-role-key
```

---

### ✅ Step 4: Run the Flask server
```
python flask_app.py
```
You should see something like:
```
 * Running on http://127.0.0.1:5000
```
Endpoints:

```
GET /create_link?rl_url=custom&gh_url=https://github.com/user/repo — Create a link
GET /get_link/custom — Retrieve the GitHub URL behind a short link
```

