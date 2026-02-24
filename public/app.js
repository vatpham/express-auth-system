
async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Username and password required");
        return;
    }

    const res = await fetch(`api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
    } else {
        alert(data.error || "Registration failed");
    }
}

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Username and password required");
        return;
    }

    const res = await fetch(`api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.role === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "dashboard.html";
        }
    } else {
        alert("Login failed");
    }
}

async function getUsers() {
    const token = localStorage.getItem("token");

    const res = await fetch(`api/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const users = await res.json();

    const list = document.getElementById("userList");
    list.innerHTML = "";

    users.forEach(user => {
        const li = document.createElement("li");
        li.textContent = user.username;
        list.appendChild(li);
    });
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}


let currentEditUserId = null;

async function loadAdminUsers() {
    const token = localStorage.getItem("token");

    const res = await fetch(`api/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message || "Failed to fetch users");
        if (res.status === 400 || res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
        return;
    }

    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No users found</td></tr>';
        return;
    }

    data.forEach(user => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.role || 'user'}</td>
            <td>
                <button onclick="editUser(${user.id}, '${user.username}', '${user.role || 'user'}')">Edit</button>
                <button onclick="deleteUser(${user.id}, '${user.username}')">Delete</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function editUser(id, username, role) {
    currentEditUserId = id;
    document.getElementById("editUsername").value = username;
    document.getElementById("editRole").value = role;
    document.getElementById("currentEditingUser").textContent = `Currently editing: ${username}, ID: ${id}`;
}

async function saveUser() {
    if (!currentEditUserId) {
        alert("No user selected");
        return;
    }

    const username = document.getElementById("editUsername").value;
    const role = document.getElementById("editRole").value;

    if (!username) {
        alert("Username is required");
        return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(`api/users/${currentEditUserId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username, role })
    });

    const data = await res.json();

    if (res.ok) {
        alert("User updated successfully");
        loadAdminUsers();
    } else {
        alert(data.error || "Failed to update user");
    }
}

async function deleteUser(id, username) {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
        return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(`api/users/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();

    if (res.ok) {
        alert("User deleted successfully");
        loadAdminUsers();
    } else {
        alert(data.error || data.message || "Failed to delete user");
    }
}

