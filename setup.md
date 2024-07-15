# Project Setup Instructions

Follow these steps to set up and run this React project.

## 1. Clone the Repositories

First, clone the client and server repositories from GitHub.

```bash
# Clone the client repository
git clone https://github.com/therealboyi/e-Sharevice.git

# Clone the server repository
git clone https://github.com/therealboyi/e-Sharevice-backend.git
```

## 2. Install Dependencies

Navigate to the directories of the client and server and install the necessary dependencies using npm install.

```bash
# Navigate to the client directory and install dependencies
cd /path/to/client-repo
npm install

# Navigate to the server directory and install dependencies
cd /path/to/server-repo
npm install
```

## 3. Set Up Environment Variables

Create a .env file in the root of the client and server directory and add the necessary environment variables for API and MySQL database and any other required configuration.

```bash
# Navigate to the client directory and create .env
VITE_API_URL=http://localhost:8080

# Navigate to the server directory and create .env
PORT=8080
DB_HOST=localhost
DB_NAME=e_sharevice_db
DB_USER=root
DB_PASSWORD=rootroot
JWT_SECRET=<JWT_SECRET_KEY>

# To generate a secret key you can run this line of code in the Terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
```

## 4. Configure and Seed the MySQL Database

Ensure you have MySQL installed and running. Then, use Knex to migrate and seed your server database.

```bash
# Navigate to the server directory if not already there
cd /path/to/server-repo

# Run migrations to set up the database schema
npx knex migrate:latest

# Seed the database with initial data
npx knex seed:run
```

## 5. Run the Development Servers

Start the development servers for both the client and server.

```bash
# Start the client development server
cd /path/to/client-repo
npm run dev

# In a new terminal, navigate to the server directory and start the server
cd /path/to/server-repo
npm run dev
```

## 6. Access the Application

Open your browser and navigate to the appropriate URL to access your application. Typically, this would be:

- Client: http://localhost:5173
- Server: http://localhost:8080

## Additional Notes

- Ensure your MySQL server is running and accessible with the credentials provided in the .env file.
- Modify any other environment variables and configuration settings as needed for your specific setup.
- If you encounter any issues, check the logs for detailed error messages and troubleshoot accordingly.
