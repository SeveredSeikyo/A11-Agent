# A11-Agent

A11-Agent is an AI-powered agent built with TypeScript, Elysia, and LangChain. It provides a REST API endpoint to interact with various tools such as Discord, Gmail, News, Slack, Weather, and Web Search.

## Features

- **AI Agent**: Powered by LangChain for natural language processing and tool integration.
- **Tools Integration**:
  - **Discord Tool**: Sends messages to a Discord channel via webhook.
  - **Gmail Tool**: Sends emails using Gmail with HTML content support.
  - **News Tool**: Fetches latest news articles for a topic within a specified time range.
  - **Slack Tool**: Posts plain text messages to Slack using a webhook.
  - **Weather Tool**: Retrieves current weather conditions for a specific location.
  - **Web Search Tool**: Searches the web for concise answers to questions using real-time data.
  - **Get Date Tool**: Gets the current date and time for a given timezone.
- **Database**: Uses Prisma for data management.
- **Web Framework**: Built on Elysia for fast and efficient API handling.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/A11-Agent.git
   cd A11-Agent
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required API keys and configurations (e.g., for Discord, Gmail, etc.)

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   # or
   bun run index.ts
   ```

2. The server will run on `http://localhost:3000` by default.

3. Send a POST request to `/agent` with a JSON body containing a `message`:
   ```bash
   curl -X POST http://localhost:3000/agent \
     -H "Content-Type: application/json" \
     -d '{"message": "What is the weather today?"}'
   ```

## API Endpoints

- `POST /agent`: Accepts a JSON object with a `message` field and returns the agent's response.

## Development

- Run in development mode: `npm run dev` (if available)
- Build the project: `npm run build` (if available)
- Run tests: `npm test` (if available)

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License.
