const renderPhrasebook = () => {
  Object.entries(cityData).forEach(([city, cityInfo]) => {
    const language = cityInfo.language;
    if (!language) return;

    const introNode = document.getElementById(`languageIntro-${city}`);
    if (introNode && language.intro) introNode.textContent = language.intro;

    const body = document.getElementById(`phrases-${city}`);
    if (!body) return;
    body.innerHTML = "";

    language.phrases.forEach(([english, local, say]) => {
      const row = document.createElement("tr");
      const enCell = document.createElement("td");
      const localCell = document.createElement("td");
      const sayCell = document.createElement("td");
      enCell.textContent = english;
      localCell.textContent = local;
      sayCell.textContent = say;
      sayCell.className = "phrase-say";
      row.appendChild(enCell);
      row.appendChild(localCell);
      row.appendChild(sayCell);
      body.appendChild(row);
    });
  });
};

const translatorState = {};

const getTranslatorState = (city) => {
  if (!translatorState[city]) {
    translatorState[city] = { reversed: false };
  }
  return translatorState[city];
};

const updateTranslatorLabels = (city) => {
  const language = cityData[city]?.language;
  if (!language) return;
  const state = getTranslatorState(city);

  const fromLabel = document.getElementById(`translateFromLabel-${city}`);
  const toLabel = document.getElementById(`translateToLabel-${city}`);
  const input = document.getElementById(`translateInput-${city}`);
  const swapBtn = document.getElementById(`translateSwap-${city}`);

  const fromName = state.reversed ? language.name : "English";
  const toName = state.reversed ? "English" : language.name;

  if (fromLabel) fromLabel.textContent = fromName;
  if (toLabel) toLabel.textContent = toName;
  if (input) input.placeholder = `Type a word or phrase in ${fromName}…`;
  if (swapBtn) swapBtn.setAttribute("aria-label", `Swap to translate from ${toName}`);
};

const runTranslation = async (city) => {
  const language = cityData[city]?.language;
  const input = document.getElementById(`translateInput-${city}`);
  const output = document.getElementById(`translateOutput-${city}`);
  if (!language || !input || !output) return;

  const text = input.value.trim();
  if (!text) {
    output.textContent = "";
    output.classList.remove("has-result", "is-error");
    return;
  }

  const state = getTranslatorState(city);
  const langpair = state.reversed ? `${language.code}|en` : `en|${language.code}`;

  output.textContent = "Translating…";
  output.classList.remove("has-result", "is-error");

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    if (!translated) throw new Error("No translation returned");
    output.textContent = translated;
    output.classList.add("has-result");
  } catch (error) {
    output.textContent = "Translation unavailable right now — try again in a moment.";
    output.classList.add("is-error");
  }
};

const setupTranslators = () => {
  Object.keys(cityData).forEach((city) => {
    if (!cityData[city].language) return;
    updateTranslatorLabels(city);

    const form = document.getElementById(`translateForm-${city}`);
    const swapBtn = document.getElementById(`translateSwap-${city}`);
    const input = document.getElementById(`translateInput-${city}`);

    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        runTranslation(city);
      });
    }

    if (swapBtn) {
      swapBtn.addEventListener("click", () => {
        const state = getTranslatorState(city);
        state.reversed = !state.reversed;
        updateTranslatorLabels(city);
        const output = document.getElementById(`translateOutput-${city}`);
        if (input) input.value = "";
        if (output) {
          output.textContent = "";
          output.classList.remove("has-result", "is-error");
        }
      });
    }
  });
};

renderPhrasebook();
setupTranslators();
