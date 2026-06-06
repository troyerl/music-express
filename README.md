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

## Contact form email

When a visitor submits a contact form, the site sends an email in the background. No mail app opens on the visitor's device.

### Free setup (recommended) — Web3Forms

[Web3Forms](https://web3forms.com) is free (250 submissions/month), requires no credit card, and takes about 2 minutes:

1. Go to [web3forms.com](https://web3forms.com) and create a free account using **musicexpress@maplenet.net** (or whichever inbox should receive submissions).
2. Copy your **Access Key**.
3. Add it to your local `.env` and to Vercel → **Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `VITE_WEB3FORMS_ACCESS_KEY` | your access key from Web3Forms |

4. Restart the dev server (`npm run dev`) or redeploy on Vercel.

Submissions go to the email you used when signing up for Web3Forms. The access key is included in the site bundle (Web3Forms is designed for this); you can restrict allowed domains in the Web3Forms dashboard.

In admin, **Send submissions to email** can stay set to your inbox for reference. Web3Forms delivers to the email on your Web3Forms account.

### Other options

**Resend** — free tier (3,000 emails/month): set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL`.

**SMTP** — use your existing email login: set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, and `CONTACT_FROM_EMAIL`.

**Formspree** — free tier (50/month): paste your Formspree form URL in the admin form block under **Form service URL (optional)** instead of using the options above.

## Build

```bash
npm run build
npm run preview
```
