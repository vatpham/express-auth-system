# Express Auth System

Simple authentication system web application built with Express.js, MariaDB, and JWT. It allows users to register, login, and includes an admin panel to manage users with role-based access control.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Install MariaDB

```bash
brew install mariadb
brew services start mariadb
```

### 3. Create the Database

Log in to MariaDB and create the database and user:

```bash
mariadb -u root -p
```

Then run the following SQL commands:

```sql
CREATE DATABASE express_auth_system;
CREATE USER 'auth_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON express_auth_system.* TO 'auth_user'@'localhost';
FLUSH PRIVILEGES;
```

Switch to the database and create the table:

```sql
USE express_auth_system;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Set Up Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### 5. Run the Application

```bash
node server.js
```
