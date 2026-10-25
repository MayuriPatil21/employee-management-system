
const API_URL = "http://localhost:3000/api/employees";

const form = document.getElementById("employeeForm");
const employeeId = document.getElementById("employeeId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const departmentInput = document.getElementById("department");
const roleInput = document.getElementById("role");
const joiningDateInput = document.getElementById("joining_date");
const salaryInput = document.getElementById("salary");
const tableBody = document.getElementById("employeeTableBody");
const searchInput = document.getElementById("searchInput");
const sortBy = document.getElementById("sortBy");
const message = document.getElementById("message");
const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");

function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? "red" : "green";
}

async function loadEmployees() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Employees load झाले नाहीत.");
        }

        const employees = await response.json();
        const searchText = searchInput.value.toLowerCase().trim();

const filteredEmployees = employees.filter((employee) =>
    [
        employee.name,
        employee.email,
        employee.department,
        employee.role
    ].some((value) =>
        String(value || "").toLowerCase().includes(searchText)
    )
);
const sortValue = sortBy.value;

if (sortValue === "name") {
    filteredEmployees.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
    );
} else if (sortValue === "department") {
    filteredEmployees.sort((a, b) =>
        (a.department || "").localeCompare(b.department || "")
    );
} else if (sortValue === "salary") {
    filteredEmployees.sort((a, b) =>
        Number(a.salary || 0) - Number(b.salary || 0)
    );
}
        tableBody.replaceChildren();

        if (filteredEmployees.length === 0) {
            const row = tableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 8;
            cell.textContent = "No employees found.";
            return;
        }

        filteredEmployees.forEach((employee) => {
            const row = tableBody.insertRow();

            [
    employee.id,
    employee.name,
    employee.email,
    employee.department || "-",
    employee.role || "-",
    employee.joining_date
        ? String(employee.joining_date).slice(0, 10)
        : "-",
    employee.salary ?? "-"
].forEach((value) => {
                const cell = row.insertCell();
                cell.textContent = value;
            });

            const actionsCell = row.insertCell();

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.type = "button";
            editButton.addEventListener("click", () => editEmployee(employee));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.type = "button";
            deleteButton.style.background = "#c0392b";
            deleteButton.addEventListener("click", () => deleteEmployee(employee.id));

            actionsCell.append(editButton, deleteButton);
        });
    } catch (error) {
    console.error("Error loading employees:", error);
    showMessage(error.message || "Something went wrong. Please try again.", true);
}
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = employeeId.value;

   const employee = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    department: departmentInput.value.trim(),
    role: roleInput.value.trim(),
    joining_date: joiningDateInput.value || null,
    salary: salaryInput.value === "" ? null : Number(salaryInput.value)
};

    if (!employee.name || !employee.email) {
        showMessage("Name आणि email आवश्यक आहेत.", true);
        return;
    }

    try {
        const response = await fetch(
            id ? `${API_URL}/${id}` : API_URL,
            {
                method: id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee)
            }
        );

        const result = await response.json();
        

        if (!response.ok) {
            throw new Error(result.error || "Operation failed.");
        }

        showMessage(result.message);
        resetForm();
        await loadEmployees();
    } catch (error) {
    console.error("Employee operation failed:", error);
    showMessage(error.message || "Something went wrong. Please try again.", true);
}
});

function editEmployee(employee) {
    employeeId.value = employee.id;
    nameInput.value = employee.name;
    emailInput.value = employee.email;
    departmentInput.value = employee.department || "";
    roleInput.value = employee.role || "";
    joiningDateInput.value = employee.joining_date
    ? String(employee.joining_date).slice(0, 10)
    : "";
    salaryInput.value = employee.salary ?? "";

    formTitle.textContent = "Edit Employee";
    submitButton.textContent = "Update Employee";
    cancelButton.hidden = false;

    form.scrollIntoView({ behavior: "smooth" });
}

async function deleteEmployee(id) {
    if (!confirm("हा employee delete करायचा आहे का?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Delete failed.");
        }

        showMessage(result.message);
        await loadEmployees();
    } catch (error) {
        showMessage(error.message, true);
    }
}

function resetForm() {
    form.reset();
    employeeId.value = "";
    formTitle.textContent = "Add Employee";
    submitButton.textContent = "Add Employee";
    cancelButton.hidden = true;
}

cancelButton.addEventListener("click", resetForm);

loadEmployees();
searchInput.addEventListener("input", () => {
    loadEmployees();
});
sortBy.addEventListener("change", () => {
    loadEmployees();
});