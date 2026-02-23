// Understanding and handling backpressure in streams

import { Writable, Readable } from "node:stream";

// Example: Fast producer, slow consumer
function createFastProducer() {
  let i = 0;

  return new Readable({
    read() {
      // Produce data quickly
      if (i < 1000) {
        this.push(`Data item ${i}\n`);
        i++;
      } else {
        this.push(null); // End stream
      }
    }
  });
}

function createSlowConsumer() {
  let processed = 0;

  return new Writable({
    write(chunk, encoding, callback) {
      processed++;

      // Simulate slow processing (100ms per item)
      setTimeout(() => {
        console.log(`Processed item ${processed}`);
        callback(); // Signal ready for next chunk
      }, 100);
    }
  });
}

// Without pipeline - can cause memory issues
function demonstrateBackpressure() {
  const producer = createFastProducer();
  const consumer = createSlowConsumer();

  // .pipe() handles backpressure automatically
  producer.pipe(consumer);

  // Producer will pause when consumer's buffer is full
  // Resumes when consumer catches up
  console.log("Streaming with backpressure handling...");
}

// With manual handling (educational)
function manualBackpressure() {
  const producer = createFastProducer();
  const consumer = createSlowConsumer();

  producer.on("data", (chunk) => {
    // write() returns false when internal buffer is full
    const canContinue = consumer.write(chunk);

    if (!canContinue) {
      console.log("Buffer full! Pausing producer...");
      producer.pause(); // Stop reading
    }
  });

  // Resume when consumer is ready
  consumer.on("drain", () => {
    console.log("Buffer drained. Resuming producer...");
    producer.resume();
  });

  producer.on("end", () => {
    consumer.end();
  });
}

demonstrateBackpressure();

// Lesson: pipeline() handles all this automatically!
// Always use pipeline() in production code