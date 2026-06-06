# Music Express

A React + Vite recreation of [musicexpress.org](http://www.musicexpress.org/) — a professional sound, lighting, video, and production services website serving Indiana and Michigan.

## Features

- Responsive layout matching the original site's look and feel
- Auto-rotating image gallery in the hero section
- Admin CMS with block-based page editor (text, HTML, images, carousels)
- Dynamic pages — add, remove, and reorder nav links from the admin
- AWS Cognito sign-in required for `/admin`
- Published content and uploads stored in the cloud (Vercel) so all visitors see admin updates

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

For full API testing locally (publish + image upload), use:

```bash
npx vercel dev
```

## Admin & Cognito Setup

1. Create an **Amazon Cognito User Pool** in the AWS Console.
2. Create an **App client** (no client secret for SPA apps).
3. Enable **email** as a sign-in option.
4. Enable **ALLOW_USER_SRP_AUTH** on the app client.
5. Copy your settings into `.env`:

```env
VITE_COGNITO_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=your_app_client_id
```

6. Create a user in the Cognito console.
7. Visit `/admin`, sign in, edit content, and click **Save Changes** to publish.

## Deploy to Vercel

1. Push the project to GitHub and import it in [Vercel](https://vercel.com).
2. Add a **Vercel Blob** store to the project (Storage tab → Create → Blob).
3. Set these **Environment Variables** in Vercel (Production + Preview):

| Variable | Value |
|---|---|
| `VITE_COGNITO_REGION` | e.g. `us-east-1` |
| `VITE_COGNITO_USER_POOL_ID` | your pool ID |
| `VITE_COGNITO_CLIENT_ID` | your app client ID |
| `COGNITO_USER_POOL_ID` | same as above (for API auth) |
| `COGNITO_CLIENT_ID` | same as above (for API auth) |
| `BLOB_READ_WRITE_TOKEN` | auto-added when Blob store is linked |

4. Deploy. The site serves published content from `/api/content` and stores uploaded images in Blob storage.

### How publishing works

- **Visitors** load content from the API when they open the site.
- **Admin** edits in `/admin`, then clicks **Save Changes** — content is saved to Vercel Blob.
- **Images** uploaded in the admin are stored in Blob and referenced by URL in the published content.

On first deploy, visitors see the default site until you sign in and publish once from admin.

## Build

```bash
npm run build
npm run preview
```
