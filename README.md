# Encryptum MCP

MCP is a protocol layer designed to manage, secure, and verify context-specific data interactions in decentralized environments. A Model Context Protocol (MCP) server that allows LLM to interact with the blockchain through Encryptum.

Encryptum use metamask tools, your private keys remain securely stored in your crypto wallet and are never shared with the AI agent when signing messages or sending transactions.

The **Model Context Protocol** is designed to:
- Enable **context binding** for AI agents and LLMs
- Store **verifiable, encrypted data** on decentralized storage (e.g., IPFS)
- Allow **access control and provenance** tracking via smart contracts
- Power next-gen applications in AI, legal, finance, health, and beyond

## Preview
https://github.com/user-attachments/assets/5ae9fa27-9d51-41cb-8d18-e9ad1679bb7c

## Requirements

**Node:** Node.js (v20 or higher)
**NPM:** pnpm

## Setup

Install redis on your desktop https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-redis/ 
This MCP use redis for caching IPFS file

1. Clone the repository
```
git clone https://github.com/encryptumdev/encryptum-mpc.git
cd encryptum-mcp
```

2. Install dependencies
```
pnpm install
```

3. Build the project
```
pnpm build
```

## Using with Claude Desktop

Follow the guide https://modelcontextprotocol.io/quickstart/user and add the following configuration:

```
{
  "mcpServers": {
    "encryptum": {
      "command": "node",
      "args": [
        "/PATH/TO/YOUR_PROJECT/dist/index.ts"
      ]
    }
  }
}
```

## Tools

- `call`: Executing a new message call immediately without submitting a transaction to the network.
- `get-connect-uri`: Get the connect URI to connect to a MetaMask wallet.
- `show-connect-qrcode`: Show the connect QR code for a given connect URI.
- `disconnect`: Disconnect the wallet.
- `get-account`: Get the current account.
- `get-native-currency-balance`: Get the native currency balance of an address.
- `sign-message`: Sign a message.
- `verify-message`: Verify that a message was signed by the provided address.
- `encryptum`: Provide information about the Encryptum.
- `ask-to-save-memory`: Ask the user before and saving memory.
- `store-memory`: Save the user's memory.
- `load-memory`: Load all memories stored.

## Contributing
Contributions are welcome! Please submit pull requests with any improvements or bug fixes.

## License
MIT License
