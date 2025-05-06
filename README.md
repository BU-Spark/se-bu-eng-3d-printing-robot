# SP'25 Autonomous Mechanics Challenge Platform

## Overview

This project provides the web interface for the Autonomous Mechanics Challenge, allowing users to interact with Boston University's Bayesian Experimental Autonomous Researcher (BEAR) platform. Users can design mechanical structures, submit them for automated 3D printing and testing by the BEAR robot, track the status of their experiments, view results, and compare performance on a public leaderboard. The platform also includes an administrative dashboard for managing users, approvals, tokens, and system logs.

## Features

* **User Authentication:** Secure sign-up and login using Clerk.
* **Experiment Design:** Interactive interface to define geometric and material parameters for mechanical designs.
* **Real-time 3D Visualization:** View generated STL models using Three.js before submission.
* **Status Tracking:** Monitor the progress of submitted experiments and view historical results.
* **Leaderboard:** Compare the performance (e.g., Toughness/Mass ratio) of different experiments.
* **Design Library:** Browse past experiment results and designs.
* **Admin Dashboard:** Secure area for administrators to manage users, approvals, system logs, and token distribution.

## Technology Stack

* **Frontend:** Next.js (App Router), React 19, TypeScript, Material UI (MUI), Three.js, Framer Motion
* **Backend (3D Model Generation):** Python, FastAPI, GCS-Shape
* **Backend (API Routes):** Next.js API Routes
* **Database:** MySQL
* **ORM:** Prisma
* **Authentication:** Clerk
* **Testing:** Jest, React Testing Library
* **Linting/Formatting:** ESLint, Prettier
* **Deployment:** Railway (Configuration files included)

## Key Files & Directories

* **`app/`**: The core directory for the Next.js frontend application.
    * **`layout.tsx`**: Defines the root layout, including the main NavBar and Clerk provider wrapping the application.
    * **`page.tsx`**: The main landing/home page component (`/`).
    * **`api/`**: Contains serverless API route handlers managed by Next.js (e.g., `/api/leaderboard`, `/api/fetch-metadata`).
    * **`components/`**: Houses reusable React components used across different pages (e.g., `NavBar.tsx`, `STLViewer.tsx`, Admin components, Account tabs).
    * **`pages/`**: Defines the application's routes/pages (e.g., `/account`, `/admin`, `/leaderboard`). Each folder maps to a URL path segment.
    * **`metadata/design.tsx`**: Configuration defining the parameters, limits, and defaults for the interactive design tool (`NewExpTab.tsx`).
* **`backend/`**: Contains the separate Python backend service.
    * **`server.py`**: The FastAPI application responsible for generating STL files based on input parameters using the `gcs-shape` library. Defines the `/generate-stl/` endpoint.
    * **`requirements.txt`**: Lists the Python dependencies required for the backend server.
* **`prisma/`**: Prisma ORM configuration.
    * **`schema.prisma`**: Defines the database schema, models, and connection details used by Prisma to interact with the MySQL database.
* **`.env.example`**: Template file showing the required environment variables. Needs to be copied to `.env` and filled with actual values.
* **`package.json`**: Defines frontend project metadata, dependencies (`npm install`), and scripts (`npm run dev`, `npm run build`, `npm test`, etc.).

## Prerequisites

Before you begin, ensure you have the following installed:

* [Node.js](https://nodejs.org/) (LTS version recommended)
* [npm](https://www.npmjs.com/) (usually comes with Node.js)
* [Python](https://www.python.org/) (Version 3.x recommended)
* [pip](https://pip.pypa.io/en/stable/installation/) (usually comes with Python)
* [Git](https://git-scm.com/)
* A [Clerk](https://clerk.com/) account to obtain API keys.

## Setup Instructions

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/BU-Spark/se-bu-eng-3d-printing-robot
    cd https://github.com/BU-Spark/se-bu-eng-3d-printing-robot
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables:**
    * Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    * Edit the `.env` file and add your specific values:
        * `DATABASE_URL`: Your MySQL database connection string (e.g., `mysql://user:password@host:port/database`).
        * `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your publishable key from your Clerk application dashboard.
        * `CLERK_SECRET_KEY`: Your secret key from your Clerk application dashboard.
        * `NEXT_PUBLIC_BACKEND_URL`: The URL where the Python backend server will run. For local development, this will typically be `http://127.0.0.1:8000`.

4.  **Install Backend Dependencies:**
    * Navigate to the backend directory:
        ```bash
        cd backend
        ```
    * *(Optional but recommended)* Create and activate a Python virtual environment:
        ```bash
        python -m venv venv
        # On Windows: .\venv\Scripts\activate
        # On macOS/Linux: source venv/bin/activate
        ```
    * Install the required Python packages:
        ```bash
        pip install -r requirements.txt
        ```
    * Navigate back to the project root:
        ```bash
        cd ..
        ```

## Running the Application

You need to run both the frontend (Next.js) and the backend (FastAPI) servers concurrently.

1.  **Start the Backend Server:**
    * Open a terminal in the project root directory.
    * Navigate to the backend folder:
        ```bash
        cd backend
        ```
    * *(Activate virtual environment if you created one)*
    * Start the FastAPI server (it will typically run on `http://127.0.0.1:8000`):
        ```bash
        uvicorn server:app --reload
        ```

2.  **Start the Frontend Server:**
    * Open a *separate* terminal in the project root directory.
    * Start the Next.js development server (it will typically run on `http://localhost:3000`):
        ```bash
        npm run dev
        ```

3.  **Access the Application:**
    * Open your web browser and navigate to `http://localhost:3000`.

## Testing

This project uses Jest and React Testing Library for frontend component testing.

* **Run all tests:**
    ```bash
    npm run test
    ```
* **Run tests in watch mode:**
    ```bash
    npm run test:watch
    ```
* **Generate test coverage report:**
    ```bash
    npm run test:coverage
    ```

## Next Steps

The following are key areas planned for future development:

* **Database Integration:** Connect the application to the live BEAR database, replacing the placeholder DB we currently use.
* **Job Submission System:** Implement the functionality for users to submit their generated designs as jobs to the BEAR platform queue. This involves defining the API calls and handling the submission logic.
* **End-to-End Testing:** Conduct thorough testing of the job submission workflow, from design creation to queue confirmation.
* **Enhanced Visualization:** Integrate STL model visualization directly into the Leaderboard and Library pages to allow users to see the designs associated with specific results.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](./LICENSE) file for details.
