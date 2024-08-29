# Backend API Express

This is a backend API server built with Express.js. It supports running code in different programming languages in isolated containers. The API is designed to handle multiple concurrent processes, with a focus on code execution and management.

## Setup and Running the Server

### Prerequisites

Before you begin, ensure that you have the following installed:

- **Docker**: Install Docker from [here](https://www.docker.com/get-started) if you haven't already.

### Configuration

1. **Create a `.env` file**

   In the root directory of the project, create a file named `.env` and add the following parameters:

   ```env
   MONGO_URI="your_mongodb_url"
   GOOGLE_CLIENT_ID="google_client_id"
   GOOGLE_CLIENT_SECRET="google_client_secret"
   GITHUB_CLIENT_ID="github_client_id"
   GITHUB_CLIENT_SECRET="github_client_screet"
   SESSION_SECRET="session_secret"
   MAIL_ID="mail_id"
   MAIL_PASSWORD="mail_password"
   BASE_URL=http://127.0.0.1:6969
   ORIGIN_URL=http://127.0.0.1:3000
   MAX_CONCURRENT_PROCESSES=10
   ```

   - `MONGO_URI`: The connection string for your MongoDB database.
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Credentials for Google OAuth.
   - `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: Credentials for GitHub OAuth.
   - `SESSION_SECRET`: Secret key for session management.
   - `MAIL_ID` & `MAIL_PASSWORD`: Credentials for the mail service.
   - `BASE_URL`: The base URL for your API.
   - `ORIGIN_URL`: The origin URL for CORS settings.
   - `MAX_CONCURRENT_PROCESSES`: The maximum number of concurrent processes the server can handle. This is managed using semaphores.

### Running the Server

1. **Build and Run with Docker**

   To build and run the server using Docker, execute the following command:

   ```bash
   npm run docker
   ```

   - **Note**: If you encounter an "access denied" error, you may need to run the command with `sudo`:

     ```bash
     sudo npm run docker
     ```

2. **Start the Server**

   After the Docker image is successfully built, start the server with:

   ```bash
   npm start
   ```

   - **Note**: If you used `sudo` in the previous step, you should use `sudo` here as well:

     ```bash
     sudo npm start
     ```

### How It Works

- **Concurrency Management**: The server uses semaphores to manage concurrent processes. The `MAX_CONCURRENT_PROCESSES` environment variable controls the maximum number of simultaneous processes.

- **Code Execution**: The API allows running code in different languages within isolated Docker containers. This ensures that each code execution is secure and does not interfere with others.

- **API Endpoints**: The API exposes endpoints for submitting code, managing execution, and retrieving results. Each request to run code is processed based on the current load and available resources.

### Troubleshooting

- **Access Denied Errors**: If you encounter permission issues, ensure Docker is properly installed and configured. Using `sudo` might be necessary depending on your system configuration.

- **Environment Variables**: Ensure all required environment variables are correctly set in the `.env` file. Missing or incorrect values can lead to runtime errors.
