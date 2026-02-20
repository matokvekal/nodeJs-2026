// Streaming responses for large files or data
import http from "node:http";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { stat } from "node:fs/promises";

const server = http.createServer(async (req, res) => {
  const { url } = req;

  // Stream a large file
    try {
      const filePath = "./package.json";
      const stats = await stat(filePath);

      // Set headers before streaming
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Content-Length": stats.size,
        "Content-Disposition": 'attachment; filename="package.json"'
      });

      // Stream file to response using pipeline
      await pipeline(createReadStream(filePath), res);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error streaming file");
    }
    return;
  }

  // Server-Sent Events (SSE) - real-time updates
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });

    // Send update every second
    let counter = 0;
    const intervalId = setInterval(() => {
      counter++;

      // SSE format: "data: message\n\n"
      res.write(
        `data: ${JSON.stringify({
          message: "Update",
          count: counter,
          time: new Date().toISOString()
        })}\n\n`
      );

      if (counter >= 10) {
        clearInterval(intervalId);
        res.end();
      }
    }, 1000);

    // Clean up on client disconnect
    req.on("close", () => {
      clearInterval(intervalId);
      console.log("Client disconnected");
    });
    return;
  }

  // Chunked response - sending data in parts
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked"
    });

    // Send data in chunks
    res.write("Chunk 1\n");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.write("Chunk 2\n");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.write("Chunk 3\n");
    res.end();
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(3000, () => {
  console.log("Server on http://localhost:3000");
  console.log("Try:");
  console.log("  http://localhost:3000/download/largefile");
  console.log("  http://localhost:3000/events");
  console.log("  http://localhost: 3000/chunked");
});