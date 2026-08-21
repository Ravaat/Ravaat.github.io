document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll("[data-card-name]");

  cards.forEach((cardElement, index) => {
    const cardName = cardElement.dataset.cardName;

    /*
     * Scryfall asks clients to avoid making huge bursts of requests.
     * Staggering requests slightly keeps the page friendly to the API.
     */
    setTimeout(() => {
      loadCard(cardElement, cardName);
    }, index * 100);
  });
});


async function loadCard(cardElement, cardName) {
  const image = cardElement.querySelector("[data-card-image]");
  const links = cardElement.querySelectorAll("[data-scryfall-link]");
  const loading = cardElement.querySelector(".card-loading");

  const apiUrl =
    "https://api.scryfall.com/cards/named?exact=" +
    encodeURIComponent(cardName);

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Scryfall request failed");
    }

    const card = await response.json();

    image.src = card.image_uris.normal;
    image.alt = card.name;

    links.forEach((link) => {
      link.href = card.scryfall_uri;
    });

    image.addEventListener("load", () => {
      loading.remove();
    });

  } catch (error) {
    console.error(
      `Could not load Scryfall data for ${cardName}:`,
      error
    );

    loading.textContent = "Card image unavailable";
  }
}
