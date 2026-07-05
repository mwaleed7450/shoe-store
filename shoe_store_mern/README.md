# StepUp Shoes — MERN Stack (converted from PHP/MySQL)

Ye aapke original PHP shoe store ka pura MERN (MongoDB, Express, React, Node) conversion hai — customer site aur admin panel dono.

## Kya convert hua hai

| Original (PHP) | Naya (MERN) |
|---|---|
| Session-based login | JWT tokens |
| MySQL cart (session) | Client-side cart (localStorage), checkout par server-validate hota hai |
| Local `/assets/uploads` images | Cloudinary (cloud storage) |
| PHPMailer OTP | Nodemailer OTP (email verification barqarar hai) |
| MySQL tables | MongoDB collections (Mongoose models) |

## Folder Structure

```
shoe_store_mern/
  backend/     -> Node.js + Express + MongoDB API
  frontend/    -> React (Vite) app - customer site + admin panel
```

## Setup — Backend

1. `cd backend`
2. `npm install`
3. `.env.example` ko `.env` mein copy karein aur values fill karein:
   - `MONGO_URI` — Local MongoDB (`mongodb://localhost:27017/shoe_store`) ya MongoDB Atlas ka connection string, dono chalengi. Order placement transactions use nahi karta (isliye plain standalone MongoDB ke sath bhi kaam karta hai) — stock check/decrement per-item hota hai, aur agar beech mein koi item fail ho to pehle wali stock updates rollback ho jati hain.
   - `JWT_SECRET` / `ADMIN_JWT_SECRET` — koi bhi random lambi string
   - `CLOUDINARY_*` — [cloudinary.com](https://cloudinary.com) par free account bana kar Dashboard se Cloud Name, API Key, API Secret le lein
   - `SMTP_*` — Gmail App Password use karein (2FA on karke "App Passwords" se generate karein), ya koi aur SMTP provider
4. Pehla admin user + default categories banane ke liye: `npm run seed`
   - Isse `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` (jo `.env` mein set kiye) wala admin ban jayega. **Pehle login ke baad turant password change karein** (admin panel mein "Change Password" page hai).
5. Server chalayein: `npm run dev` (nodemon) ya `npm start`
   - Default: `http://localhost:5000`

## Setup — Frontend

1. `cd frontend`
2. `npm install`
3. `.env.example` ko `.env` mein copy karein, `VITE_API_URL` set karein (default `http://localhost:5000/api`)
4. `npm run dev`
   - Default: `http://localhost:5173`
5. Production build: `npm run build` (output `dist/` folder mein)

## Important Security Note

Original PHP code (`config/mailer.php`) mein Gmail credentials hardcoded thi. Naye version mein sab secrets `.env` file se aate hain aur kabhi bhi code mein commit nahi hone chahiye. `.env` ko `.gitignore` mein zaroor rakhein.

## Routes Overview

**Customer site:** `/`, `/shop`, `/product/:id`, `/cart`, `/checkout`, `/login`, `/register`, `/verify-otp`, `/account`, `/contact`, `/help`

**Admin panel:** `/admin/login`, `/admin/dashboard`, `/admin/products`, `/admin/categories`, `/admin/orders`, `/admin/messages`, `/admin/change-password`

## Notes / Next Steps

- Cart ab client-side (localStorage) hai kyunki JWT stateless hota hai — original session-based cart jaisa server pe store nahi hota, lekin order place karte waqt server har item ka price/stock dubara verify karta hai (security ke liye).
- Product images ab Cloudinary par host hoti hain — koi local `/uploads` folder ki zaroorat nahi.
- Deployment: Backend ko Render/Railway/Fly.io par, Frontend ko Vercel/Netlify par deploy kar sakte hain. MongoDB Atlas free tier database ke liye kaafi hai.
