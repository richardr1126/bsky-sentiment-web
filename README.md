# Bluesky Sentiment Analysis Web App

A real-time sentiment analysis dashboard for Bluesky posts, built with Next.js, Base UI, and NATS streaming.

## Features

- **Real-time Post Stream**: Watch Bluesky posts flow in as they're analyzed
- **Live Sentiment Analytics**: Visual progress bars showing positive, negative, and neutral sentiment distribution
- **Tab-based Sentiment Filtering**: Filter posts by sentiment type using intuitive tabs (all, positive, negative, neutral)
- **Pause/Resume Functionality**: Automatically pauses when scrolling down to read posts
- **Architecture Overview**: Interactive dialog showing the complete sentiment analysis pipeline with detailed service descriptions
- **Beautiful UI**: Clean, modern interface built with Base UI components and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Connection Status**: Real-time connection status indicator with automatic reconnection
- **Project Information**: Footer with disclaimer and attribution
- **Kubernetes Ready**: Includes Helm charts for easy deployment to Kubernetes clusters

## Architecture

This application connects to a NATS JetStream to consume sentiment-analyzed posts from the `bluesky-posts-sentiment` stream. The posts are processed by the `nats-stream-processor` microservice which performs sentiment analysis using a Twitter RoBERTa model.

### Data Flow

1. Posts are ingested from Bluesky firehose → `bluesky-posts` stream
2. Stream processor analyzes sentiment → `bluesky-posts-sentiment` stream
3. Web app subscribes to sentiment stream → displays results in real-time

## Tech Stack

- **Next.js 15** - React framework with App Router and Turbopack
- **Base UI** - Unstyled, accessible React components (v1.0.0-beta.4)
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Beautiful & consistent icon toolkit
- **nats** - NATS client for Node.js backend
- **TypeScript** - Type-safe JavaScript
- **Biome** - Code formatting and linting
- **Helm** - Kubernetes package manager for deployment
- **Docker** - Containerization for consistent deployments

## Getting Started

### Prerequisites

- Node.js 20+
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

Run the development server with Turbopack:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

The API route will connect to NATS and stream posts to the frontend using Server-Sent Events (SSE).

### Building for Production

```bash
pnpm build --turbopack
pnpm start
```

## Project Structure
### Kubernetes Deployment with Helm

The application includes Helm charts for deployment to Kubernetes clusters:

```bash
# Create secrets from environment file
cd charts
./create-secrets.sh --namespace default

# Install the chart
helm install bsky-sentiment-web ./bsky-sentiment-web --namespace default

# Upgrade the chart
helm upgrade bsky-sentiment-web ./bsky-sentiment-web --namespace default
```

For detailed Helm configuration and troubleshooting, see [charts/README.md](./charts/README.md).

```
bsky-sentiment-web/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── stream/
│   │   │       └── route.ts       # SSE endpoint for NATS streaming
│   │   ├── favicon.ico            # Site favicon
│   │   ├── globals.css            # Global styles and Tailwind
│   │   ├── layout.tsx             # Root layout with Header
│   │   └── page.tsx               # Home page with tabs and Footer component
│   ├── components/
│   │   ├── ArchitectureModal.tsx  # Architecture overview dialog
│   │   ├── Footer.tsx             # Footer component with disclaimer
│   │   ├── Header.tsx             # Header with architecture dialog trigger
│   │   ├── PostCard.tsx           # Individual post card component
│   │   ├── PostStream.tsx         # Post stream container with filtering
│   │   ├── PostStreamTabs.tsx     # Tab navigation for sentiment filtering
│   │   └── SentimentProgress.tsx  # Sentiment progress bars
│   └── types/
│       └── post.ts                # TypeScript types
├── charts/                        # Helm chart for Kubernetes deployment
│   ├── bsky-sentiment-web/        # Helm chart templates and values
│   └── create-secrets.sh          # Script to create Kubernetes secrets
├── .env.example                   # Environment variables (example)
├── .gitignore                     # Git ignore file
├── biome.json                     # Biome configuration for linting/formatting
├── Dockerfile                     # Docker configuration for containerization
├── next.config.ts                 # Next.js configuration
├── package.json                   # Dependencies
├── pnpm-lock.yaml                 # Lock file for pnpm
├── postcss.config.mjs             # PostCSS configuration
├── public/                        # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
└── tsconfig.json                  # TypeScript configuration
```

## Components

### Header

Top navigation bar with:
- Brand logo and title
- Architecture overview dialog trigger with detailed pipeline visualization
- Responsive design with gradient accents

### ArchitectureModal

Interactive dialog that displays:
- Complete system architecture overview
- Service descriptions for the entire sentiment analysis pipeline
- Visual flow diagram showing data flow from Bluesky to Dashboard
- Detailed descriptions of each microservice in the pipeline
- Responsive design for mobile and desktop

### Footer

Bottom section with:
- Disclaimer about sentiment analysis accuracy
- Project information and author attribution
- Link to GitHub repository
- Responsive layout

### PostStreamTabs

Tab navigation component that:
- Provides sentiment filtering options (all, positive, negative, neutral)
- Uses Base UI Tabs component for accessibility
- Displays icons for each sentiment type
- Responsive design with text labels on larger screens

### PostStream

Connects to the `/api/stream` endpoint and manages the live feed of posts. Features include:
- Real-time connection status indicator
- Pause/resume functionality when scrolling
- Automatic reconnection on connection loss
- Maintains a rolling window of the last 25 posts for display
- Pending post counter when paused
- Duplicate post tracking

### PostCard

Displays individual posts with:
- Author information (shortened DID)
- Post text
- Sentiment badge (positive/negative/neutral)
- Confidence score and probability breakdown
- Interactive UI elements (reply, repost, like, share buttons)
- Sorted sentiment probability pills

### SentimentProgress

Shows real-time analytics using Base UI components:
- Positive, negative, and neutral sentiment distribution
- Progress bars with percentages
- Total posts analyzed
- Most common sentiment indicator
- Tooltip with additional information

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

**Query Parameters**:
- `sentiment` (optional): Filter by sentiment type ("positive", "negative", "neutral")

**Example message**:
```json
{
  "uri": "at://did:plc:abc123/app.bsky.feed.post/xyz789",
  "cid": "bafyrei...",
  "author": "did:plc:abc123",
  "text": "This is a great post!",
  "sentiment": {
    "sentiment": "positive",
    "confidence": 0.95,
    "probabilities": {
      "positive": 0.95,
      "negative": 0.02,
      "neutral": 0.03
    }
  },
  "processed_at": 1704067200000,
  "processor": "nats-stream-processor"
}
```

## Code Quality

This project uses Biome for code formatting and linting:

```bash
# Check code quality
pnpm lint

# Format code
pnpm format

# Type checking
npx tsc --noEmit
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

## Related Services

- **nats-firehose-ingest**: Ingests posts from Bluesky firehose
- **nats-stream-processor**: Performs sentiment analysis on posts
- **gke-cluster**: Kubernetes cluster configuration
- **charts/**: Helm charts for Kubernetes deployment (see [charts/README.md](./charts/README.md))

## License

Part of the Datacenter Computing final project.

## Contributing

This is a course project. See the main project README for more information.
