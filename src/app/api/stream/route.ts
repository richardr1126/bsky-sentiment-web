import {
  type ConsumerMessages,
  connect,
  DeliverPolicy,
  type JetStreamClient,
  type NatsConnection,
  StringCodec,
} from "nats";
import type { Post } from "@/types/post";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// NATS connection configuration
const NATS_URL = process.env.NATS_URL || "nats://localhost:4222";
const OUTPUT_STREAM = process.env.OUTPUT_STREAM || "bluesky-posts-enriched-dev";
const OUTPUT_SUBJECT = process.env.OUTPUT_SUBJECT || "bluesky.enriched";

export async function GET(request: Request) {
  // Get sentiment and topic filters from URL
  const { searchParams } = new URL(request.url);
  const sentimentFilter = searchParams.get("sentiment") as
    | "positive"
    | "negative"
    | "neutral"
    | null;
  const topicFilter = searchParams.get("topic");
  const encoder = new TextEncoder();
  const sc = StringCodec();

  const stream = new ReadableStream({
    async start(controller) {
      let nc: NatsConnection | undefined;
      let js: JetStreamClient;
      let messages: ConsumerMessages | undefined;

      try {
        // Connect to NATS
        console.log("Connecting to NATS at:", NATS_URL);
        nc = await connect({ servers: [NATS_URL] });
        console.log("Connected to NATS");

        // Get JetStream context
        js = nc.jetstream();
        const jsm = await nc.jetstreamManager();

        // Check if stream exists
        try {
          await jsm.streams.info(OUTPUT_STREAM);
          console.log(`Stream ${OUTPUT_STREAM} exists`);
        } catch (_error) {
          console.log(
            `Stream ${OUTPUT_STREAM} not found, it will be created by the processor`,
          );
        }

        // Create an ordered consumer that starts from new messages only
        // Ordered consumers are ephemeral and automatically cleaned up
        // This ensures each client connection sees only messages arriving after connection
        // Build filter subject based on sentiment and topic filters
        let filterSubject: string;
        if (sentimentFilter && topicFilter) {
          // Both filters: bluesky.enriched.{sentiment}.{topic}
          filterSubject = `${OUTPUT_SUBJECT}.${sentimentFilter}.${topicFilter}`;
        } else if (sentimentFilter) {
          // Only sentiment: bluesky.enriched.{sentiment}.>
          filterSubject = `${OUTPUT_SUBJECT}.${sentimentFilter}.>`;
        } else if (topicFilter) {
          // Only topic: bluesky.enriched.*.{topic}
          filterSubject = `${OUTPUT_SUBJECT}.*.${topicFilter}`;
        } else {
          // No filters: bluesky.enriched.>
          filterSubject = `${OUTPUT_SUBJECT}.>`;
        }

        console.log(
          "Creating ordered consumer for stream:",
          OUTPUT_STREAM,
          "with filter:",
          filterSubject,
        );
        const consumer = await js.consumers.get(OUTPUT_STREAM, {
          deliver_policy: DeliverPolicy.New,
          inactive_threshold: 60_000, // Clean up after 60s of inactivity
          filterSubjects: [filterSubject],
        });
        messages = await consumer.consume({
          max_messages: 100,
          expires: 30000,
        });

        console.log("Starting message processing...");

        // Process messages and send them to the client
        (async () => {
          try {
            for await (const msg of messages) {
              try {
                const data = JSON.parse(sc.decode(msg.data)) as Post;

                // Send the post data as SSE
                const sseData = `data: ${JSON.stringify(data)}\n\n`;
                controller.enqueue(encoder.encode(sseData));

                // Ordered consumers don't need manual ack

                // Send a heartbeat comment every message to keep connection alive
                controller.enqueue(encoder.encode(": heartbeat\n\n"));
              } catch (parseError) {
                console.error("Error parsing message:", parseError);
              }
            }
          } catch (error) {
            console.error("Error in message loop:", error);
          }
        })();

        // Handle client disconnect
        request.signal.addEventListener("abort", async () => {
          console.log("Client disconnected, cleaning up...");
          try {
            if (messages) {
              messages.stop();
            }
            if (nc) {
              await nc.drain();
              await nc.close();
            }
          } catch (error) {
            console.error("Error during cleanup:", error);
          }
          try {
            controller.close();
          } catch (_error) {
            // Controller already closed, ignore
            console.warn("Controller already closed");
          }
        });

        // Send initial heartbeat
        controller.enqueue(encoder.encode(": connected\n\n"));
      } catch (error) {
        console.error("Error setting up stream:", error);
        const errorMessage = `data: ${JSON.stringify({ error: "Failed to connect to NATS stream" })}\n\n`;
        controller.enqueue(encoder.encode(errorMessage));
        try {
          controller.close();
        } catch (_closeError) {
          // Controller already closed, ignore
          console.warn("Controller already closed");
        }

        if (nc) {
          try {
            await nc.drain();
            await nc.close();
          } catch (closeError) {
            console.error("Error closing connection:", closeError);
          }
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
