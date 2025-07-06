// Example starter JavaScript for disabling form submissions if there are invalid fields
let button;

let beforeTaxPrice = document.querySelectorAll(".before-tax-price");
let afterTaxPrice = document.querySelectorAll(".after-tax-price");
let taxSwitch = document.querySelector(".form-check-input");
taxSwitch.addEventListener("click", (event) => {
  if (!button) {
    button = true;
    for (let el of afterTaxPrice) {
      el.setAttribute("class", "tax-price-show");
    };
    for (let el of beforeTaxPrice) {
      el.setAttribute("class", "tax-price-hide");
    }

  } else {
    button = false;
    for (let el of afterTaxPrice) {
      el.setAttribute("class", "tax-price-hide");
    };
    for (let el of beforeTaxPrice) {
      el.setAttribute("class", "tax-price-show");
    }

  };
});




(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


//map logic
// Get location name from backend
const locationName = newLocationName;

// Use Nominatim API (Free OpenStreetMap Geocoding service)
const url = `https://nominatim.openstreetmap.org/search?format=json&q=${locationName}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.length === 0) {
      alert("Location not found!");
      return;
    }

    const lat = data[0].lat;
    const lon = data[0].lon;

    // Init map
    const map = L.map('map').setView([lat, lon], 10);

    // Add tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add marker
    L.marker([lat, lon]).addTo(map)
      .bindPopup(`${locationName}`)
      .openPopup();
  })
  .catch(err => {
    console.error("Geocoding error:", err);
  });



