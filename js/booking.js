// Hiển thị phòng đã chọn
const selectedRoom = localStorage.getItem("selectedRoom") || "No room selected";
document.getElementById("roomName").value = selectedRoom;

// Hiển thị dịch vụ đã chọn
const selected = JSON.parse(localStorage.getItem("selectedServices")) || [];
const list = document.getElementById("selectedServices");
const total = document.getElementById("serviceTotal");

if (selected.length > 0) {
  let totalPrice = 0;
  list.innerHTML = selected.map((svc, i) => {
      totalPrice += svc.price;
      return `<li>${svc.name} - ${svc.price.toLocaleString()} VND 
              <button onclick="removeService(${i})">x</button></li>`;
    })
    .join("");
  total.textContent = totalPrice.toLocaleString();
} else {
  list.innerHTML = "<li>No extra services selected.</li>";
}

// Xóa dịch vụ
function removeService(index) {
  const updated = JSON.parse(localStorage.getItem("selectedServices")) || [];
  updated.splice(index, 1);
  localStorage.setItem("selectedServices", JSON.stringify(updated));
  location.reload();
}

// Gửi đặt phòng
document.getElementById("bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("msg").textContent = "Booking confirmed successfully!";
  localStorage.clear();
});