const API_URL = "http://localhost:3000";

// 🟢 Kiểm tra quyền admin
const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.role !== "admin") {
  alert("You do not have permission to access this page!");
  window.location.href = "/index.html";
}

// 🟢 Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../index.html"; // chuyển về index
});

// ----------------- HÀM MỞ / ĐÓNG MODAL -----------------
function openModal(modal) {
  modal.style.display = "flex"; // flex để căn giữa
}

function closeModal(modal) {
  modal.style.display = "none";
}

// ----------------- ADMIN MODAL -----------------
const adminAvatar = document.getElementById("adminAvatar");
const adminModal = document.getElementById("adminModal");
const closeAdminModal = document.getElementById("closeAdminModal");
const adminInfo = document.getElementById("adminInfo");

adminAvatar?.addEventListener("click", () => {
  adminInfo.innerHTML = `
    <p><strong>Name:</strong> ${user.name}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Phone:</strong> ${user.phone}</p>
    <p><strong>Role:</strong> ${user.role}</p>
  `;
  openModal(adminModal);
});

closeAdminModal?.addEventListener("click", () => closeModal(adminModal));

// ----------------- ROOM MODAL -----------------
const roomModal = document.getElementById("roomModal");
const roomForm = document.getElementById("roomForm");
const closeRoomModal = document.getElementById("closeRoomModal");
const roomModalTitle = document.getElementById("roomModalTitle");
let editingRoomId = null;

document.getElementById("addRoomBtn").addEventListener("click", () => {
  editingRoomId = null;
  roomForm.reset();
  roomModalTitle.textContent = "Add New Room";
  openModal(roomModal);
});

closeRoomModal.addEventListener("click", () => closeModal(roomModal));

// ----------------- SERVICE MODAL -----------------
const serviceModal = document.getElementById("serviceModal");
const serviceForm = document.getElementById("serviceForm");
const closeServiceModal = document.getElementById("closeServiceModal");
const serviceModalTitle = document.getElementById("serviceModalTitle");
let editingServiceId = null;

document.getElementById("addServiceBtn").addEventListener("click", () => {
  editingServiceId = null;
  serviceForm.reset();
  serviceModalTitle.textContent = "Add New Service";
  openModal(serviceModal);
});

closeServiceModal.addEventListener("click", () => closeModal(serviceModal));

// Click ngoài modal đóng modal
window.addEventListener("click", (e) => {
  if (e.target === adminModal) closeModal(adminModal);
  if (e.target === roomModal) closeModal(roomModal);
  if (e.target === serviceModal) closeModal(serviceModal);
});

// ----------------- LOAD DỮ LIỆU -----------------
async function loadRooms() {
  try {
    const res = await fetch(`${API_URL}/rooms`);
    const data = await res.json();
    const tbody = document.querySelector("#roomsTable tbody");
    tbody.innerHTML = "";
    data.forEach((room) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${room.id}</td>
        <td>${room.name}</td>
        <td>${room.type}</td>
        <td>${room.price}</td>
        <td>${room.status}</td>
        <td><img src="${room.image || "../image/no-image.png"}" alt="Room" width="80"></td>
        <td>
          <button class="edit-btn" onclick="editRoom(${room.id})">Edit</button>
          <button class="delete-btn" onclick="deleteRoom(${room.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading rooms:", error);
  }
}


async function loadServices() {
  try {
    const res = await fetch(`${API_URL}/services`);
    const data = await res.json();
    const tbody = document.querySelector("#servicesTable tbody");
    tbody.innerHTML = "";
    data.forEach((service) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${service.id}</td>
        <td>${service.name}</td>
        <td>${service.description}</td>
        <td>${service.price}</td>
        <td><img src="${service.image || "../image/no-image.png"}" alt="Service" width="80"></td>
        <td>
          <button class="edit-btn" onclick="editService(${service.id})">Edit</button>
          <button class="delete-btn" onclick="deleteService(${service.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading services:", error);
  }
}

async function loadCustomers() {
  try {
    const res = await fetch(`${API_URL}/users`);
    const users = await res.json();
    const customers = users.filter(u => u.role === "user");
    const tbody = document.querySelector("#customersTable tbody");
    tbody.innerHTML = "";
    customers.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${c.id}</td><td>${c.name}</td><td>${c.phone}</td><td>${c.email}</td>`;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading customers:", error);
  }
}

async function loadBookings() {
  try {
    const res = await fetch(`${API_URL}/bookings`);
    const data = await res.json();
    const tbody = document.querySelector("#bookingsTable tbody");
    tbody.innerHTML = "";
    data.forEach((b) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${b.id}</td>
        <td>${b.customerId}</td>
        <td>${b.roomId}</td>
        <td>${b.checkIn}</td>
        <td>${b.checkOut}</td>
        <td>${b.status}</td>
        <td>${b.selectedServices || "None"}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading bookings:", error);
  }
}

// ----------------- CRUD ROOM -----------------
function deleteRoom(id) {
  if (confirm("Are you sure to delete this room?")) {
    fetch(`${API_URL}/rooms/${id}`, { method: "DELETE" })
      .then(() => loadRooms())
      .catch(err => console.error("Delete error:", err));
  }
}

function editRoom(id) {
  fetch(`${API_URL}/rooms/${id}`)
    .then(res => res.json())
    .then(room => {
      editingRoomId = id;
      roomForm.name.value = room.name;
      roomForm.type.value = room.type;
      roomForm.price.value = room.price;
      roomForm.status.value = room.status;
      roomForm.image.value = room.image;
      roomModalTitle.textContent = "Edit Room";
      openModal(roomModal);
    });
}

roomForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = {
    name: roomForm.name.value,
    type: roomForm.type.value,
    price: roomForm.price.value,
    status: roomForm.status.value,
    image: roomForm.image.value
  };
  const method = editingRoomId ? "PUT" : "POST";
  const url = editingRoomId ? `${API_URL}/rooms/${editingRoomId}` : `${API_URL}/rooms`;

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

  closeModal(roomModal);
  loadRooms();
});

// ----------------- CRUD SERVICE -----------------
function deleteService(id) {
  if (confirm("Are you sure to delete this service?")) {
    fetch(`${API_URL}/services/${id}`, { method: "DELETE" })
      .then(() => loadServices())
      .catch(err => console.error("Delete error:", err));
  }
}

function editService(id) {
  fetch(`${API_URL}/services/${id}`)
    .then(res => res.json())
    .then(service => {
      editingServiceId = id;
      serviceForm.name.value = service.name;
      serviceForm.description.value = service.description;
      serviceForm.price.value = service.price;
      serviceForm.image.value = service.image;
      serviceModalTitle.textContent = "Edit Service";
      openModal(serviceModal);
    });
}

serviceForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = {
    name: serviceForm.name.value,
    description: serviceForm.description.value,
    price: serviceForm.price.value,
    image: serviceForm.image.value
  };
  const method = editingServiceId ? "PUT" : "POST";
  const url = editingServiceId ? `${API_URL}/services/${editingServiceId}` : `${API_URL}/services`;

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

  closeModal(serviceModal);
  loadServices();
});

// ----------------- LOAD DATA KHI TRANG READY -----------------
document.addEventListener("DOMContentLoaded", () => {
  loadRooms();
  loadServices();
  loadCustomers();
  loadBookings();
});
