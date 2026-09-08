document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  const search = document.querySelector("#card-search");
  const filterButtons = document.querySelectorAll(".filter-button");
  const emptyState = document.querySelector("#empty-state");

  cards.forEach((cardElement) => {
    loadCard(cardElement, cardElement.dataset.cardName);
  });

  let activeFilter = "all";

  function updateFilters() {
    const query = (search?.value || "").trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const name = (card.dataset.cardName || "").toLowerCase();
      const typologies = (card.dataset.typologies || "").toLowerCase();

      const matchesSearch = !query || name.includes(query);
      const matchesFilter =
        activeFilter === "all" ||
        typologies.split("|").some((value) => value.trim() === activeFilter.toLowerCase());

      const show = matchesSearch && matchesFilter;
      card.hidden = !show;
      if (show) visible++;
    });

    if (emptyState) emptyState.hidden = visible !== 0;
  }

  search?.addEventListener("input", updateFilters);

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      updateFilters();
    });
  });
});

async function loadCard(cardElement, cardName) {
  const image = cardElement.querySelector("[data-card-image]");
  const loading = cardElement.querySelector(".card-loading");
  const links = cardElement.querySelectorAll("[data-scryfall-link]");

  try {
    const url =
      "https://api.scryfall.com/cards/named?exact=" +
      encodeURIComponent(cardName);

    const response = await fetch(url, {
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Scryfall returned HTTP ${response.status}`);
    }

    const card = await response.json();

    const imageUrl =
      card.image_uris?.normal ||
      card.card_faces?.[0]?.image_uris?.normal;

    if (!imageUrl) {
      throw new Error("No image URL was returned");
    }

    image.src = imageUrl;
    image.alt = card.name;

    links.forEach((link) => {
      link.href = card.scryfall_uri || link.href;
    });

    image.addEventListener("load", () => {
      loading?.remove();
    }, { once: true });

    image.addEventListener("error", () => {
      loading.textContent = "Image unavailable";
      loading.classList.add("error");
    }, { once: true });

  } catch (error) {
    console.error("Scryfall card loading failed:", cardName, error);
    loading.textContent = "Image unavailable";
    loading.classList.add("error");
  }
}
