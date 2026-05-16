const syncHotelDateEmptyState = (input) => {
  if (!input || input.type !== "date") return;
  input.classList.toggle("is-empty", !input.value);
};

const syncHotelDateBounds = (city) => {
  const checkIn = document.getElementById(`checkIn-${city}`);
  const checkOut = document.getElementById(`checkOut-${city}`);
  if (!checkIn || !checkOut) return;

  syncHotelDateEmptyState(checkIn);
  syncHotelDateEmptyState(checkOut);

  if (checkIn.value) {
    checkOut.min = checkIn.value;
    if (checkOut.value && checkOut.value < checkIn.value) {
      checkOut.value = checkIn.value;
    }
  } else {
    checkOut.removeAttribute("min");
  }
};
const formatPhotonAddress = (props) => {
  const streetLine = [props.housenumber, props.street].filter(Boolean).join(" ");
  const locality = [props.postcode, props.city || props.district, props.country].filter(Boolean).join(", ");
  return [streetLine, locality].filter(Boolean).join(", ");
};

const hotelSuggestTimers = {};

const clearHotelSuggestions = (city) => {
  const list = document.getElementById(`hotelSuggest-${city}`);
  if (list) list.innerHTML = "";
};

const applyHotelSuggestion = (city, name, address) => {
  const nameField = document.getElementById(`hotelName-${city}`);
  const addressField = document.getElementById(`hotelAddress-${city}`);
  if (nameField) nameField.value = name;
  if (addressField) addressField.value = address;
  clearHotelSuggestions(city);
  updateHotelMap(city);
  savePlan(city);
};

const fetchHotelSuggestions = async (city, query) => {
  const list = document.getElementById(`hotelSuggest-${city}`);
  if (!list) return;

  const cityLabel = cityMapDefaults[city] || city;
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(`${query} hotel ${cityLabel}`)}&limit=6&lang=en`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const allFeatures = data.features || [];
    const preferred = allFeatures.filter((feature) => {
      const props = feature.properties || {};
      const osmValue = props.osm_value || "";
      return osmValue === "hotel" || /hotel/i.test(props.name || "");
    });
    const features = preferred.length ? preferred : allFeatures;

    list.innerHTML = "";
    if (!features.length) return;

    features.slice(0, 5).forEach((feature) => {
      const props = feature.properties || {};
      const name = props.name || query;
      const address = formatPhotonAddress(props);
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = `<span class="hotel-suggest-name">${name}</span>${address ? `<span class="hotel-suggest-addr">${address}</span>` : ""}`;
      button.addEventListener("click", () => applyHotelSuggestion(city, name, address));
      li.appendChild(button);
      list.appendChild(li);
    });
  } catch (error) {
    list.innerHTML = "";
  }
};

const setupHotelDates = () => {
  Object.keys(cityData).forEach((city) => {
    const checkIn = document.getElementById(`checkIn-${city}`);
    const checkOut = document.getElementById(`checkOut-${city}`);
    if (!checkIn || !checkOut) return;

    checkIn.addEventListener("change", () => syncHotelDateBounds(city));
    checkOut.addEventListener("change", () => syncHotelDateBounds(city));
    checkIn.addEventListener("input", () => syncHotelDateBounds(city));
    checkOut.addEventListener("input", () => syncHotelDateBounds(city));
    syncHotelDateBounds(city);
  });
};

const setupHotelAutocomplete = () => {
  document.querySelectorAll(".hotel-name-field").forEach((input) => {
    const city = input.dataset.city;

    input.addEventListener("input", () => {
      const query = input.value.trim();
      clearTimeout(hotelSuggestTimers[city]);
      if (query.length < 3) {
        clearHotelSuggestions(city);
        return;
      }
      hotelSuggestTimers[city] = setTimeout(() => fetchHotelSuggestions(city, query), 320);
    });

    input.addEventListener("blur", () => {
      setTimeout(() => clearHotelSuggestions(city), 180);
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".hotel-field-wrap")) return;
    Object.keys(cityData).forEach(clearHotelSuggestions);
  });
};

const mapsEmbedUrl = (query) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

const hotelMapQuery = (city) => {
  const address = document.getElementById(`hotelAddress-${city}`)?.value.trim();
  const hotelName = document.getElementById(`hotelName-${city}`)?.value.trim();
  if (address) {
    return hotelName ? `${hotelName}, ${address}` : address;
  }
  return cityMapDefaults[city] || city;
};

const updateHotelMap = (city) => {
  const iframe = document.getElementById(`hotelMap-${city}`);
  if (!iframe) return;
  const nextSrc = mapsEmbedUrl(hotelMapQuery(city));
  if (iframe.getAttribute("src") !== nextSrc) {
    iframe.setAttribute("src", nextSrc);
  }
};
