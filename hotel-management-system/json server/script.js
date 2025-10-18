const API = "http://127.0.0.1:3001";

async function loadRooms(){
  const el = document.getElementById('rooms');
  try{
    const res = await fetch(`${API}/rooms`);
    const rooms = await res.json();
    el.innerHTML = rooms.map(r => `
      <div>
        <h3>${r.name} (${r.type})</h3>
        <p>Price: ${r.price.toLocaleString()} VND — Status: ${r.status}</p>
      </div>
    `).join('');
  }catch(err){
    el.textContent = 'Failed to load';
    console.error(err);
  }
}

loadRooms();