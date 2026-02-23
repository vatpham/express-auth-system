
async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    await fetch(`api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    alert("User registered!");
    window.location.href = "dashboard.html";
}

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
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

