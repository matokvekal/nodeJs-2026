// for await...of allows iterating over async data sources

// Example 1: Async generator function
async function* generateNumbers() {
  for (let i = 1; i <= 5; i++) {
    // Simulate async operation (e.g., fetching from API)
    await new Promise((resolve) => setTimeout(resolve, 500));
    yield i; // Yield value asynchronously
  }
}

async function processAsyncGenerator() {
  console.log("Processing async generator...");

  // for await...of automatically waits for each Promise
  for await (const num of generateNumbers()) {
    console.log("Received number:", num);
  }

  console.log("Generator complete!");
}

// Example 2: Reading large file in chunks
async function processLargeFile() {
  const { open } = await import("node:fs/promises");

  const fileHandle = await open("./package.json", "r");

  try {
    let chunkNumber = 0;

    // Read file chunk by chunk using async iteration
    for await (const chunk of fileHandle.readableWebStream()) {
      chunkNumber++;
      console.log(`Chunk ${chunkNumber}: ${chunk.length} bytes`);
      // Process chunk here
    }

    console.log(`Processed ${chunkNumber} chunks`);
  } finally {
    await fileHandle.close();
  }
}

// Example 3: Async iteration over array of Promises
async function processMultipleUrls() {
  const urls = [
    "https://jsonplaceholder.typicode.com/posts/1",
    "https://jsonplaceholder.typicode.com/posts/2",
    "https://jsonplaceholder.typicode.com/posts/3"
  ];

  // Create async iterable from array
  async function* fetchUrls(urls) {
    for (const url of urls) {
      yield fetch(url).then((r) => r.json());
    }
  }

  // Process one at a time
  for await (const post of fetchUrls(urls)) {
    console.log("Post title:", post.title);
  }
}

processAsyncGenerator();
// processLargeFile();
processMultipleUrls();