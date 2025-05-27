import { signMessage } from "@wagmi/core";
import { FastMCP } from "fastmcp";
import z from "zod";
import { wagmiConfig } from "../../wagmi-config.js";
import { isAddress } from "viem";
import { redistClient } from "../../utils/redis/redis-client.js";
import { decrypt } from "../../utils/encryptor.js";

export function registerLoadMemory(server: FastMCP): void {
  server.addTool({
    name: "load-memory",
    description: `
        Load All Memory, When a user ask any information about themselves but you don't have any information about them,
        use this tool to load all memories stored from the Encryptum decentralized storage.
    `,
    parameters: z.object({
      address: z.string({
        description:
          "Connected wallet address to read the memory from the Encryptum decentralized storage.",
      }),
    }),
    execute: async (args): Promise<any> => {
      const address = args.address as string;

      // Validate the address format
      const isValidAddress = isAddress(address);

      if (!isValidAddress) {
        throw new Error(
          "Invalid wallet address format. Provide a user to connect their wallet. use 'get-connect-uri' tool to get the connect URI."
        );
      }

      const encryptedMemories = [];
      const keys = await redistClient.keys(`*${address}*`);
      const cached = await redistClient.mGet(keys);

      for (let i = 0; i < cached.length; i++) {
        try {
          const element = JSON.parse(cached[i]!);
          encryptedMemories.push(element.memory);
        } catch (error) {}
      }

      const decryptedMemories = [];

      if (encryptedMemories.length > 0) {
        const sign = await signMessage(wagmiConfig, {
          message: address,
        });

        if (sign) {
          for (const memory of encryptedMemories) {
            const decrypted = decrypt(memory, sign);
            decryptedMemories.push(decrypted);
          }
        } else {
          throw new Error(
            "Failed to sign the message. Please sign in your wallet."
          );
        }
      }

      return {
        content: [
          ...decryptedMemories.map((memory, index) => ({
            type: "text",
            text: `Memory ${index + 1}: ${memory}`,
          })),
        ],
      };
    },
  });
}
