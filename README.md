# Portfolio

The React site and the Cloud Run chatbot have separate source roots.

| Folder | Deployment |
| --- | --- |
| `frontend/` | Vercel. Set the project Root Directory to `frontend`. |
| `backend/` | Cloud Run function. Use `backend` as the source directory and `chatbot` as the entry point. |

## Run the frontend locally

```sh
cd frontend
npm ci
npm run dev
```

Set `VITE_GCLOUD_RUN_URL` in `frontend/.env.local` to connect the local chatbot to your deployed function. Set the same variable in Vercel for deployed builds.
