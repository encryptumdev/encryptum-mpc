import { FastMCP } from "fastmcp";
import { z } from "zod";
import { isAddress } from "viem";
import { type Address } from "viem";
import { signMessage } from "@wagmi/core";
import { wagmiConfig } from "../../wagmi-config.js";
import { encrypt } from "../../utils/encryptor.js";

export function registerEncryptMemory(server: FastMCP): void {
  server.addTool({
    name: "encrypt-memory",
    description: `Encrypt Memory, Use this tool to sign and encrypt a memory before storing it in 'store-memory'. The memory will be encrypted with user private key, ensuring that only you can access it.`,
    parameters: z.object({
      address: z.string({
        description: "Connected wallet address to sign the memory.",
      }),
      memory: z.string({
        description: "The memory to be signed and encrypted.",
      }),
    }),
    execute: async (args) => {
      const address = args.address as Address;

      // Validate the address format
      const isValidAddress = isAddress(address);

      if (!isValidAddress) {
        throw new Error(
          "Invalid wallet address format. Provide a user to connect their wallet. use 'get-connect-uri' tool to get the connect URI."
        );
      }

      const memory = args.memory;

      const sign = await signMessage(wagmiConfig, {
        message: address,
      });

      const encryptedMemory = encrypt(memory, sign);

      return {
        content: [
          {
            type: "text",
            text: `Memory encrypted successfully. Here is the encrypted memory: ${encryptedMemory}. signature: ${sign}`,
          },
          {
            type: "text",
            text: `You can now store this encrypted memory securely. Use the 'store-memory' tool to save it in the Encryptum decentralized storage.`,
          },
        ],
      };
    },
  });
}

// Ask the user before use this tool,
