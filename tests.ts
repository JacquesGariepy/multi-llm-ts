async function main() {
  try {
    const OpenAI = (await import("openai")).default;

    /**
     * Point le client OpenAI vers le serveur local de LM Studio.
     * Le apiKey peut être n'importe quelle chaîne.
     */
    const client = new OpenAI({
      baseURL: "http://localhost:1234/v1",
      apiKey: "lm-studio",
    });

    // Fonction utilitaire pour convertir en hexadécimal
    function toHex(n: number): string {
      return n.toString(16).toUpperCase();
    }

    // Appel streaming avec function calling
    const stream = await client.chat.completions.create({
      model: "qwen3-8b",
      stream: true,
      messages: [
        { role: "system", content: "Réponds toujours en hexadécimal." },
        { role: "user", content: "42 ?" },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "toHex",
            description: "Convertit un entier en hexadécimal",
            parameters: {
              type: "object",
              properties: { 
                n: { 
                  type: "integer",
                  description: "L'entier à convertir en hexadécimal"
                }
              },
              required: ["n"],
            },
          },
        },
      ],
    });

    // Variables pour accumuler les données de streaming
    let toolCallBuffer = "";
    let toolCallId = "";
    let currentToolCall: any = null;

    console.log("🤖 Réponse du modèle :");
    
    // Lecture du flux : le modèle pourra appeler la fonction toHex
    for await (const chunk of stream) {
      const choice = chunk.choices[0];
      
      if (!choice) continue;

      const delta = choice.delta;

      // Gestion du contenu textuel normal
      if (delta?.content) {
        process.stdout.write(delta.content);
      }

      // Gestion des appels de fonction
      if (delta?.tool_calls) {
        const toolCall = delta.tool_calls[0];
        
        if (toolCall) {
          // Nouvel appel de fonction
          if (toolCall.id) {
            toolCallId = toolCall.id;
            currentToolCall = {
              id: toolCall.id,
              type: 'function',
              function: {
                name: toolCall.function?.name || '',
                arguments: toolCall.function?.arguments || ''
              }
            };
            console.log(`\n🔧 Appel de fonction détecté: ${toolCall.function?.name}`);
          }
          
          // Accumulation des arguments (ils peuvent arriver en plusieurs chunks)
          if (toolCall.function?.arguments) {
            toolCallBuffer += toolCall.function.arguments;
            if (currentToolCall) {
              currentToolCall.function.arguments = toolCallBuffer;
            }
          }
        }
      }

      // Quand le choix est terminé, traiter les appels de fonction complets
      if (choice.finish_reason === 'tool_calls' && currentToolCall) {
        console.log(`\n📝 Arguments complets: ${currentToolCall.function.arguments}`);
        
        try {
          const args = JSON.parse(currentToolCall.function.arguments);
          
          if (currentToolCall.function.name === 'toHex' && typeof args.n === 'number') {
            const result = toHex(args.n);
            console.log(`\n✅ Résultat de toHex(${args.n}): ${result}`);
            
            // Dans un vrai cas d'usage, vous enverriez ce résultat de retour au modèle
            // en créant un nouveau message avec le résultat de la fonction
            console.log(`\n💡 Pour un chat complet, vous devriez maintenant envoyer ce résultat au modèle.`);
          }
        } catch (parseError) {
          console.error(`\n❌ Erreur lors du parsing des arguments:`, parseError);
        }
        
        // Reset des buffers
        toolCallBuffer = "";
        currentToolCall = null;
      }
    }
    
    console.log("\n\n✨ Streaming terminé !");

  } catch (error) {
    console.error("❌ Une erreur s'est produite:", error);
    
    // Gestion spécifique des erreurs de connexion
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.error("💡 Assurez-vous que LM Studio est lancé et qu'un modèle est chargé sur le port 1234");
      }
    }
  }
}

// Gestion propre des signaux d'interruption
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du programme...');
  process.exit(0);
});

main();