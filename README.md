# Bluesky Sentiment Analysis Web App

A real-time sentiment analysis dashboard for Bluesky posts, built with Next.js, Base UI, and NATS streaming.

## Features

- **Real-time Post Stream**: Watch Bluesky posts flow in as they're analyzed
- **Live Sentiment Analytics**: Visual progress bars showing positive, negative, and neutral sentiment distribution
- **Beautiful UI**: Clean, modern interface built with Base UI components and Tailwind CSS
- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Architecture

This application connects to a NATS JetStream to consume sentiment-analyzed posts from the `bluesky-posts-sentiment` stream. The posts are processed by the `nats-stream-processor` microservice which performs sentiment analysis using a Twitter RoBERTa model.

### Data Flow

1. Posts are ingested from Bluesky firehose → `bluesky-posts` stream
2. Stream processor analyzes sentiment → `bluesky-posts-sentiment` stream
3. Web app subscribes to sentiment stream → displays results in real-time

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Base UI** - Unstyled, accessible React components
- **Tailwind CSS v4** - Utility-first CSS framework
- **nats** - NATS client for Node.js backend
- **TypeScript** - Type-safe JavaScript

## Getting Started

### Prerequisites

- Node.js 20+ (or use the version specified in `.node-version`)
- pnpm package manager
- NATS server with JetStream enabled (local or remote)

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your NATS configuration:

```env
# For local development with NATS
NATS_URL=nats://localhost:4222

# Stream configuration (must match processor output)
OUTPUT_STREAM=bluesky-posts-sentiment
OUTPUT_SUBJECT=bluesky.posts.sentiment
```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

The API route will connect to NATS and stream posts to the frontend using Server-Sent Events (SSE).

### Building for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
bsky-sentiment-web/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── stream/
│   │   │       └── route.ts       # SSE endpoint for NATS streaming
│   │   ├── globals.css            # Global styles and Tailwind
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Home page
│   ├── components/
│   │   ├── PostCard.tsx           # Individual post card component
│   │   ├── PostStream.tsx         # Post stream container
│   │   └── SentimentProgress.tsx  # Sentiment progress bars
│   └── types/
│       └── post.ts                # TypeScript types
├── .env.local                     # Environment variables (local)
├── .env.example                   # Environment variables (example)
├── next.config.ts                 # Next.js configuration
├── package.json                   # Dependencies
└── tailwind.config.ts             # Tailwind configuration
```

## Components

### PostStream

Connects to the `/api/stream` endpoint and manages the live feed of posts. Handles reconnection logic and maintains a rolling window of the last 50 posts.

### PostCard

Displays individual posts with:
- Author information
- Post text
- Sentiment badge (positive/negative/neutral)
- Confidence score
- Detailed probability breakdown

### SentimentProgress

Shows real-time analytics using Base UI Progress components:
- Positive sentiment (green)
- Negative sentiment (red)
- Neutral sentiment (blue)
- Total posts analyzed

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NATS_URL` | NATS server URL using nats:// protocol | `nats://localhost:4222` |
| `OUTPUT_STREAM` | JetStream stream name for sentiment results | `bluesky-posts-sentiment` |
| `OUTPUT_SUBJECT` | Subject pattern for sentiment messages | `bluesky.posts.sentiment` |

## NATS Configuration

### Local Development

For local development, you need a NATS server with JetStream enabled:

```bash
# Using Docker
docker run -p 4222:4222 -p 8222:8222 nats:latest -js

# Or using docker-compose (see project root)
docker-compose up nats
```

### Production

For production deployment on GKE:

1. Use the standard NATS protocol (nats://)
2. Set the NATS_URL to your cluster service (e.g., `nats://nats.nats.svc.cluster.local:4222`)
3. Configure proper network policies and authentication
4. Use environment variables for configuration

## API Routes

### GET /api/stream

Server-Sent Events (SSE) endpoint that streams posts from NATS using the Node.js NATS client.

**Connection**: The Next.js backend connects directly to NATS using the native protocol (nats://)

**Response**: Text/event-stream with JSON-encoded posts

**Example message**:
```json
{
  "uri": "at://did:plc:abc123/app.bsky.feed.post/xyz789",
  "cid": "bafyrei...",
  "author": {
    "did": "did:plc:abc123",
    "handle": "user.bsky.social",
    "displayName": "User Name"
  },
  "record": {
    "text": "This is a great post!",
    "createdAt": "2025-01-01T12:00:00.000Z"
  },
  "sentiment": {
    "sentiment": "positive",
    "confidence": 0.95,
    "probabilities": {
      "positive": 0.95,
      "negative": 0.02,
      "neutral": 0.03
    }
  }
}
```

## Troubleshooting

### Connection Issues

If you see "Disconnected" or "Connection lost":

1. Verify NATS server is running and accessible
2. Check `NATS_URL` in `.env.local`
3. Ensure the sentiment stream exists (created by processor)
4. Check browser console for detailed error messages

### No Posts Appearing

If connected but no posts show up:

1. Verify the `nats-stream-processor` is running
2. Check that posts are being published to the output stream
3. Verify stream and subject names match between processor and web app
4. Check NATS server logs for any errors

### TypeScript Errors

Run type checking:

```bash
pnpm tsc --noEmit
```

### Linting

```bash
pnpm lint
```

## Related Services

- **nats-firehose-ingest**: Ingests posts from Bluesky firehose
- **nats-stream-processor**: Performs sentiment analysis on posts
- **gke-cluster**: Kubernetes cluster configuration

## License

Part of the Datacenter Computing final project.

## Contributing

This is a course project. See the main project README for more information.
