import { getAccount } from "@wagmi/core";
import { FastMCP } from "fastmcp";
import z from "zod";
import { wagmiConfig } from "../../wagmi-config.js";

export function registerConfirmStore(server: FastMCP): void {
  server.addTool({
    name: "ask-to-save-memory",
    description: `
      Ask for Memory, When a user provide any information about themselves or tell you to remember, ask the user before and saving memory. 
      This tool is used to confirm if the user wants to save their memory on the Encryptum decentralized storage,
      if the user confirms, use the "store-memory" tool to store the memory with the connected wallet address.
    `,
    parameters: z.object({
      confirmation: z.string({
        description: "User's confirmation response to save their memory.",
      }),
    }),
    execute: async (args) => {
      const { confirmation } = args as { confirmation: string };
      const account = getAccount(wagmiConfig);

      return {
        content: [
          {
            type: "text",
            text: `You provided the following memory: "${confirmation}". Do you want to save this memory? Please answer with 'yes' or 'no'.`,
          },
          {
            type: "text",
            text: `Connected wallet address: ${
              account.address ? account.address : "No wallet connected"
            }`,
          },
        ],
      };
    },
  });
}
