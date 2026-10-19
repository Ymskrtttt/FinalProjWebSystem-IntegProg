# Mitsu Travel & Tours — Reservation & Transaction Management System (MERN)

## 1. Project & Target Client Profile
- **Project Title:** Travel & Tour Reservation Management System
- **Target Client:** **Mitsu Travel & Tours** (Boutique Luxury Travel & Tour Agency specializing in curated 5-day and 7-day blueprints across Tokyo, Bali, and Singapore)
- **Frontend Stack:** Create React App (`react-scripts`), React Router (`react-router-dom`), Axios (`axios`), Leaflet Maps
- **Backend Stack:** Node.js, Express (`express`, `cors`), MongoDB & Mongoose (`mongoose`) following the **MVC (Models, Controllers, Routes)** pattern

---

## 2. Project Folder Structure (MVC + Create React App)
```text
Mitsu-Travel-MERN/
├── backend/
│   ├── models/
│   │   ├── User.js                # Mongoose Schema for User Accounts & Roles
│   │   └── Booking.js             # Mongoose Schema for Travel Bookings & Archive
│   ├── controllers/
│   │   ├── userController.js      # Isolated business logic (.find, .save, .findByIdAndUpdate)
│   │   └── bookingController.js   # Transaction workflow & archive logic
│   ├── routes/
│   │   ├── userRoutes.js          # Express Router (/api/getUsers, /api/login, /api/register, etc.)
│   │   └── bookingRoutes.js       # Express Router (/api/getBookings, /api/createBooking, etc.)
│   ├── seedData.js                # Realistic presentation dataset (12 active users, 21 completed bookings)
│   ├── seed.js                    # Database cleanup & seeder script
│   ├── server.js                  # Express Server initialization, cors(), express.json(), mongoose.connect()
│   └── package.json
└── frontend/                      # Create React App (CRA)
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js
    │   ├── data/
    │   │   └── destinationsData.js
    │   ├── pages/
    │   │   ├── HomePage.js
    │   │   ├── DestinationPage.js
    │   │   ├── AuthPage.js
    │   │   ├── ProfilePage.js
    │   │   ├── TransactionsPage.js
    │   │   ├── UserManagementPage.js
    │   │   └── ArchivePage.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

---

## 3. How to Run the Project Locally

### Step 1: Start MongoDB & Backend Server
Open a terminal in the `backend` folder:
```bash
cd backend
npm install
npm run seed
npm start
```
- `npm run seed` cleans out any old test/dummy data (`deleteMany({})`) and populates **12 active user accounts** (2 Admins + 10 Clients), **2 archived users**, **21 Completed transactions**, **3 In-Progress workflow transactions**, and **2 Archived transactions**.
- The Express server runs on `http://localhost:5000`.

### Step 2: Start the Create React App (CRA) Frontend
Open a second terminal in the `frontend` folder:
```bash
cd frontend
npm install
npm start
```
- Opens automatically at `http://localhost:3000`.

---

## 4. Presentation Demo Accounts (Module 1, 2 & 5)

| Role | Full Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Admin** | Kenji Mitsu | `kenji.mitsu@gmail.com` | `mitsukumar` |
| **Admin** | Sofia Reyes | `sofia.reyes@gmail.com` | `mitsukumar` |
| **Client** | Marco Villanueva | `marco.villanueva@gmail.com` | `client123` |
| **Client** | Camille Santos | `camille.santos@gmail.com` | `client123` |
| **Client** | Rafael Mendoza | `rafael.mendoza@gmail.com` | `client123` |
| **Client** | Bianca Lim | `bianca.lim@gmail.com` | `client123` |
| **Client** | Daniel Soriano | `daniel.soriano@gmail.com` | `client123` |
| **Client** | Patricia Chua | `patricia.chua@gmail.com` | `client123` |
| **Client** | Gabriel Bautista | `gabriel.bautista@gmail.com` | `client123` |
| **Client** | Angela Dela Cruz | `angela.delacruz@gmail.com` | `client123` |
| **Client** | Miguel Tan | `miguel.tan@gmail.com` | `client123` |
| **Client** | Claire Navarro | `claire.navarro@gmail.com` | `client123` |

---

## 5. How to Upload This Project to Your GitHub Repository

### Option A: Using Git in Terminal / VS Code (Recommended)
1. Unzip `Mitsu-Travel-MERN.zip` into your local repository folder.
2. Open your terminal inside that folder and run:
```bash
git add .
git commit -m "Upgrade Mitsu Travel & Tours to full-stack CRA + Express MVC MongoDB app"
git push origin main
```

### Option B: Uploading via the GitHub Website
1. Unzip `Mitsu-Travel-MERN.zip` on your computer.
2. Open your repository on GitHub.com and click **Add file > Upload files**.
3. Drag and drop the `backend/`, `frontend/`, `.gitignore`, and `README.md` files into the browser window.
4. Click **Commit changes**.

---

## 6. Roles and Permissions
- **Client:** registers with a Gmail address (new accounts are always clients), books trips on the destination pages, and sees only their own bookings on **My Bookings**.
- **Admin:** sees every booking, can Confirm / Complete / Archive transactions, and can open the **Users** and **Archive** pages. Only an admin can create another admin or change a role.
- The app starts logged out. Clients who open `/users` or `/archive` see a "For Admins Only" message.
- Password recovery and the security question were removed.
