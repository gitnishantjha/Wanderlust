
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 8// starting zoom
});
const marker= new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates) //ye wo co-ordin ates hain jo listing create krne ke time hmne bheje the
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${listing.title}</h4><p>Exact location will be  after booking<p>`))
.addTo(map);

