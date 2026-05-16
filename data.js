const cityData = {
  budapest: {
    transport: {
      airport: {
        name: "Budapest Ferenc Liszt International Airport (BUD)",
        mapsQuery: "Budapest Ferenc Liszt International Airport"
      },
      station: {
        name: "Budapest Keleti (Eastern) railway station",
        mapsQuery: "Budapest Keleti railway station"
      }
    },
    currency: "Hungarian forint (HUF)",
    currencyCode: "HUF",
    toEuroRate: 390,
    sights: [
      ["Buda Castle", "4,900 HUF (~€12.50)"],
      ["Fisherman’s Bastion", "2,600 HUF"],
      ["Parliament Building Guided Tour", "6,900 HUF"],
      ["Gellért Baths (entry + locker)", "10,000 HUF"],
      ["Heroes' Square", "Free"],
      ["Budapest Zoo Aquarium", "8,290 HUF"],
      ["City Park Ice Cream & view spots", "Free"]
    ]
  },
  krakow: {
    transport: {
      airport: {
        name: "Kraków John Paul II International Airport (KRK)",
        mapsQuery: "Kraków John Paul II International Airport"
      },
      station: {
        name: "Kraków Główny (main railway station)",
        mapsQuery: "Kraków Główny railway station"
      }
    },
    currency: "Polish złoty (PLN)",
    currencyCode: "PLN",
    toEuroRate: 4.4,
    sights: [
      ["Wawel Royal Castle", "100 PLN"],
      ["St. Mary's Basilica tower climb", "30 PLN"],
      ["Main Market Square", "Free"],
      ["Wieliczka Salt Mine", "130 PLN"],
      ["Kazimierz Jewish District museum", "35 PLN"],
      ["Ojców National Park entry", "15 PLN"],
      ["Schindler's Factory", "25 PLN"]
    ]
  },
  prague: {
    transport: {
      airport: {
        name: "Václav Havel Airport Prague (PRG)",
        mapsQuery: "Václav Havel Airport Prague"
      },
      station: {
        name: "Praha hlavní nádraží (Prague Main Station)",
        mapsQuery: "Praha hlavní nádraží"
      }
    },
    currency: "Czech koruna (CZK)",
    currencyCode: "CZK",
    toEuroRate: 25,
    sights: [
      ["Prague Castle", "250 CZK (tourist pass available)"],
      ["St. Vitus Cathedral", "50 CZK"],
      ["Charles Bridge sunrise area", "Free"],
      ["Lennon Wall area", "Free"],
      ["Astronomical Clock tower entry", "250 CZK"],
      ["Petřín funicular + tower", "220 CZK"],
      ["National Museum", "250 CZK"]
    ]
  },
  vienna: {
    transport: {
      airport: {
        name: "Vienna International Airport (VIE)",
        mapsQuery: "Vienna International Airport"
      },
      station: {
        name: "Wien Hauptbahnhof (main railway station)",
        mapsQuery: "Wien Hauptbahnhof"
      }
    },
    currency: "Euro (EUR)",
    currencyCode: "EUR",
    toEuroRate: 1,
    sights: [
      ["Schönbrunn Palace", "22 EUR (Grand Entrance)"],
      ["Belvedere Palace", "17 EUR"],
      ["Hofburg Palace", "22 EUR (selected areas)"],
      ["Schmetterling (butterfly house)", "19 EUR"],
      ["Vienna State Opera guided tour", "12 EUR"],
      ["Prater park rides (wheel combo)", "13 EUR"],
      ["St. Stephen's Cathedral", "6 EUR"],
    ]
  }
};
const cityCatalog = {
  budapest: { label: "Budapest", country: "Hungary", tabLabel: "Budapest" },
  krakow: { label: "Krakow", country: "Poland", tabLabel: "Krakow" },
  prague: { label: "Prague", country: "Czechia", tabLabel: "Prague" },
  vienna: { label: "Vienna", country: "Austria", tabLabel: "Vienna" },
};

const allCities = Object.keys(cityCatalog);
const cityCoords = {
  budapest: { lat: 47.4979, lon: 19.0402, tz: "Europe/Budapest" },
  krakow:   { lat: 50.0647, lon: 19.9450, tz: "Europe/Warsaw" },
  prague:   { lat: 50.0755, lon: 14.4378, tz: "Europe/Prague" },
  vienna:   { lat: 48.2082, lon: 16.3738, tz: "Europe/Vienna" },
};

const cityMapDefaults = {
  budapest: "Budapest, Hungary",
  krakow: "Krakow, Poland",
  prague: "Prague, Czech Republic",
  vienna: "Vienna, Austria",
};
