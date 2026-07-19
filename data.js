const cityData = {
  budapest: {
    transport: {
      airport: {
        name: "Budapest Ferenc Liszt International Airport (BUD)",
        mapsQuery: "Budapest Ferenc Liszt International Airport",
        transit: {
          option: "Bus 100E express to Deák Ferenc tér (city centre)",
          duration: "~30 min",
          cost: "2,200 HUF (~€5.60)"
        },
        taxi: {
          cost: "7,500–9,000 HUF (~€19–23)",
          duration: "~25–30 min"
        }
      },
      station: {
        name: "Budapest Keleti (Eastern) railway station",
        mapsQuery: "Budapest Keleti railway station",
        transit: {
          option: "M2 metro (Deák Ferenc tér / city centre)",
          duration: "~10–15 min",
          cost: "450 HUF (~€1.15)"
        },
        taxi: {
          cost: "2,500–3,500 HUF (~€6–9)",
          duration: "~10 min"
        }
      }
    },
    transportTips: [
      "💳 Tap your contactless bank card straight on BKK validators on metro, bus, and tram — no ticket needed for single rides",
      "🎫 Single paper ticket: ~450 HUF — valid 80 min on metro, bus, tram, and trolley",
      "🗓️ 24-hour travel pass: ~2,500 HUF — unlimited BKK network",
      "📅 72-hour travel pass: ~5,500 HUF — best value for a long weekend",
      "📆 7-day pass: ~6,900 HUF — ideal if staying a full week"
    ],
    currency: "Hungarian forint (HUF)",
    currencyCode: "HUF",
    toEuroRate: 390,
    cardPayment: "Contactless cards are accepted almost everywhere — restaurants, shops, taxis, and transit. Keep a little HUF cash for markets, small family-run eateries, and thermal bath lockers.",
    climateNotes: "Continental climate: cold winters (Dec–Feb, avg −1°C to 4°C, occasional snow) and warm, sometimes hot summers (Jun–Aug, avg 20–28°C). Best months: May, June, and September for mild days and fewer crowds.",
    language: {
      name: "Hungarian",
      code: "hu",
      intro: "Hungarian is the official language — unlike most European tongues, it isn't Indo-European, so it can feel unfamiliar at first. English is common in hotels, restaurants, and tourist areas, but a few local phrases are always appreciated.",
      phrases: [
        ["Hello", "Szia", "SEE-ah"],
        ["Good day", "Jó napot", "yoh NAH-pot"],
        ["Goodbye", "Viszlát", "VEEZ-laht"],
        ["Please", "Kérem", "KAY-rem"],
        ["Thank you", "Köszönöm", "KUR-suh-nuhm"],
        ["Yes / No", "Igen / Nem", "EE-gen / nem"],
        ["Excuse me", "Elnézést", "EL-nay-zaysht"],
        ["How much is this?", "Mennyibe kerül?", "MEN-yi-beh KEH-rool"],
        ["Where is the bathroom?", "Hol a mosdó?", "hol uh MOSH-doh"],
        ["Cheers!", "Egészségedre!", "EH-gaysh-shay-ged-reh"]
      ]
    },
    sights: [
      ["Buda Castle", "4,900 HUF (~€12.50)"],
      ["Fisherman’s Bastion", "2,600 HUF (~€6.50)"],
      ["Széchenyi Thermal Baths", "~9,500 HUF (~€24)"],
      ["Heroes' Square", "Free"],
      ["St. Stephen’s Basilica", "Free (tower: 2,500 HUF / ~€6.50)"],
      ["Danube River Cruise", "from 4,500 HUF (~€11.50)"]
    ]
  },
  krakow: {
    transport: {
      airport: {
        name: "Kraków John Paul II International Airport (KRK)",
        mapsQuery: "Kraków John Paul II International Airport",
        transit: {
          option: "Train (SKA) to Kraków Główny, then tram or walk",
          duration: "~20 min train + ~10 min",
          cost: "17 PLN (~€4) train + 4 PLN (~€1) tram"
        },
        taxi: {
          cost: "80–100 PLN (~€18–23)",
          duration: "~25–30 min"
        }
      },
      station: {
        name: "Kraków Główny (main railway station)",
        mapsQuery: "Kraków Główny railway station",
        transit: {
          option: "Walk to Rynek Główny (Old Town) or tram 1/2/3",
          duration: "~10 min walk",
          cost: "Free on foot (tram: 4 PLN / ~€1)"
        },
        taxi: {
          cost: "15–25 PLN (~€3.50–6)",
          duration: "~5 min"
        }
      }
    },
    transportTips: [
      "💳 Some trams/buses have onboard contactless card readers, but coverage is patchy — safest to buy via the jakdojade or moBILET app, or a stop machine, before boarding",
      "🎫 Single ticket (MPK): ~4 PLN — 40 min on trams and buses",
      "🗓️ 24-hour ticket: ~17 PLN — unlimited city transport",
      "📅 48-hour ticket: ~28 PLN — good for a weekend",
      "📆 72-hour ticket: ~36 PLN — best for 3-day stays",
      "🏛️ Kraków City Card includes unlimited transport plus museum discounts"
    ],
    currency: "Polish złoty (PLN)",
    currencyCode: "PLN",
    toEuroRate: 4.4,
    cardPayment: "Cards are widely accepted in cafés, restaurants, and shops. Carry a little PLN cash for market stalls, milk bars (bary mleczne), and public restrooms.",
    climateNotes: "Continental climate with cold, often snowy winters (Dec–Feb, avg −3°C to 2°C) and warm summers (Jun–Aug, avg 18–25°C). Best months: May–June and September for pleasant temps and lighter crowds.",
    language: {
      name: "Polish",
      code: "pl",
      intro: "Polish is the national language. In Kraków's Old Town and at major sights, many staff speak English, though basic Polish helps in smaller shops, markets, and with older locals.",
      phrases: [
        ["Hello", "Cześć", "cheshch"],
        ["Good day", "Dzień dobry", "jen DOH-brih"],
        ["Goodbye", "Do widzenia", "do vee-DZEH-nyah"],
        ["Please", "Proszę", "PROH-sheh"],
        ["Thank you", "Dziękuję", "jehn-KOO-yeh"],
        ["Yes / No", "Tak / Nie", "tahk / nyeh"],
        ["Excuse me", "Przepraszam", "psheh-PRAH-shahm"],
        ["How much is this?", "Ile to kosztuje?", "EE-leh to kosh-TOO-yeh"],
        ["Where is the bathroom?", "Gdzie jest toaleta?", "gdjeh yest to-ah-LEH-tah"],
        ["Cheers!", "Na zdrowie!", "nah ZDROH-vyeh"]
      ]
    },
    sights: [
      ["Wawel Royal Castle", "100 PLN (~€23)"],
      ["St. Mary's Basilica tower climb", "30 PLN (~€7)"],
      ["Main Market Square", "Free"],
      ["Wieliczka Salt Mine", "130 PLN (~€30)"],
      ["Kazimierz Jewish District museum", "35 PLN (~€8)"],
      ["Ojców National Park entry", "15 PLN (~€3.50)"],
      ["Schindler's Factory", "25 PLN (~€6)"]
    ]
  },
  prague: {
    transport: {
      airport: {
        name: "Václav Havel Airport Prague (PRG)",
        mapsQuery: "Václav Havel Airport Prague",
        transit: {
          option: "Airport Express bus to Praha hlavní nádraží",
          duration: "~35 min",
          cost: "150 CZK (~€6)"
        },
        taxi: {
          cost: "600–800 CZK (~€24–32)",
          duration: "~25–35 min"
        }
      },
      station: {
        name: "Praha hlavní nádraží (Prague Main Station)",
        mapsQuery: "Praha hlavní nádraží",
        transit: {
          option: "Metro C to Muzeum, then A to Staroměstská (Old Town)",
          duration: "~10 min",
          cost: "40 CZK (~€1.60)"
        },
        taxi: {
          cost: "150–250 CZK (~€6–10)",
          duration: "~10 min"
        }
      }
    },
    transportTips: [
      "💳 Tap your contactless bank card directly on PID validators in metro, trams, and buses — fare is charged automatically, no ticket needed",
      "🎫 Single ticket (PID): ~40 CZK — 90 min on metro, tram, and bus",
      "🗓️ 24-hour pass: ~120 CZK — unlimited within Prague",
      "📆 72-hour pass: ~330 CZK — best for a long weekend",
      "📅 Lítačka monthly pass available if staying longer (requires registration)"
    ],
    currency: "Czech koruna (CZK)",
    currencyCode: "CZK",
    toEuroRate: 25,
    cardPayment: "Card payment (including contactless) is standard across the city. A little CZK cash is handy for market stalls, public toilets, and some older pubs.",
    climateNotes: "Continental climate: cold winters (Dec–Feb, avg −2°C to 4°C) and mild-to-warm summers (Jun–Aug, avg 18–24°C). Best months: April–May and September–October for mild weather and thinner crowds.",
    language: {
      name: "Czech",
      code: "cs",
      intro: "Czech is the official language. Prague is very tourist-friendly — English is widely spoken in the centre, hotels, and restaurants — but greetings and thank-yous in Czech go a long way.",
      phrases: [
        ["Hello", "Ahoj", "AH-hoy"],
        ["Good day", "Dobrý den", "DOH-bree den"],
        ["Goodbye", "Na shledanou", "nah SKHLEH-dah-noh"],
        ["Please", "Prosím", "PRO-seem"],
        ["Thank you", "Děkuji", "DYEH-koo-yee"],
        ["Yes / No", "Ano / Ne", "AH-noh / neh"],
        ["Excuse me", "Promiňte", "PROH-min-teh"],
        ["How much is this?", "Kolik to stojí?", "KOH-leek toh STOH-yee"],
        ["Where is the bathroom?", "Kde je záchod?", "gdeh yeh ZAH-khot"],
        ["Cheers!", "Na zdraví!", "nah ZDRAH-vee"]
      ]
    },
    sights: [
      ["Prague Castle", "250 CZK (~€10, tourist pass available)"],
      ["St. Vitus Cathedral", "50 CZK (~€2)"],
      ["Charles Bridge sunrise area", "Free"],
      ["Lennon Wall area", "Free"],
      ["Astronomical Clock tower entry", "250 CZK (~€10)"],
      ["Petřín funicular + tower", "220 CZK (~€9)"],
      ["National Museum", "250 CZK (~€10)"]
    ]
  },
  vienna: {
    transport: {
      airport: {
        name: "Vienna International Airport (VIE)",
        mapsQuery: "Vienna International Airport",
        transit: {
          option: "S7 suburban train to Wien Mitte / Landstraße (city centre)",
          duration: "~25 min",
          cost: "4.50 EUR (zone ticket)"
        },
        taxi: {
          cost: "36–45 EUR (fixed airport rate)",
          duration: "~20–25 min"
        }
      },
      station: {
        name: "Wien Hauptbahnhof (main railway station)",
        mapsQuery: "Wien Hauptbahnhof",
        transit: {
          option: "U1 metro to Stephansplatz (Innere Stadt)",
          duration: "~8 min",
          cost: "2.40 EUR (single ticket)"
        },
        taxi: {
          cost: "12–18 EUR",
          duration: "~10 min"
        }
      }
    },
    transportTips: [
      "🎫 No contactless tap-to-pay on Wiener Linien yet — buy tickets in advance from machines, the WienMobil app, or a Tabak (tobacco) shop before boarding",
      "🎟️ Single ticket (Wiener Linien): ~2.40 EUR — valid 90 min in one direction",
      "🗓️ 24-hour pass: ~8.90 EUR — unlimited metro, tram, and bus",
      "📅 48-hour pass: ~15.30 EUR — good for a weekend",
      "📆 72-hour pass: ~19.90 EUR — best for 3-day visits",
      "🗺️ Weekly pass: ~19.20 EUR — ideal for a full week (Mon–Mon)"
    ],
    currency: "Euro (EUR)",
    currencyCode: "EUR",
    toEuroRate: 1,
    cardPayment: "Cards (including contactless) are accepted almost everywhere, even for small purchases. Keep a little cash for markets like Naschmarkt and some traditional Heurigen wine taverns.",
    climateNotes: "Continental climate: cold winters (Dec–Feb, avg −1°C to 4°C) and warm summers (Jun–Aug, avg 19–26°C). Best months: April–May and September–October for comfortable sightseeing weather.",
    language: {
      name: "German",
      code: "de",
      intro: "Austrian German is the everyday language, with local phrases like \"Grüß Gott\" instead of plain \"Hallo.\" English is common in the city centre and at major sights, though German is still the default in smaller cafés and off the main tourist routes.",
      phrases: [
        ["Hello", "Grüß Gott / Hallo", "grewss got / HAH-loh"],
        ["Good day", "Guten Tag", "GOO-ten tahk"],
        ["Goodbye", "Auf Wiedersehen", "owf VEE-der-zayn"],
        ["Please", "Bitte", "BIT-teh"],
        ["Thank you", "Danke", "DAHN-keh"],
        ["Yes / No", "Ja / Nein", "yah / nine"],
        ["Excuse me", "Entschuldigung", "ent-SHOOL-dee-goong"],
        ["How much is this?", "Wie viel kostet das?", "vee feel KOS-tet dahs"],
        ["Where is the bathroom?", "Wo ist die Toilette?", "voh ist dee twah-LET-teh"],
        ["Cheers!", "Prost!", "prohst"]
      ]
    },
    sights: [
      ["Schönbrunn Palace gardens", "Free"],
      ["Schönbrunn Palace (interior passes)", "30–81 EUR"],
      ["Belvedere Palace", "17 EUR"],
      ["Hofburg courtyards", "Free"],
      ["Hofburg (museum & attraction passes)", "16–26 EUR"],
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
