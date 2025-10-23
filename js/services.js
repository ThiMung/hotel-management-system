// // Lấy dữ liệu dịch vụ từ JSON Server
// fetch("http://localhost:3000/services")
//   .then(response => response.json())
//   .then(data => {
//     const list = document.getElementById("serviceList");
//     list.innerHTML = data.map(svc => `
//       <div class="service-card">
//         <img src="${svc.image}" alt="${svc.name}">
//         <h3>${svc.name}</h3>
//         <p>${svc.description}</p>
//         <p><strong>Price:</strong> ${svc.price.toLocaleString()} VND</p>
//         <button onclick="addService('${svc.name}', ${svc.price})">Add Service</button>
//       </div>
//     `).join("");
//   })
//   .catch(() => {
//     document.getElementById("serviceList").innerHTML =
//       "<p>Cannot load services. Please start JSON Server!</p>";
//   });

// // Lưu dịch vụ đã chọn vào localStorage
// function addService(name, price) {
//   const selected = JSON.parse(localStorage.getItem("selectedServices")) || [];
//   selected.push({ name, price });
//   localStorage.setItem("selectedServices", JSON.stringify(selected));
//   alert(`${name} has been added to your booking.`);
// }

document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("serviceList");
  const msg = document.getElementById("msg");

  try {
    const response = await fetch("http://localhost:3000/services");
    if (!response.ok) throw new Error("Failed to load services");
    const services = await response.json();

    list.innerHTML = services
      .map(
        (svc) => `
      <div class="service-card">
        <img src="${svc.image}" alt="${
          svc.name
        }" onerror="this.src='https://via.placeholder.com/150'">
        <h3>${svc.name}</h3>
        <p>${svc.description || ""}</p>
        <p><strong>Price:</strong> ${svc.price.toLocaleString()} VND</p>
        <button onclick="addService('${svc.name}', ${
          svc.price
        })">Add Service</button>
      </div>
    `
      )
      .join("");
  } catch (error) {
    list.innerHTML = `<p style="color:red">Error loading services: ${error.message}</p>`;
    console.error(error);
  }

  window.addService = function (name, price) {
    const selected = JSON.parse(
      localStorage.getItem("selectedServices") || "[]"
    );
    const normalized = name.toLowerCase();

    if (selected.some((s) => s.name.toLowerCase() === normalized)) {
      showMsg(`${name} already added!`, "error");
    } else {
      selected.push({ name, price });
      localStorage.setItem("selectedServices", JSON.stringify(selected));
      showMsg(`${name} added to booking!`, "success");
    }
  };

  function showMsg(text, type) {
    msg.textContent = text;
    msg.className = type;
    setTimeout(() => {
      msg.textContent = "";
      msg.className = "";
    }, 2000);
  }
});
