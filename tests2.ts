// npm i @lmstudio/sdk zod
// Make sure you've run: npm install @lmstudio/sdk zod
import { LMStudioClient, tool } from "@lmstudio/sdk";
import { z } from "zod";

// This file uses ES modules syntax (import/export)
// To run it: node --experimental-modules dist/tests2.js
// or with the "type": "module" in package.json: node dist/tests2.js

async function main() {
  try {
    const client = new LMStudioClient();

    /** 1. Chargement explicite (optionnel) **/
    // Try different approaches for loading the model
    try {
      // Approach 1: Pass just the model ID as a string
      await client.llm.load("qwen3-8b");
    } catch (loadError) {
      console.error("Error with simple loading, trying with options:", loadError);
      
      try {
        // Approach 2: If the SDK actually does support options, try with type assertion
        await (client.llm.load as any)({
          id: "qwen3-8b",
          quantization: "Q4_0",
          contextLength: 8192,
        });
      } catch (optionsError) {
        console.error("Error with options-based loading:", optionsError);
      }
    }

    /** 2. Définition d'un outil (function calling amélioré) **/
    const toHex = tool({
      name: "toHex",
      description: "Convertit un entier en hexadécimal",
      parameters: { n: z.number() },
      implementation: ({ n }) => n.toString(16),
    });

    /** 3. Agent : .act() boucle jusqu'au résultat final **/
    const model = await client.llm.model("qwen3-8b");
    await model.act("Convertis 42 en hexadécimal, puis dis-moi si c'est pair.", [toHex], {
      onMessage: msg => console.log(msg.toString()),          // messages complets
      onPredictionFragment: ({ content }) => process.stdout.write(content), // token-stream
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
