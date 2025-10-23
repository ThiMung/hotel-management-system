
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
        <img src="${svc.image || 'https://via.placeholder.com/150'}" alt="${svc.name}">
        <h4>${svc.name}</h4>
        ${svc.description ? `<p class="description">${svc.description}</p>` : ''}
        ${svc.price ? `<p class="price"><strong>Price:</strong> ${Number(svc.price).toLocaleString()} VND</p>` : '<p class="price"><strong>Price:</strong> Not specified</p>'}
        <button onclick="addService('${svc.name.replace(/'/g, "\\'")}', ${svc.price || 0})">Add Service</button>
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
