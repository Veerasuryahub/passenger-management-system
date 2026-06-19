# 🚆 Passenger Management System

[![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tomcat](https://img.shields.io/badge/Tomcat-10-F8DC75?style=for-the-badge&logo=apachetomcat&logoColor=black)](https://tomcat.apache.org/)
[![Maven](https://img.shields.io/badge/Maven-3.9-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)](https://maven.apache.org/)

A full-stack **Enterprise Passenger Management System** for Travel Agents built with Java Servlets, JDBC, MySQL, and modern HTML/CSS/JavaScript.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#-prerequisites)
- [Database Setup](#-database-setup)
- [Tomcat Setup](#-tomcat-setup)
- [How to Run](#-how-to-run)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [User Stories](#-user-stories)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)

---

## 🎯 Project Overview

The Passenger Management System is designed for authorized Travel Agents to manage passenger bookings efficiently. The system provides a comprehensive set of CRUD operations with a modern, responsive, and professional UI.

### Key Capabilities
- **Secure Authentication** with session management
- **Full CRUD Operations** for passenger records
- **Real-time Dashboard** with statistics
- **Advanced Table** with search, sort, and pagination
- **Responsive Design** that works on all devices
- **Input Validation** on both client and server side

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Login** | Secure authentication with User ID/Password validation |
| 📊 **Dashboard** | Overview with total passengers, revenue, and quick actions |
| ➕ **Add Passenger** | Create new booking with full field validation |
| ✏️ **Update Passenger** | Search by PNR and modify booking details (PNR is read-only) |
| 🗑️ **Delete Passenger** | Search, review, and delete with confirmation modal |
| 👁️ **View All** | Responsive table with search, sort, and pagination (10 per page) |
| 🔍 **Search** | Find passenger by PNR number with detailed result card |
| 📱 **Responsive** | Works on desktop, tablet, and mobile devices |
| 🎨 **Modern UI** | Glassmorphism login, dark sidebar, animated transitions |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Java 17+, Jakarta Servlet API 6.0 |
| **Database** | MySQL 8.0+ |
| **Build Tool** | Apache Maven 3.9+ |
| **Server** | Apache Tomcat 10+ |
| **IDE** | VS Code |

---

## 📁 Folder Structure

```
PassengerManagementSystem/
├── src/
│   └── main/
│       ├── java/
│       │   ├── controller/
│       │   │   ├── LoginServlet.java          # POST /login - Authentication
│       │   │   ├── AddPassengerServlet.java   # POST /addPassenger
│       │   │   ├── UpdatePassengerServlet.java# PUT  /updatePassenger
│       │   │   ├── DeletePassengerServlet.java# DELETE /deletePassenger
│       │   │   ├── ViewPassengerServlet.java  # GET  /viewPassengers
│       │   │   └── SearchPassengerServlet.java# GET  /searchPassenger
│       │   ├── dao/
│       │   │   └── PassengerDAO.java          # Database operations
│       │   ├── model/
│       │   │   └── Passenger.java             # POJO model
│       │   └── util/
│       │       └── DBConnection.java          # JDBC connection utility
│       └── webapp/
│           ├── index.html                     # Login page
│           ├── dashboard.html                 # Dashboard
│           ├── addPassenger.html              # Add passenger form
│           ├── updatePassenger.html           # Update passenger form
│           ├── deletePassenger.html           # Delete passenger
│           ├── viewPassenger.html             # View all passengers table
│           ├── searchPassenger.html           # Search passenger
│           ├── css/
│           │   └── style.css                  # Complete design system
│           ├── js/
│           │   └── app.js                     # Frontend logic
│           ├── images/
│           └── WEB-INF/
│               └── web.xml                    # Deployment descriptor
├── sql/
│   └── passenger_db.sql                       # Database script
├── pom.xml                                     # Maven configuration
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

Ensure you have the following installed:

1. **Java JDK 17+** - [Download](https://adoptium.net/)
2. **Apache Maven 3.9+** - [Download](https://maven.apache.org/download.cgi)
3. **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/)
4. **Apache Tomcat 10+** - [Download](https://tomcat.apache.org/download-10.cgi)

Verify installations:
```bash
java -version
mvn -version
mysql --version
```

---

## 🗃️ Database Setup

### Step 1: Start MySQL Server

```bash
# Windows
net start mysql

# Or use MySQL Workbench / XAMPP
```

### Step 2: Run SQL Script

```bash
mysql -u root -p < sql/passenger_db.sql
```

Or open MySQL Workbench and execute `sql/passenger_db.sql`.

### Step 3: Verify

```sql
USE passenger_db;
SELECT * FROM users;
SELECT * FROM passenger;
```

### Default Login Credentials

| User ID | Password | Role |
|---------|----------|------|
| admin001 | Admin@1234 | System Administrator |
| agent001 | Agent@12345 | Travel Agent |
| agent002 | Agent@67890 | Travel Agent |

### Database Configuration

Update `src/main/java/util/DBConnection.java` if your MySQL credentials differ:

```java
private static final String URL = "jdbc:mysql://localhost:3306/passenger_db";
private static final String USERNAME = "root";
private static final String PASSWORD = "root"; // Change to your password
```

---

## 🔧 Tomcat Setup

### Step 1: Download and Extract Tomcat 10

Download from [tomcat.apache.org](https://tomcat.apache.org/download-10.cgi) and extract to a directory.

### Step 2: Set CATALINA_HOME

```bash
# Windows
set CATALINA_HOME=C:\path\to\apache-tomcat-10

# Linux/Mac
export CATALINA_HOME=/path/to/apache-tomcat-10
```

### Step 3: Deploy WAR

Copy the generated WAR file to Tomcat's `webapps/` directory:

```bash
copy target\PassengerManagementSystem.war %CATALINA_HOME%\webapps\
```

---

## 🚀 How to Run

### Step 1: Build the Project

```bash
cd PassengerManagementSystem
mvn clean package
```

### Step 2: Deploy

```bash
# Copy WAR to Tomcat
copy target\PassengerManagementSystem.war %CATALINA_HOME%\webapps\
```

### Step 3: Start Tomcat

```bash
# Windows
%CATALINA_HOME%\bin\startup.bat

# Linux/Mac
$CATALINA_HOME/bin/startup.sh
```

### Step 4: Open Application

Navigate to: **http://localhost:8080/PassengerManagementSystem/**

### Step 5: Login

Use credentials: `admin001` / `Admin@1234`

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| `POST` | `/login` | Authenticate user | `{ userId, password }` |
| `GET` | `/login` | Check session status | - |
| `DELETE` | `/login` | Logout (destroy session) | - |
| `POST` | `/addPassenger` | Add new passenger | `{ pnrNumber, passengerName, age, gender, origin, destination, trainNumber, ticketPrice }` |
| `PUT` | `/updatePassenger` | Update passenger | `{ pnrNumber, passengerName, age, gender, origin, destination, trainNumber, ticketPrice }` |
| `DELETE` | `/deletePassenger?pnr=PNR1001` | Delete passenger | Query param: `pnr` |
| `GET` | `/viewPassengers` | View all passengers | - |
| `GET` | `/searchPassenger?pnr=PNR1001` | Search by PNR | Query param: `pnr` |

### Response Format

All APIs return JSON:

```json
// Success
{
    "status": "success",
    "message": "Operation successful!",
    "data": { ... }
}

// Error
{
    "status": "error",
    "message": "Error description"
}
```

---

## 📸 Screenshots

### Login Page
- Glassmorphism card with gradient background
- Animated floating circles
- Password show/hide toggle
- Inline validation messages
- Remember me & Forgot password

### Dashboard
- Dark sidebar with navigation
- Stats cards (Total Passengers, Revenue, Recent Bookings)
- Quick action cards
- Responsive layout

### Add Passenger
- Two-column form grid
- Input icons and floating labels
- Client-side validation
- Success/error toast notifications

### View All Passengers
- Modern data table with sticky header
- Column sorting (click headers)
- Real-time search filtering
- Pagination (10 per page)
- Edit & Delete action buttons

### Search Passenger
- PNR search input
- Detailed result card with grid layout
- Not found state with illustration

### Delete Passenger
- Passenger details preview card
- Confirmation modal dialog
- Success notification after deletion

---

## 📋 User Stories

| ID | Title | Priority |
|----|-------|----------|
| US001 | Website Login | High |
| US002 | Add Passenger | High |
| US003 | Update Passenger | High |
| US004 | Delete Passenger | High |
| US005 | View All Passengers | High |
| US006 | Search Passenger | High |

---

## 🧪 Testing

### Test Cases Summary

| Category | Count | Description |
|----------|-------|-------------|
| Unit Tests | 20+ | Individual method testing |
| Functional Tests | 15+ | Feature-level testing |
| Integration Tests | 10+ | End-to-end flow testing |
| UI Tests | 12+ | Visual and interaction testing |
| Boundary Tests | 8+ | Edge case testing |
| Negative Tests | 10+ | Invalid input testing |
| Validation Tests | 12+ | Form validation testing |
| Database Tests | 8+ | CRUD operation testing |

### Key Test Scenarios

- ✅ Login with valid credentials
- ✅ Login with wrong password
- ✅ Login with empty fields
- ✅ Add passenger with all fields
- ✅ Add passenger with duplicate PNR
- ✅ Update passenger details
- ✅ Delete passenger with confirmation
- ✅ Search passenger by PNR
- ✅ Search non-existent PNR
- ✅ Table pagination (10 per page)
- ✅ Table sorting by columns
- ✅ Table search filtering
- ✅ Mobile responsiveness
- ✅ Session timeout handling

---

## 🚢 Deployment

### Build WAR

```bash
mvn clean package
```

### Deploy to Tomcat

1. Copy `target/PassengerManagementSystem.war` to `$CATALINA_HOME/webapps/`
2. Start Tomcat
3. Access at `http://localhost:8080/PassengerManagementSystem/`

### Verify Deployment

```bash
# Check Tomcat logs
tail -f $CATALINA_HOME/logs/catalina.out

# Verify JDBC Connection
# Check for "MySQL JDBC Driver" in logs

# Test API
curl http://localhost:8080/PassengerManagementSystem/viewPassengers
```

### Troubleshooting

| Issue | Solution |
|-------|---------|
| ClassNotFoundException: MySQL Driver | Ensure mysql-connector-j is in `WEB-INF/lib/` |
| Connection refused | Check MySQL is running on port 3306 |
| 404 on servlets | Verify web.xml and @WebServlet annotations |
| Session expired | Re-login; session timeout is 30 minutes |

---

## 🔮 Future Enhancements

- [ ] Password hashing (BCrypt)
- [ ] Role-based access control (Admin/Agent)
- [ ] Export to PDF/Excel
- [ ] Email notifications
- [ ] Booking history/audit trail
- [ ] Dark mode toggle
- [ ] Multi-language support (i18n)
- [ ] REST API documentation (Swagger)
- [ ] Docker containerization
- [ ] CI/CD pipeline

---

## 📄 License

This project is developed for educational and demonstration purposes.

---

## 👨‍💻 Author

**Passenger Management System Team**

© 2026 Passenger Management System. All rights reserved.