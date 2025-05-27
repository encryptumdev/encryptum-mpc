import "dotenv/config";
import { FastMCP } from "fastmcp";
import { registerBeEncryptumAssistantPrompt } from "./prompts/be-encryptum-assistant.js";
import { registerStoreMemory } from "./tools/encryptum/store-memory.js";
import { registerBeMetaMaskAssistantPrompt } from "./prompts/be-metamask-assistant.js";
import { registerCallTools } from "./tools/metamask/call.js";
import { registerConnectTools } from "./tools/metamask/connect.js";
import { registerGetAccountTools } from "./tools/metamask/get-account.js";
import { registerGetBalanceTools } from "./tools/metamask/get-balance.js";
import { redistClient } from "./utils/redis/redis-client.js";
import { registerIntroduction } from "./tools/encryptum/introduction.js";
import { registerConfirmStore } from "./tools/encryptum/confirm-store.js";
import { registerLoadMemory } from "./tools/encryptum/read-memory.js";
import { registerDisconnectTools } from "./tools/metamask/disconnect.js";

const server = new FastMCP({
  name: "Encryptum Decentralized Memory Assistant",
  version: "1.0.0",
});

registerBeEncryptumAssistantPrompt(server);
registerBeMetaMaskAssistantPrompt(server);

registerIntroduction(server);
registerConfirmStore(server);
registerStoreMemory(server);
registerLoadMemory(server);

registerCallTools(server);
registerConnectTools(server);
registerGetAccountTools(server);
registerGetBalanceTools(server);
registerDisconnectTools(server);

async function main() {
  try {
    await redistClient.connect();
    await server.start({
      transportType: "stdio",
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

main();
