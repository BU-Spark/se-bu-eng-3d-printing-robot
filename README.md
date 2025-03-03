# SP'25 Autonomous Mechanics Challenge

## Setup Instructions

First, choose your preferred setup method:

<details>
<summary><b>Quick Setup (Using Setup Scripts)</b></summary>

Choose your operating system:

<details>
<summary><b>Windows</b></summary>

1. **Clone the repository**
   ```bash
   git clone git@github.com:BU-Spark/se-bu-eng-3d-printing-robot.git dev
   cd se-bu-eng-3d-printing-robot
   ```

2. **Run the setup script**
   ```bash
   bash.bat
   ```
   
   This script will:
   - Create and activate a Python virtual environment
   - Install all dependencies
   - Optionally start the development server

3. **Access the application**
   - Open your browser and go to [http://localhost:3000](http://localhost:3000)
</details>

<details>
<summary><b>Mac/Linux</b></summary>

1. **Clone the repository**
   ```bash
   git clone git@github.com:BU-Spark/se-bu-eng-3d-printing-robot.git dev
   cd se-bu-eng-3d-printing-robot
   ```

2. **Run the setup script**
   
   Make the script executable:
   ```bash
   chmod +x bash.sh
   ```

   Run the script:
   ```bash
   ./bash.sh
   ```
   
   This script will:
   - Create and activate a Python virtual environment
   - Install all dependencies
   - Optionally start the development server

3. **Access the application**
   - Open your browser and go to [http://localhost:3000](http://localhost:3000)
</details>
</details>

<details>
<summary><b>Manual Setup</b></summary>

Choose your operating system:

<details>
<summary><b>Windows</b></summary>

1. **Clone the repository**
   ```bash
   git clone git@github.com:BU-Spark/se-bu-eng-3d-printing-robot.git dev
   cd se-bu-eng-3d-printing-robot
   ```

2. **Create Virtual Environment**
   ```bash
   python -m venv venv
   ```

3. **Activate Virtual Environment**
   ```bash
   venv\Scripts\activate
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Configure environment variables**
   - Look at the `.env.example` file in the project
   - Create a new file named `.env` based on the example
   - Fill in the required environment variables

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Open your browser and go to [http://localhost:3000](http://localhost:3000)

8. **When finished, deactivate the virtual environment**
   ```bash
   deactivate
   ```
</details>

<details>
<summary><b>Mac/Linux</b></summary>

1. **Clone the repository**
   ```bash
   git clone git@github.com:BU-Spark/se-bu-eng-3d-printing-robot.git dev
   cd se-bu-eng-3d-printing-robot
   ```

2. **Create Virtual Environment**
   ```bash
   python3 -m venv venv
   ```

3. **Activate Virtual Environment**
   ```bash
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Configure environment variables**
   - Look at the `.env.example` file in the project
   - Create a new file named `.env` based on the example
   - Fill in the required environment variables

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Open your browser and go to [http://localhost:3000](http://localhost:3000)

8. **When finished, deactivate the virtual environment**
   ```bash
   deactivate
   ```
</details>
</details>

## Technologies

This project uses:
- **Next.js with Prisma** for the backend and database management
- **Material UI** for the frontend components and styling
- **Clerk** for authentication and user management
