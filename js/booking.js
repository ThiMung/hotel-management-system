// // Hiển thị phòng đã chọn
// const selectedRoom = localStorage.getItem("selectedRoom") || "No room selected";
// document.getElementById("roomName").value = selectedRoom;

// // Hiển thị dịch vụ đã chọn
// const selected = JSON.parse(localStorage.getItem("selectedServices")) || [];
// const list = document.getElementById("selectedServices");
// const total = document.getElementById("serviceTotal");

// if (selected.length > 0) {
//   let totalPrice = 0;
//   list.innerHTML = selected.map((svc, i) => {
//       totalPrice += svc.price;
//       return `<li>${svc.name} - ${svc.price.toLocaleString()} VND
//               <button onclick="removeService(${i})">x</button></li>`;
//     })
//     .join("");
//   total.textContent = totalPrice.toLocaleString();
// } else {
//   list.innerHTML = "<li>No extra services selected.</li>";
// }

// // Xóa dịch vụ
// function removeService(index) {
//   const updated = JSON.parse(localStorage.getItem("selectedServices")) || [];
//   updated.splice(index, 1);
//   localStorage.setItem("selectedServices", JSON.stringify(updated));
//   location.reload();
// }

// // Gửi đặt phòng
// document.getElementById("bookingForm").addEventListener("submit", (e) => {
//   e.preventDefault();
//   document.getElementById("msg").textContent = "Booking confirmed successfully!";
//   localStorage.clear();
// });

document.addEventListener("DOMContentLoaded", () => {
  const roomSelect = document.getElementById("roomSelect");
  const roomQuantity = document.getElementById("roomQuantity");
  const serviceCheckboxes = document.querySelectorAll(
    '.services input[type="checkbox"]'
  );
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

  // Tự động chọn phòng từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const roomFromUrl = urlParams.get("room");
  if (
    roomFromUrl &&
    ["single", "double", "family", "vip"].includes(roomFromUrl)
  ) {
    roomSelect.value = roomFromUrl;
  }

  // Đồng bộ từ localStorage
  function syncFromStorage() {
    const stored = JSON.parse(localStorage.getItem("selectedServices") || "[]");
    serviceCheckboxes.forEach((cb) => {
      cb.checked = stored.some((s) => s.name.toLowerCase() === cb.value);
    });
    updateTotal();
  }

  // Cập nhật tổng + danh sách
  function updateTotal() {
    const selected = Array.from(serviceCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => ({
        name: cb.value.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()),
        price: parseInt(cb.getAttribute("data-price")),
      }));

    localStorage.setItem("selectedServices", JSON.stringify(selected));

    const checkIn = new Date(
      document.getElementById("checkIn").value || Date.now()
    );
    const checkOut = new Date(
      document.getElementById("checkOut").value || Date.now()
    );
    const days =
      checkOut > checkIn ? Math.ceil((checkOut - checkIn) / 86400000) : 1;

    let total = 0;
    const roomType = roomSelect.value;
    const qty = parseInt(roomQuantity.value) || 1;
    if (roomType && roomPrices[roomType])
      total += roomPrices[roomType] * qty * days;
    selected.forEach((s) => (total += s.price));

    selectedServicesList.innerHTML = selected.length
      ? selected
          .map(
            (s, i) =>
              `<li>${
                s.name
              } - ${s.price.toLocaleString()} VND <button type="button" onclick="removeService(${i})">x</button></li>`
          )
          .join("")
      : "<li>No services selected.</li>";

    serviceTotal.textContent = total.toLocaleString();
  }

  window.removeService = function (index) {
    const selected = JSON.parse(
      localStorage.getItem("selectedServices") || "[]"
    );
    const nameToRemove = selected[index].name.toLowerCase();
    serviceCheckboxes.forEach((cb) => {
      if (cb.value === nameToRemove) cb.checked = false;
    });
    updateTotal();
  };

  // Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;
    const today = new Date().toISOString().split("T")[0];

    if (!roomSelect.value) return showMsg("Please select a room.", "error");
    if (checkIn < today)
      return showMsg("Check-in cannot be in the past.", "error");
    if (checkOut <= checkIn)
      return showMsg("Check-out must be after check-in.", "error");

    showMsg(
      `Booking confirmed! Total: ${serviceTotal.textContent} VND`,
      "success"
    );
    localStorage.removeItem("selectedServices");
    setTimeout(() => form.reset(), 1000);
    updateTotal();
  });

  function showMsg(text, type) {
    msg.textContent = text;
    msg.className = type;
    setTimeout(() => {
      msg.textContent = "";
      msg.className = "";
    }, 3000);
  }

  // Gắn sự kiện
  [
    roomSelect,
    roomQuantity,
    document.getElementById("checkIn"),
    document.getElementById("checkOut"),
  ].forEach((el) => el?.addEventListener("change", updateTotal));
  serviceCheckboxes.forEach((cb) => cb.addEventListener("change", updateTotal));

  // Khởi chạy
  syncFromStorage();
});
