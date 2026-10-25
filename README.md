
# Employee Management System

## Project Description
A web application to manage employee records using CRUD operations.

## Features
- Add a new employee
- View all employees
- Update employee details
- Delete employees
- Search employees
- Sort employees by name, department, and salary
- Form validation and error messages

## Technologies Used
- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MySQL

## How to Run the Project

1. Install Node.js and MySQL.
2. Open the project folder in VS Code.
3. Run `npm install` in the terminal.
4. Configure the database credentials in the `.env` file.
5. Start the server using:

   `node server.js`

6. Open the frontend using VS Code Live Server.

## API Endpoints

- GET `/api/employees` — View employees
- POST `/api/employees` — Add employee
- PUT `/api/employees/:id` — Update employee
- DELETE `/api/employees/:id` — Delete employee
