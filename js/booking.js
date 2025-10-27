document.addEventListener("DOMContentLoaded", () => {
  const roomSelect = document.getElementById("roomSelect");
  const roomQuantity = document.getElementById("roomQuantity");
  const serviceCheckboxes = document.querySelectorAll('.services input[type="checkbox"]');
  const selectedServicesList = document.getElementById("selectedServices");
  const serviceTotal = document.getElementById("serviceTotal");
  const msg = document.getElementById("msg");
  const form = document.getElementById("bookingForm");

  const roomPrices = {
    single: 600000,
    double: 1000000,
    family: 1600000,
    vip: 2800000,
  };

  // Tự động chọn phòng từ URL nếu có
  const urlParams = new URLSearchParams(window.location.search);
  const roomFromUrl = urlParams.get("room");
  if (roomFromUrl && ["single", "double", "family", "vip"].includes(roomFromUrl)) {
    roomSelect.value = roomFromUrl;
  }

  // Đồng bộ từ localStorage (giữ dịch vụ đã chọn)
  function syncFromStorage() {
    const stored = JSON.parse(localStorage.getItem("selectedServices") || "[]");
    serviceCheckboxes.forEach((cb) => {
      cb.checked = stored.some((s) => s.name.toLowerCase() === cb.value);
    });
    updateTotal();
  }

  // Cập nhật tổng và danh sách dịch vụ
  function updateTotal() {
    const selected = Array.from(serviceCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => ({
        name: cb.value.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()),
        price: parseInt(cb.getAttribute("data-price")),
      }));

    localStorage.setItem("selectedServices", JSON.stringify(selected));

    const checkIn = new Date(document.getElementById("checkIn").value || Date.now());
    const checkOut = new Date(document.getElementById("checkOut").value || Date.now());
    const days = checkOut > checkIn ? Math.ceil((checkOut - checkIn) / 86400000) : 1;

    let total = 0;
    const roomType = roomSelect.value;
    const qty = parseInt(roomQuantity.value) || 1;
    if (roomType && roomPrices[roomType]) total += roomPrices[roomType] * qty * days;
    selected.forEach((s) => (total += s.price));

    selectedServicesList.innerHTML = selected.length
      ? selected
          .map(
            (s, i) =>
              `<li>${s.name} - ${s.price.toLocaleString()} VND 
              <button type="button" onclick="removeService(${i})">x</button></li>`
          )
          .join("")
      : "<li>No services selected.</li>";

    serviceTotal.textContent = total.toLocaleString();
  }

  // Xóa 1 dịch vụ
  window.removeService = function (index) {
    const selected = JSON.parse(localStorage.getItem("selectedServices") || "[]");
    const nameToRemove = selected[index].name.toLowerCase();
    serviceCheckboxes.forEach((cb) => {
      if (cb.value === nameToRemove) cb.checked = false;
    });
    updateTotal();
  };

  // Thông báo
  function showMsg(text, type) {
    msg.textContent = text;
    msg.className = type;
    setTimeout(() => {
      msg.textContent = "";
      msg.className = "";
    }, 3000);
  }

// Xử lý khi submit form - SỬA LẠI
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;
  const today = new Date().toISOString().split("T")[0];

  if (!roomSelect.value) return showMsg("Please select a room.", "error");
  if (checkIn < today) return showMsg("Check-in cannot be in the past.", "error");
  if (checkOut <= checkIn) return showMsg("Check-out must be after check-in.", "error");

  // TÍNH TOÁN LẠI TOTAL
  const selectedServices = JSON.parse(localStorage.getItem("selectedServices") || "[]");
  const roomType = roomSelect.value;
  const qty = parseInt(roomQuantity.value) || 1;
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const days = Math.ceil((checkOutDate - checkInDate) / 86400000) || 1;
  
  let total = roomPrices[roomType] * qty * days;
  selectedServices.forEach(s => total += s.price);

  const bookingInfo = {
    name: document.getElementById("customerName").value,
    phone: document.getElementById("customerPhone").value,
    roomType: roomType,
    quantity: qty,
    checkIn: checkIn,
    checkOut: checkOut,
    services: selectedServices,
    total: total
  };

  console.log("Saving booking data:", bookingInfo);
  
  // LƯU VÀ CHUYỂN TRANG
  localStorage.setItem("lastBooking", JSON.stringify(bookingInfo));
  
  // THÊM DELAY ĐỂ ĐẢM BẢO DỮ LIỆU ĐƯỢC LƯU
  setTimeout(() => {
    console.log("Redirecting to booking-success.html");
    window.location.href = "booking-success.html";
  }, 100);
});


  // Gắn sự kiện khi thay đổi input
  [roomSelect, roomQuantity, document.getElementById("checkIn"), document.getElementById("checkOut")]
    .forEach((el) => el?.addEventListener("change", updateTotal));
  serviceCheckboxes.forEach((cb) => cb.addEventListener("change", updateTotal));

  // Khởi chạy ban đầu
  syncFromStorage();
});
