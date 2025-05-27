/**
 * [metamask-mcp]{@link https://github.com/Xiawpohr/metamask-mcp}
 *
 * @version 1.0.0
 * @author Xiawpohr@gmail.com
 * @license MIT
 */

import { FastMCP } from "fastmcp";
import { z } from "zod";
import { getAccount } from "@wagmi/core";
import { JSONStringify } from "../../utils/json-stringify.js";
import { wagmiConfig } from "../../wagmi-config.js";

export function registerGetAccountTools(server: FastMCP): void {
  server.addTool({
    name: "get-account",
    description:
      "Get current account on the connected wallet, you can use this tool to get the current account address, chainId and status.",
    parameters: z.object({}),
    execute: async () => {
      const result = getAccount(wagmiConfig);
      return {
        content: [
          {
            type: "text",
            text: JSONStringify({
              address: result.address,
              addresses: result.addresses,
              chainId: result.chainId,
              status: result.status,
            }),
          },
        ],
      };
    },
  });
}
