# StepUp Shoes — MERN Stack

Ye ek shoe store ka pura MERN (MongoDB, Express, React, Node) project hai — customer site aur admin panel dono.

## Features

- JWT based login (customer aur admin dono ke liye alag)
- Client-side cart (localStorage); order place karte waqt server har item ka price/stock dubara verify karta hai
- Product images Cloudinary par host hoti hain
- Email OTP verification (Nodemailer)
- MongoDB collections (Mongoose models)

## Folder Structure

```
shoe_store_mern/
  backend/     -> Node.js + Express + MongoDB API
  frontend/    -> React (Vite) app - customer site + admin panel
```

> **Note:** Root folder mein `package.json` nahi hai. Backend aur frontend dono ko apne apne folder ke andar se chalana hai (neeche dekhein).

## Requirements

- Node.js (v18 ya naya)
- MongoDB Community Server (local) **ya** MongoDB Atlas account
- Cloudinary account (free) aur SMTP credentials (Gmail App Password)

## Setup — Backend

1. `cd backend`
2. `npm install`
3. `.env.example` ko `.env` mein copy karein: `cp .env.example .env`, phir values fill karein:
   - `MONGO_URI` — **Local MongoDB (development ke liye):**
```
     MONGO_URI=mongodb://127.0.0.1:27017/shoestore
```
     `localhost` ki jagah `127.0.0.1` use karein, kyunke naye Node versions mein `localhost` kabhi kabhi IPv6 par resolve ho kar connection fail kar deta hai.
     Ya MongoDB Atlas ka `mongodb+srv://...` connection string bhi chalega. Order placement transactions use nahi karta, isliye plain standalone MongoDB ke sath bhi kaam karta hai.
   - `JWT_SECRET` / `ADMIN_JWT_SECRET` — koi bhi random lambi string
   - `CLOUDINARY_*` — [cloudinary.com](https://cloudinary.com) par free account bana kar Dashboard se Cloud Name, API Key, API Secret le lein
   - `SMTP_*` — Gmail App Password use karein (2FA on karke "App Passwords" se generate karein), ya koi aur SMTP provider
4. Local MongoDB chal raha hai ya nahi check karein: terminal mein `mongosh` likhein. Agar connect ho jaye to theek hai, warna `services.msc` se "MongoDB Server" service start karein.
5. Pehla admin user + default categories banane ke liye: `npm run seed`
   - Isse `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` (jo `.env` mein set kiye) wala admin ban jayega. **Pehle login ke baad turant password change karein** (admin panel mein "Change Password" page hai).
6. Server chalayein: `npm run dev` (nodemon) ya `npm start`
   - Default: `http://localhost:5000`
   - Kamyabi par ye dikhna chahiye: `Server running on port 5000` aur `MongoDB connected`

## Setup — Frontend

1. Naya terminal kholein (backend wala chalta rehne dein)
2. `cd frontend`
3. `npm install`
4. `.env.example` ko `.env` mein copy karein, `VITE_API_URL` set karein (default `http://localhost:5000/api`)
5. `npm run dev`
   - Default: `http://localhost:5173`
6. Production build: `npm run build` (output `dist/` folder mein)

## Troubleshooting

| Error | Wajah aur hal |
|---|---|
| `npm error Missing script: "dev"` | Aap root folder se command chala rahe hain. Pehle `cd backend` ya `cd frontend` karein. |
| `MongoDB connection failed: querySrv ECONNREFUSED ...mongodb.net` | `.env` mein purana/galat Atlas address hai. `MONGO_URI` ko local URI (`mongodb://127.0.0.1:27017/shoestore`) se badlein, **Ctrl + S** se save karein, aur nodemon mein `rs` likh kar restart karein. |
| `.env` badalne ke baad bhi purana error | `.env` save nahi hui, ya variable ka naam `MONGO_URI` nahi hai. Connection `backend/src/config/db.js` mein hai aur wo `process.env.MONGO_URI` padhti hai. |
| `ECONNREFUSED 127.0.0.1:27017` | Local MongoDB service band hai. `services.msc` se "MongoDB Server" start karein. |
| `[nodemon] app crashed - waiting for file changes` | Pehle error fix karein, phir usi terminal mein `rs` likh kar Enter dabayein. |

## Important Security Note

Saare secrets (SMTP credentials, JWT secrets, Cloudinary keys, database URI) `.env` file se aate hain aur kabhi bhi code mein hardcode ya git mein commit nahi hone chahiye. `.env` ko `.gitignore` mein zaroor rakhein.

## Routes Overview

**Customer site:** `/`, `/shop`, `/product/:id`, `/cart`, `/checkout`, `/login`, `/register`, `/verify-otp`, `/account`, `/contact`, `/help`

**Admin panel:** `/admin/login`, `/admin/dashboard`, `/admin/products`, `/admin/categories`, `/admin/orders`, `/admin/messages`, `/admin/change-password`

## Notes

- Cart client-side (localStorage) hai kyunke JWT stateless hota hai. Order place karte waqt server har item ka price aur stock dubara verify karta hai (security ke liye).
- Product images Cloudinary par host hoti hain, koi local `/uploads` folder ki zaroorat nahi.
- Deployment: Backend ko Render/Railway/Fly.io par, Frontend ko Vercel/Netlify par deploy kar sakte hain. Production mein MongoDB Atlas free tier use karein (local MongoDB sirf development ke liye hai).