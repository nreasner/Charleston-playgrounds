# How to Put This Project on GitHub

Follow these steps in order.

---

## Step 1: Create a GitHub account (if you don’t have one)

1. Go to **https://github.com**
2. Click **Sign up**
3. Enter your email, password, and username
4. Verify your email if GitHub asks you to

---

## Step 2: Create a new repository on GitHub

1. Log in to GitHub
2. Click the **+** in the top-right corner
3. Click **New repository**
4. Fill in:
   - **Repository name:** `charleston-playgrounds` (or any name you like)
   - **Description:** optional, e.g. “Charleston area playgrounds and family activities”
   - Leave **Public** selected
   - **Do not** check “Add a README” or “Add .gitignore” (your project already has them)
5. Click **Create repository**

---

## Step 3: Copy the repo URL

On the new repo page you’ll see a box that says “Quick setup” and a URL like:

- **https://github.com/YOUR-USERNAME/charleston-playgrounds.git**

Copy that URL. You’ll use it in the next step.

---

## Step 4: Open the terminal and go to your project

1. In Cursor: **Terminal → New Terminal**
2. Type this and press Enter (use your real path if it’s different):

   ```
   cd "/Users/reasner/Desktop/Simon Vibe Coding Project/charleston-playgrounds"
   ```

---

## Step 5: Turn the folder into a Git repo and push to GitHub

Run these **one at a time** (press Enter after each).  
**Replace the URL** with the one you copied in Step 3.

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Initial commit: Charleston Playgrounds app"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/YOUR-USERNAME/charleston-playgrounds.git
```
*(Change YOUR-USERNAME and the repo name to match your URL.)*

```bash
git push -u origin main
```

---

## If it asks for a password

- GitHub no longer accepts account passwords for `git push`.
- You may be asked to sign in in the browser, or to use a **Personal Access Token**.
- If it says “Authentication failed,” go to: GitHub → **Settings** → **Developer settings** → **Personal access tokens** → create a token with “repo” access, then use that token as the password when Git asks.

---

## Done

After `git push` finishes, refresh your repo page on GitHub. You should see all your project files there.
