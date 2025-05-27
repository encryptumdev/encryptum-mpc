/**
 * [metamask-mcp]{@link https://github.com/Xiawpohr/metamask-mcp}
 *
 * @version 1.0.0
 * @author Xiawpohr@gmail.com
 * @license MIT
 */

import { FastMCP } from "fastmcp";
import { z } from "zod";
import { disconnect } from "@wagmi/core";
import { wagmiConfig } from "../../wagmi-config.js";

export function registerDisconnectTools(server: FastMCP): void {
  server.addTool({
    name: "disconnect",
    description: "Disconnect the metamaks wallet",
    parameters: z.object({}),
    execute: async () => {
      await disconnect(wagmiConfig);
      return {
        content: [
          {
            type: "text",
            text: "Disconnect successfully",
          },
        ],
      };
    },
  });
}
