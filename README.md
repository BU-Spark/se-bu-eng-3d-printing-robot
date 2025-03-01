# SP'25 Autonomous Mechanics Challenge

## Setup Instructions

You can set up this project either manually or by using our setup script.

<details>
<summary><b>Quick Setup (Using Bash Script)</b></summary>

1. **Clone the repository**
   ```bash
   git clone git@github.com:BU-Spark/se-bu-eng-3d-printing-robot.git dev
   ```

2. **Navigate to the project directory**
   ```bash
   cd se-bu-eng-3d-printing-robot
   ```

3. **Run the setup script**
   <details>
   <summary><b>Windows</b></summary>
   
   ```bash
   ./bash
   ```
   </details>

   <details>
   <summary><b>Mac/Linux</b></summary>
   
   Make the script executable:
   ```bash
   chmod +x bash
   ```

   Run the script:
   ```bash
   ./bash
   ```
   </details>
   
   This script will:
   - Create and activate a virtual environment
   - Install all dependencies
   - Set up environment variables
   - Start the development server

4. **Access the application**
   - Open your browser and go to [http://localhost:3000](http://localhost:3000)
</details>

<details>
<summary><b>Manual Setup</b></summary>

1. **Clone the repository and navigate to dev branch**
   ```bash
   git clone git@github.com:BU-Spark/se-bu-eng-3d-printing-robot.git
   git checkout dev
   ```

2. **Navigate to the project directory**
   ```bash
   cd se-bu-eng-3d-printing-robot
   ```

3. **Create Virtual Environment**
   <details>
   <summary><b>Windows</b></summary>
   
   To create:
   ```bash
   python -m venv venv
   ```
   To activate:
   ```bash
   venv\Scripts\activate
   ```
   To close:
   ```bash
   deactivate
   ```
   </details>

   <details>
   <summary><b>Mac/Linux</b></summary>
   
   To create:
   ```bash
   python3 -m venv venv
   ```
   To activate:
   ```bash
   source venv/bin/activate
   ```
   To close:
   ```bash
   deactivate
   ```
   </details>

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
</details>

## Technologies

This project uses:
- **Next.js with Prisma** for the backend and database management
- **Material UI** for the frontend components and styling
- **Clerk** for authentication and user management
