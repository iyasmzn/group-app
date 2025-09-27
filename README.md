# 🚀 Next.js Project

This project is built with [Next.js](https://nextjs.org) and bootstrapped using [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## 📦 Getting Started

Run the development server:

    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev

Then, open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## ✏️ Development Notes

- You can start editing the main page at **`app/page.tsx`**.  
- The page auto-updates as you edit the file.  
- This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family from Vercel.

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) — explore features and APIs.  
- [Interactive Next.js Tutorial](https://nextjs.org/learn) — step-by-step guide to learn Next.js.  
- [Next.js GitHub Repository](https://github.com/vercel/next.js) — contribute and give feedback.  

---

## 🚀 Deployment

The easiest way to deploy your Next.js app is with [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), the creators of Next.js.

See the [deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🖥️ Running Dev Server with WSL2

If you’re using **WSL2** and want to access your dev server from another device on the same network:

1. Run `ipconfig` in PowerShell and check the **WSL2 IP**.
2. Add a port proxy rule (replace `172.27.176.1` with your WSL2 IP):

    # Add proxy rule
    netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=3000 connectaddress=172.27.176.1 connectport=3000

    # Show existing rules
    netsh interface portproxy show all

    # Delete proxy rule
    netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=3000

Now, you can access your dev server from another device using `http://<your-windows-ip>:3000`.

---