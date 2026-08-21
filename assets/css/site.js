document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll("[data-card-name]");

  cards.forEach((cardElement, index) => {
    const cardName = cardElement.dataset.cardName;

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
      throw new Error(`Scryfall returned ${response.status}`);
    }

    const card = await response.json();

    /*
     * Scryfall normally provides image_uris for regular cards.
     * Some layouts, such as double-faced cards, store the image
     * on the individual card faces instead.
     */

    let imageUrl = null;

    if (card.image_uris) {
      imageUrl = card.image_uris.normal;
    } else if (
      card.card_faces &&
      card.card_faces[0] &&
      card.card_faces[0].image_uris
    ) {
      imageUrl = card.card_faces[0].image_uris.normal;
    }

    if (!imageUrl) {
      throw new Error("No card image was provided by Scryfall");
    }

    image.src = imageUrl;

    image.alt = card.name;

    /*
     * Use Scryfall's canonical card URL rather than
     * constructing one ourselves.
     */

    links.forEach((link) => {
      link.href = card.scryfall_uri;
    });

    image.addEventListener("load", () => {
      loading.remove();
    });

    image.addEventListener("error", () => {
      loading.textContent = "Unable to load card image";
    });

  } catch (error) {

    console.error(
      `Could not load Scryfall data for ${cardName}:`,
      error
    );

    loading.textContent = "Card image unavailable";
  }
}
