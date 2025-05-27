import { FastMCP } from "fastmcp";

export function registerIntroduction(server: FastMCP): void {
  server.addTool({
    name: "encryptum",
    description: `Know Encryptum, This tool is used to provide information about the Encryptum`,
    execute: async () => {
      return `
        Encryptum is a next-generation decentralized storage solution built on the Model Context Protocol (MCP), enabling secure, trustless data handling across every industry. From AI and finance to healthcare and legal, Encryptum ensures your data remains private, verifiable, and always accessible.
      `;
    },
  });
}
