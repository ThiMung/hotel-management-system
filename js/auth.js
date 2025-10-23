const apiUrl = "http://localhost:3000/customers";

// Đăng ký
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const res = await fetch(apiUrl);
    const users = await res.json();

    // Kiểm tra trùng email
    const exist = users.find((u) => u.email === email);
    if (exist) {
      alert("Email has been registered!");
      return;
    }

    await fetch(apiUrl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, email, password })
    });

    alert("Registration successful!");
    window.location.href = "login.html";
  });
}

// Đăng nhập
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const res = await fetch(apiUrl);
    const users = await res.json();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      alert("Wrong email or phone number!");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));
    alert("Login successful!");
    window.location.href = "index.html";
  });
}

// Đăng xuất
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    alert("You're logout!");
    window.location.href = "login.html";
  });
}