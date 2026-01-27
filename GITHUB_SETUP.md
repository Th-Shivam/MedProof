# How to Push MedProof to GitHub 🚀

Your project is clean, secure, and ready.

## Step 1: Safety Check
I have already added `.gitignore` to block your private keys.
**Double check:** Ensure `backend/.env` and `frontend/.env` are greyed out in VS Code (meaning they are ignored).

## Step 2: Initialize Git (Run inside `d:\MedProof`)
Open your terminal (Ctrl+`):
```bash
git init
git add .
git commit -m "Initial commit: MedProof Beta Release"
```

## Step 3: Create Repo on GitHub
1.  Go to [github.com/new](https://github.com/new).
2.  Repository Name: `MedProof`.
3.  Description: "Decentralized Pharmaceutical Integrity System (TH05 Hackathon)".
4.  Public/Private: **Public** (for Hackathon visibility).
5.  **Do NOT** initialize with README/gitignore (we already have them).
6.  Click **Create Repository**.

## Step 4: Connect & Push
Copy the commands from GitHub (under "…or push an existing repository from the command line") and run them:

```bash
git remote add origin https://github.com/YOUR_USERNAME/MedProof.git
git branch -M main
git push -u origin main
```

## Step 5: Verify
Refresh your GitHub page. You should see your code, but **NOT** your `.env` files. If you see `.env`, **DELETE THE REPO IMMEDIATELY** and ask me for help.
