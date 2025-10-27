const apiUrl = "http://localhost:3000/users";

// ---------------- REGISTER ----------------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!role) return alert("Please select a role!");

    try {
      // Lấy danh sách user hiện có
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Cannot fetch users");
      const users = await res.json();

      // Kiểm tra trùng email
      if (users.some((u) => u.email === email)) {
        alert("Email has been registered!");
        return;
      }

      // Gửi request tạo mới user
      const postRes = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, role }),
      });

      if (!postRes.ok) throw new Error("Failed to register user");

      alert("Registration successful!");
      window.location.href = "login.html";
    } catch (error) {
      console.error("Register error:", error);
      alert("Something went wrong! Check console for details.");
    }
  });
}


// ---------------- LOGIN ----------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch(apiUrl);
      const users = await res.json();
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) return alert("Wrong email or password!");

      localStorage.setItem("loggedInUser", JSON.stringify(user));
      alert("Login successful!");

      // Phân trang theo vai trò
      if (user.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong!");
    }
  });
}

// ---------------- LOGOUT ----------------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    alert("You're logged out!");
    window.location.href = "index.html";
  });
}

// ---------------- USER INFO MODAL ----------------
function getLoggedInUser() {
  const data = localStorage.getItem("loggedInUser");
  return data ? JSON.parse(data) : null;
}

function showUserInfoModal() {
  const user = getLoggedInUser();
  if (!user) return alert("No user logged in!");

  if (!document.getElementById("userModal")) {
    createUserModal();
  } else {
    bindModalEvents();
  }

  document.getElementById("userInfo").innerHTML = `
    <p><strong>Full name:</strong> ${user.name}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Phone:</strong> ${user.phone}</p>
    <p><strong>Role:</strong> ${user.role}</p>
  `;

  document.getElementById("userModal").style.display = "flex";
}

function createUserModal() {
  const modalHTML = `
    <div class="modal-overlay" id="userModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>User information</h3>
          <button class="modal-close" id="closeModal">&times;</button>
        </div>
        <div class="user-info" id="userInfo"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  bindModalEvents();
}

function bindModalEvents() {
  const modal = document.getElementById("userModal");
  const closeBtn = document.getElementById("closeModal");

  if (closeBtn) {
    closeBtn.onclick = () => (modal.style.display = "none");
  }

  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const userAvatar = document.getElementById("userAvatar");
  if (userAvatar) userAvatar.addEventListener("click", showUserInfoModal);
});
