document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll("[data-card-name]");

  cards.forEach(function (cardElement, index) {
    const cardName = cardElement.dataset.cardName;

    setTimeout(function () {
      loadCard(cardElement, cardName);
    }, index * 150);
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
      throw new Error(
        "Scryfall returned HTTP " + response.status
      );
    }

    const card = await response.json();

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
      throw new Error("No image URL found");
    }

    /*
     * Set the image before changing anything else.
     */
    image.src = imageUrl;

    image.style.display = "block";
    image.style.visibility = "visible";
    image.style.opacity = "1";

    /*
     * Use Scryfall's actual card URL.
     */
    links.forEach(function (link) {
      link.href = card.scryfall_uri;
    });

    /*
     * Hide the loading message once the image is ready.
     */
    image.onload = function () {
      if (loading) {
        loading.style.display = "none";
      }
    };

    image.onerror = function () {
      if (loading) {
        loading.textContent = "Unable to load card image";
      }
    };

  } catch (error) {

    console.error(
      "Could not load card:",
      cardName,
      error
    );

    if (loading) {
      loading.textContent = "Card image unavailable";
    }
  }
}
