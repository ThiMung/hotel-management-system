document.addEventListener("DOMContentLoaded", () => {
  const guestMenu = document.getElementById("guestMenu");
  const userMenu = document.getElementById("userMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const userAvatar = document.getElementById("userAvatar");
  const userModal = document.getElementById("userModal");
  const userInfo = document.getElementById("userInfo");
  const closeModal = document.getElementById("closeModal");

  // Lấy thông tin người dùng đang đăng nhập
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // Cập nhật giao diện menu
  function updateMenu() {
    if (currentUser) {
      if (guestMenu) guestMenu.classList.add("hidden");
      if (userMenu) userMenu.classList.remove("hidden");
    } else {
      if (guestMenu) guestMenu.classList.remove("hidden");
      if (userMenu) userMenu.classList.add("hidden");
    }
  }

  updateMenu(); // Gọi ngay khi load trang

  // 🔹 Đăng xuất
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      alert("You have logged out!");
      if (guestMenu) guestMenu.classList.remove("hidden");
      if (userMenu) userMenu.classList.add("hidden");
      location.reload(); // Load lại trang để đảm bảo cập nhật
    });
  }

  // Mở modal hiển thị thông tin người dùng
  if (userAvatar) {
    userAvatar.addEventListener("click", () => {
      const current = JSON.parse(localStorage.getItem("loggedInUser"));
      if (current) {
        userInfo.innerHTML = `
          <p><strong>Full name:</strong> ${current.name || "Not updated yet"}</p>
          <p><strong>Email:</strong> ${current.email}</p>
          <p><strong>Phone number:</strong> ${current.phone || "Not updated yet"}</p>
          <p><strong>Role:</strong> ${current.role || "User"}</p>
        `;
        if (userModal) userModal.style.display = "flex";
      }
    });
  }

  // Đóng modal khi bấm nút
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      if (userModal) userModal.style.display = "none";
    });
  }

  // Click ra ngoài modal để đóng
  if (userModal) {
    userModal.addEventListener("click", (e) => {
      if (e.target === userModal) {
        userModal.style.display = "none";
      }
    });
  }
});
