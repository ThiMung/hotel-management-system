const apiUrl = "http://localhost:3000/customers";

// ----------- ĐĂNG KÝ -----------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const res = await fetch(apiUrl);
    const users = await res.json();

    // Kiểm tra trùng email
    const exist = users.find((u) => u.email === email);
    if (exist) {
      alert("Email has been registered!");
      return;
    }

    // Tạo tài khoản mới
    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });

    alert("Registration successful!");
    window.location.href = "login.html"; // Chuyển sang trang login
  });
}

// ----------- ĐĂNG NHẬP -----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const res = await fetch(apiUrl);
    const users = await res.json();

    // Kiểm tra đúng email và phone
    const user = users.find((u) => u.email === email && u.phone === phone);

    if (!user) {
      alert("Wrong email or phone number!");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));
    alert("Login successful!");
    window.location.href = "home.html"; // Chuyển sang trang chủ đã đăng nhập
  });
}

// ----------- ĐĂNG XUẤT -----------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    alert("You're logged out!");
    window.location.href = "index.html"; // Quay lại trang chủ đầu tiên chưa đăng nhập
  });
}

// ----------- HIỂN THỊ THÔNG TIN NGƯỜI DÙNG -----------
// Hàm lấy thông tin người dùng đã đăng nhập
function getLoggedInUser() {
  const userData = localStorage.getItem("loggedInUser");
  return userData ? JSON.parse(userData) : null;
}

// Hàm hiển thị modal thông tin người dùng
function showUserInfoModal() {
  const user = getLoggedInUser();

  if (!user) {
    alert("No user logged in!");
    return;
  }

  // Tạo modal nếu chưa tồn tại
  if (!document.getElementById("userModal")) {
    createUserModal();
  } else {
    // NẾU MODAL ĐÃ TỒN TẠI, GÁN LẠI SỰ KIỆN ĐÓNG
    bindModalEvents();
  }

  // Điền thông tin vào modal
  const userInfo = document.getElementById("userInfo");
  userInfo.innerHTML = `
    <p><strong>Full name:</strong> <span>${
      user.name || "Not updated yet!"
    }</span></p>
    <p><strong>Email:</strong> <span>${user.email}</span></p>
    <p><strong>Phone number:</strong> <span>${
      user.phone || "Not updated yet!"
    }</span></p>
  `;

  // Hiển thị modal
  document.getElementById("userModal").style.display = "flex";
}

// Hàm tạo modal
function createUserModal() {
  const modalHTML = `
    <div class="modal-overlay" id="userModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>User information</h3>
          <button class="modal-close" id="closeModal">&times;</button>
        </div>
        <div class="user-info" id="userInfo">
          <!-- Thông tin sẽ được điền từ JS -->
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Gán sự kiện đóng modal
  bindModalEvents();
}

// HÀM GÁN SỰ KIỆN ĐÓNG MODAL
function bindModalEvents() {
  const closeModal = document.getElementById("closeModal");
  const userModal = document.getElementById("userModal");

  if (closeModal) {
    // Xóa sự kiện cũ (nếu có) để tránh trùng lặp
    closeModal.onclick = null;
    // Gán sự kiện mới
    closeModal.onclick = function () {
      userModal.style.display = "none";
    };
  }

  if (userModal) {
    // Xóa sự kiện cũ (nếu có) để tránh trùng lặp
    userModal.onclick = null;
    // Gán sự kiện mới
    userModal.onclick = function (e) {
      if (e.target === this) {
        this.style.display = "none";
      }
    };
  }
}

// SỬ DỤNG EVENT DELEGATION - LUÔN HOẠT ĐỘNG
document.addEventListener("click", function (e) {
  // Đóng modal khi click vào nút close
  if (
    e.target.id === "closeModal" ||
    e.target.classList.contains("modal-close")
  ) {
    const userModal = document.getElementById("userModal");
    if (userModal) {
      userModal.style.display = "none";
    }
  }

  // Đóng modal khi click vào background
  if (e.target.id === "userModal") {
    e.target.style.display = "none";
  }
});

// Khởi tạo khi trang load
document.addEventListener("DOMContentLoaded", function () {
  // Thêm sự kiện click cho avatar
  const userAvatar = document.getElementById("userAvatar");
  if (userAvatar) {
    userAvatar.addEventListener("click", showUserInfoModal);
  }
});
