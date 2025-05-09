const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
}

const map = L.map("map").setView([0, 0], `56`);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap",
}).addTo(map);

const markers = {};
socket.on("recieve-location",(data)=>{
    const {id,longitude,latitude} = data;
    map.setView([latitude,longitude])
    if(markers[id]){
        markers.setLatLng([latitude,longitude])
    }
    else{
        markers[id] = L.marker([latitude,longitude]).addTo(map)
    }
})
socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id]
    }
})