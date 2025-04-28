# SP'25 Autonomous Mechanics Challenge

## Project Structure
### Frontend Overview: `app/`
This is the main application source folder. It is organized into API routes, UI components, pages, and metadata utilities.
- `page.tsx` - root `/` home page
- `layout.tsx` - global layout of the website

### `api/`
Contains backend server-side API routes (Next.js route handlers)
- `fetch-metadata/` 
   - fetches article metadata (e.g., title, description, image) from a provided URL.
- `leaderboard/`
   - handles leaderboard functionality (e.g., retrieving top scores)

### `components/`
Contains frontend UI components - reusable across pages.
- `Account/` 
   - `InfoTab.tsx` - displays user account information
   - `NewExpTab.tsx` - UI for submitting a new experiment/task
   - `StatusTab.tsx` - shows the status/history of experiments
   - `STLViewer.tsx` - 3D viewer for STL files/models
- `Admin/` 
   - `Navigation.tsx` - admin-specific navigation component for switching between approval, syslog, token management, and user management sections.
- `Navigation/`
   - `ClerkButtonStyles.css` - custom CSS overrrides for Clerk authentication buttons
   - `NavBar.tsx` - main site navigation bar for authenticated and unauthenticated users

### `metadata/`
- `design.tsx` - contains design utilities related to fetching, styling, or handling metadata (e.g., theming article cards, colors).

### `pages/`
Contains frontend route pages. Each folder or file corresponds to a URL path.
- `account/` 
   - `page.tsx` - landing page for a user's personal account
   - `newexp/page.tsx` - new experiment creation-related subpages
- `admin/` 
   - Admin dashboard area:
      - `approval/` - manage pending experiment approval requests 
      - `syslogs/` - view system logs/events
      - `tokens/` - manage user token allocation
      - `uses/` - view or manage user accounts
- `bear-status/` 
   - `page.tsx` - displays the status of BEAR robot experiments 
- `leaderboard/`
   - `page.tsx` - displays a leaderboard of all submissions
- `library/`
   - `page.tsx` - displays user's past experiments

### Backend Overview
- `app/api/` - small serverless tasks (e.g., fetching metadata, leaderboard)
- `backend/server.py` - handles 3D model rendering (.stl file creation)

### Database Overview
This project utilizes the client's mySQL database. It uses Prisma ORM to simplify database interactions for the NextJS application.
- `prisma/scheme.prisma` - contains the schema for the client's mySQL database

### Environment Variables
- `DATABASE_URL` - client's mySQL database (currenly using a SQL dump file)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - obtained through clerk
- `CLERK_SECRET_KEY` - obtained through clerk
- `NEXT_PUBLIC_BACKEND_URL` - the backend url to connect to the frontend for 3D model rendering

## Running the Application
First install all necessary dependencies for the frontend
```
npm install
```
Run the frontend application
```
npm run dev
```
In a new terminal, navigate to the backend 
```
cd backend
```
Install all necessary dependencies for the backend
```
pip install -r requirements.txt
```

Run the backend server
```
uvicorn server:app --reload
```