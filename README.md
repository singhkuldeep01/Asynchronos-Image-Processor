# Asynchronous Image Processor

This project has two parts:

- `client`: React + Vite frontend
- `server`: Express + Prisma + BullMQ backend

The backend accepts an uploaded image, stores it in MySQL, saves the original file on disk, pushes a BullMQ job into Redis, processes the image with Sharp in a worker, stores processed variants on disk again, and emits real-time progress through Socket.IO.

## Repository Setup

If you already have the project folder locally and want to connect it to the remote repository, use:

```bash
git remote add origin https://github.com/singhkuldeep01/Asynchrnous-Image-Processor.git
```

If you are cloning from scratch, clone the repo first and then move into the project folder.

## Install Dependencies

Install dependencies separately for both apps:

```bash
cd client
npm i

cd ../server
npm i
```

## Environment Files

Use the sample env files as a reference:

- [client/.sample.env](client/.sample.env)
- [server/.sample.env](server/.sample.env)

Copy them to `.env` in the same folder and update the values.

### Frontend Env

Frontend only needs the backend API URL:

```env
VITE_BACKEND_URL="http://localhost:3000/api/v1"
```

### Backend Env

Backend needs the MySQL connection string:

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/ImageDB"
```

## Required Services

### 1. MySQL

Create a MySQL database named:

```bash
ImageDB
```

### 2. Redis

BullMQ uses Redis on the default port:

```bash
redis://127.0.0.1:6379
```

Make sure Redis is running before starting the worker.

## Prisma Generate

This project uses Prisma and stores the generated client in the custom folder configured in `prisma.config.js`.

Run this from the `server` folder after setting the environment variables:

```bash
npx prisma generate
```

This creates the generated Prisma client folder used by the backend code.

## Available Scripts

From the `server` folder:

```bash
npm run start
npm run worker
```

From the `client` folder:

```bash
npm run dev
```

## Backend Flow

1. Client uploads an image to `POST /api/v1/image/upload`.
2. Multer saves the original file to the `uploads/` folder.
3. The file metadata and original path are stored in MySQL with status `PENDING`.
4. A BullMQ job is created and pushed to Redis.
5. The worker picks up the job using the `imageId`.
6. The worker updates the database status to `PROCESSING`.
7. Sharp runs resize and conversion tasks.
8. Processed variants are written to the `processed/` folder.
9. Queue events update the job progress.
10. When processing finishes, the database is updated to `COMPLETED` and all processed file paths are stored.
11. Socket.IO emits live progress updates and the final processed image paths to the client.
12. The browser loads the files directly using static serving from `/api/v1/uploads` and `/api/v1/processed`.

## Flow Chart

```mermaid
flowchart TD
  A[Client uploads image] --> B[POST /api/v1/image/upload]
  B --> C[Multer saves original file to uploads/]
  C --> D[Store image record in MySQL as PENDING]
  D --> E[Create BullMQ job in Redis]
  E --> F[Worker picks up imageId]
  F --> G[Update DB status to PROCESSING]
  G --> H[Sharp resize and conversion]
  H --> I[Save processed files to processed/]
  I --> J[Queue events emit job progress]
  J --> K[Socket.IO emits real-time progress]
  I --> L[Update DB status to COMPLETED]
  L --> M[Store processed file paths in DB]
  M --> N[Socket.IO emits final image paths]
  N --> O[Client renders variants from static file URLs]
```

## Main Technologies

- Express
- Prisma
- MySQL
- Redis
- BullMQ
- Sharp
- Multer
- Socket.IO
- Node-cron
- React + Vite

## Notes

- Original uploads are saved to disk first.
- Processed outputs are saved to disk in a separate `processed/` folder.
- The UI uses real-time socket events to show progress and final results.
- Static serving is configured so the browser can open processed files directly.

