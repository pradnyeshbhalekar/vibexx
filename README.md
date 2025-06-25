![VIBEXX](https://github.com/user-attachments/assets/4eb2f7be-053e-4479-9e88-6ecfa9a4de1b)

# **VIBEXX - Spotify playlist generator based on your mood.**

This is the frontend of the **VIBEXX** project, a web interface to create personalized playlist for user according to their taste and vibe. 

## **Featues:**

- **Spotify OAuth Login**:
  Seamless authentication using Spotify's login system.
 
- **Mood-Based Selection UI**  
  Uses Webcam to choose  mood options like Happy, Sad, Energetic, Chill, etc.

- **Dynamic Playlist Generation**  
  Displays playlists fetched from the backend in real time based on selected mood.

- **Responsive Design**  
  Mobile-first and adaptive layout built with Tailwind CSS.



## **Tech Stack**
- **NextJs**
- **Tailwind Css**
- **Axios**
- **Spotify Web Api** (for backend)


## **Create a .env file in the root directory and add:**
```bash
VITE_BACKEND_URL=http://localhost:5000
```

# **Future Improvements:**
- More mood options
- Add dark/light theme toggle




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

**To Start with the dependency**

```bash
npm install
# or
yarn install
# or
bun install

```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
