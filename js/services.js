// Lấy dữ liệu dịch vụ từ JSON Server
fetch("http://localhost:3000/services")
  .then(response => response.json())
  .then(data => {
    const list = document.getElementById("serviceList");
    list.innerHTML = data.map(svc => `
      <div class="service-card">
        <img src="${svc.image}" alt="${svc.name}">
        <h3>${svc.name}</h3>
        <p>${svc.description}</p>
        <p><strong>Price:</strong> ${svc.price.toLocaleString()} VND</p>
        <button onclick="addService('${svc.name}', ${svc.price})">Add Service</button>
      </div>
    `).join("");
  })
  .catch(() => {
    document.getElementById("serviceList").innerHTML =
      "<p>Cannot load services. Please start JSON Server!</p>";
  });

// Lưu dịch vụ đã chọn vào localStorage
function addService(name, price) {
  const selected = JSON.parse(localStorage.getItem("selectedServices")) || [];
  selected.push({ name, price });
  localStorage.setItem("selectedServices", JSON.stringify(selected));
  alert(`${name} has been added to your booking.`);
}