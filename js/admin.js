const API_URL = "http://localhost:3000";

// Hàm chung để load và render table
async function loadTable(
  endpoint,
  tableId,
  fields,
  editHandler = null,
  deleteHandler = null
) {
  try {
    console.log(`Fetching ${endpoint}...`);
    const response = await fetch(`${API_URL}/${endpoint}`);
    if (!response.ok)
      throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
    const data = await response.json();
    console.log(`${endpoint} data:`, data);
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) throw new Error(`Table ${tableId} not found`);
    tbody.innerHTML = "";
    data.forEach((item) => {
      const tr = document.createElement("tr");
      fields.forEach((field) => {
        const td = document.createElement("td");
        if (field === "image") {
          const img = document.createElement("img");
          img.src = item[field] || "https://via.placeholder.com/50";
          img.width = 50;
          img.alt = "Image";
          td.appendChild(img);
        } else if (field === "selectedServices" && Array.isArray(item[field])) {
          td.textContent = item[field].join(", ");
        } else {
          td.textContent = item[field] || "";
        }
        tr.appendChild(td);
      });
      if (editHandler && deleteHandler) {
        const actionsTd = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editHandler(item);
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteHandler(item.id);
        actionsTd.appendChild(editBtn);
        actionsTd.appendChild(deleteBtn);
        tr.appendChild(actionsTd);
      }
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(`Error loading ${endpoint}:`, error);
    alert(`Failed to load ${endpoint}. Check console for details.`);
  }
}

// Hàm mở modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "block";
}

// Hàm đóng modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "none";
}

// Quản lý Rooms
function loadRooms() {
  loadTable(
    "rooms",
    "roomsTable",
    ["id", "name", "type", "price", "status", "image"],
    (room) => {
      document.getElementById("roomId").value = room.id || "";
      document.getElementById("roomName").value = room.name || "";
      document.getElementById("roomType").value = room.type || "";
      document.getElementById("roomPrice").value = room.price || "";
      document.getElementById("roomStatus").value = room.status || "available";
      document.getElementById("roomImage").value = room.image || "";
      openModal("roomModal");
    },
    async (id) => {
      if (confirm("Are you sure you want to delete this room?")) {
        try {
          await fetch(`${API_URL}/rooms/${id}`, { method: "DELETE" });
          loadRooms();
          alert(`Đã xóa phòng có ID ${id}`);
        } catch (error) {
          console.error("Error deleting room:", error);
          alert("Failed to delete room. Check console for details.");
        }
      }
    }
  );
}

document.getElementById("roomForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("roomId").value;
  const data = {
    name: document.getElementById("roomName").value,
    type: document.getElementById("roomType").value,
    price: parseInt(document.getElementById("roomPrice").value) || 0,
    status: document.getElementById("roomStatus").value,
    image: document.getElementById("roomImage").value,
  };
  if (!data.name || !data.type || !data.price || !data.image) {
    alert("Please fill all required fields");
    return;
  }
  try {
    const method = id ? "PATCH" : "POST";
    const response = await fetch(`${API_URL}/rooms/${id || ""}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    loadRooms();
    closeModal("roomModal");
    alert(`Đã ${id ? "cập nhật" : "thêm mới"} phòng thành công!`);
  } catch (error) {
    console.error("Error saving room:", error);
    alert("Failed to save room. Check console for details.");
  }
});

document.getElementById("addRoomBtn")?.addEventListener("click", () => {
  document.getElementById("roomForm").reset();
  document.getElementById("roomId").value = "";
  openModal("roomModal");
});

document
  .getElementById("cancelRoomModalBtn")
  ?.addEventListener("click", () => closeModal("roomModal"));
document
  .getElementById("closeRoomModal")
  ?.addEventListener("click", () => closeModal("roomModal"));

// Quản lý Services
function loadServices() {
  loadTable(
    "services",
    "servicesTable",
    ["id", "name", "description", "price", "image"],
    (service) => {
      document.getElementById("serviceId").value = service.id || "";
      document.getElementById("serviceName").value = service.name || "";
      document.getElementById("serviceDescription").value =
        service.description || "";
      document.getElementById("servicePrice").value = service.price || "";
      document.getElementById("serviceImage").value = service.image || "";
      openModal("serviceModal");
    },
    async (id) => {
      if (confirm("Are you sure you want to delete this service?")) {
        try {
          await fetch(`${API_URL}/services/${id}`, { method: "DELETE" });
          loadServices();
          alert(`Đã xóa dịch vụ có ID ${id}`);
        } catch (error) {
          console.error("Error deleting service:", error);
          alert("Failed to delete service. Check console for details.");
        }
      }
    }
  );
}

document
  .getElementById("serviceForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("serviceId").value;
    const data = {
      name: document.getElementById("serviceName").value,
      description: document.getElementById("serviceDescription").value,
      price: parseInt(document.getElementById("servicePrice").value) || 0,
      image: document.getElementById("serviceImage").value,
    };
    if (!data.name || !data.description || !data.price || !data.image) {
      alert("Please fill all required fields");
      return;
    }
    try {
      const method = id ? "PATCH" : "POST";
      const response = await fetch(`${API_URL}/services/${id || ""}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      loadServices();
      closeModal("serviceModal");
      alert(`Đã ${id ? "cập nhật" : "thêm mới"} dịch vụ thành công!`);
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service. Check console for details.");
    }
  });

document.getElementById("addServiceBtn")?.addEventListener("click", () => {
  document.getElementById("serviceForm").reset();
  document.getElementById("serviceId").value = "";
  openModal("serviceModal");
});

document
  .getElementById("cancelServiceModalBtn")
  ?.addEventListener("click", () => closeModal("serviceModal"));
document
  .getElementById("closeServiceModal")
  ?.addEventListener("click", () => closeModal("serviceModal"));

// Quản lý Customers (read-only)
function loadCustomers() {
  loadTable("customers", "customersTable", ["id", "name", "phone", "email"]);
}

// Quản lý Bookings (read-only)
function loadBookings() {
  loadTable("bookings", "bookingsTable", [
    "id",
    "customerId",
    "roomId",
    "checkIn",
    "checkOut",
    "status",
    "selectedServices",
  ]);
}

// Load tất cả khi trang sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  loadRooms();
  loadServices();
  loadCustomers();
  loadBookings();
});
