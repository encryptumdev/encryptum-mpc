import { FastMCP } from "fastmcp";
import { z } from "zod";
import { type Address } from "viem";
import { isAddress } from "viem";
import { wagmiConfig } from "../../wagmi-config.js";
import {
  verifyMessage,
  signMessage,
  readContract,
  writeContract,
} from "@wagmi/core";
import { decrypt, encrypt } from "../../utils/encryptor.js";
import { redistClient } from "../../utils/redis/redis-client.js";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { ABI as IPFS_ABI } from "../../utils/ipfs-abi.js";
import { v4 as uuidv4 } from "uuid";

const IPFS_GATEWAY = "https://ipfs-gw.decloud.foundation"; // IPFS Web3 Authed Gateway address
const CONTRACT_ADDRESS = "0xf063A29f03d0A02FD96f270EE4F59158EF3d4860";
const PERMANENT_STORAGE = true; // false means 6 months storage

export function registerStoreMemory(server: FastMCP): void {
  server.addTool({
    name: "store-memory",
    description: `Store Memory, Save the user's memory to the Encryptum decentralized storage,
      Please tell the user to check their metamask periodically to see if any contract interaction is required.
    `,
    parameters: z.object({
      address: z
        .string()
        .describe(
          "Connected wallet address to store the memory in the Encryptum decentralized storage."
        ),
      message: z
        .string()
        .describe(
          "The memory to be stored in the Encryptum decentralized storage"
        ),
    }),
    execute: async (args): Promise<any> => {
      try {
        return await storeMemory(args);
      } catch (error) {
        throw new Error(
          `Error storing memory: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    },
  });
}

async function storeMemory(args: { message: string; address: string }) {
  const address = args.address as Address;
  const memory = args.message as string;

  // Validate the address format
  const isValidAddress = isAddress(address);

  if (!isValidAddress) {
    throw new Error(
      "Invalid wallet address format. Provide a user to connect their wallet. use 'get-connect-uri' tool to get the connect URI."
    );
  }

  const sign = await signMessage(wagmiConfig, {
    message: address,
  });

  const encryptedMemory = encrypt(memory, sign);

  const verifySignature = await verifyMessage(wagmiConfig, {
    address,
    message: address,
    signature: sign,
  });

  const decryptedMemory = decrypt(encryptedMemory, sign);

  // cached memory
  const UUID = uuidv4();
  const cachedData = await redistClient.set(
    `${address}:${UUID}`,
    JSON.stringify({
      id: UUID,
      cid: "",
      memory: encryptedMemory,
      ipfs: false,
    })
  );

  if (!cachedData) {
    throw new Error("Failed to cache the memory in Redis.");
  }

  // Store
  const authHeader = Buffer.from(`eth-${address}:${sign}`).toString("base64");

  const ipfs = create({
    url: IPFS_GATEWAY + "/api/v0",
    headers: {
      authorization: "Basic " + authHeader,
    },
  });

  // Add File to IPFS
  const ipsf = await ipfs.add(encryptedMemory);
  const fileStat = await ipfs.files.stat("/ipfs/" + ipsf.path);

  const price: any = await readContract(wagmiConfig, {
    abi: IPFS_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "getPrice",
    args: [fileStat.size, PERMANENT_STORAGE],
  });

  const placeOrder = await writeContract(wagmiConfig, {
    abi: IPFS_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "placeOrder",
    args: [ipsf.cid.toV0().toString(), fileStat.size, PERMANENT_STORAGE],
    value: price,
  });

  if (placeOrder) {
    // update cached memory with IPFS CID
    await redistClient.set(
      `${address}:${UUID}`,
      JSON.stringify({
        id: UUID,
        cid: ipsf.cid.toV0().toString(),
        memory: encryptedMemory,
        ipfs: true,
      })
    );
  }

  return {
    content: [
      {
        type: "text",
        text: `Encrypted Message: ${encryptedMemory}`,
      },
      {
        type: "text",
        text: `Decrypted Message: ${decryptedMemory}`,
      },
      {
        type: "text",
        text: `Signature Verification: ${
          verifySignature ? "Valid" : "Invalid"
        }`,
      },
      {
        type: "text",
        text: `IPFS CID: ${ipsf.cid.toV0().toString()}`,
      },
      {
        type: "text",
        text: `File Size: ${fileStat.size} bytes`,
      },
      {
        type: "text",
        text: `Transaction Hash: ${placeOrder}`,
      },
    ],
  };
}
