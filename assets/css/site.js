document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach((cardElement) => {
    const cardName = cardElement.dataset.cardName;

    loadCard(cardElement, cardName);
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

    console.log("Requesting Scryfall:", url);

    const response = await fetch(url);

    console.log(
      "Scryfall response:",
      cardName,
      response.status
    );

    if (!response.ok) {
      throw new Error(
        `Scryfall returned HTTP ${response.status}`
      );
    }

    const card = await response.json();

    console.log("Scryfall card:", card);

    if (!card.image_uris || !card.image_uris.normal) {
      throw new Error("Scryfall did not provide an image URL");
    }

    /*
     * Set the actual card image.
     */
    image.src = card.image_uris.normal;

    image.alt = card.name;

    /*
     * Replace the temporary search links
     * with the actual Scryfall card URL.
     */
    links.forEach((link) => {
      link.href = card.scryfall_uri;
    });

    /*
     * Remove the loading message.
     */
    loading.style.display = "none";

  } catch (error) {

    console.error(
      "Scryfall card loading failed:",
      cardName,
      error
    );

    loading.textContent =
      "Unable to load card";

    loading.style.color = "#ff7777";
  }
}
