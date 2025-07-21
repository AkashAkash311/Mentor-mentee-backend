import { pipeline } from "@xenova/transformers";

// Load the model pipeline once and reuse
let extractor: any;

async function loadModel() {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return extractor;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = await loadModel();

  const output = await model(text, { pooling: "mean", normalize: true });
  console.log("grtedwefgrtrewftrefw", output);
  return output.data;
}
