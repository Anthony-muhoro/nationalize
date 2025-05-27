import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const btn = document.getElementById("btn");
const nameInput = document.getElementById("nameinput");
const resultsPart = document.getElementById("resultsPart");

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  const theName = nameInput.value.trim();

  if (!theName) {
    resultsPart.innerHTML = "<span>Please Enter A Name</span>";
    return;
  }

  resultsPart.innerHTML = '<div class="loader"></div>';

  try {
    const response = await fetch(`https://api.nationalize.io/?name=${theName}`);
    if (!response.ok) throw new Error("Please try Again");

    const { name, country } = await response.json();

    if (!country.length) {
      resultsPart.innerHTML = `<span>No country predictions found for "${name}".</span>`;
      return;
    }

    const resultList = country
      .map((ctr) => {
        const countryName =
          countries.getName(ctr.country_id, "en") || ctr.country_id;
        const probability = (ctr.probability * 100).toFixed(2);
        return `<li>${name} is from <strong>${countryName}</strong> with ${probability}% certainty</li>`;
      })
      .join("");

    resultsPart.innerHTML = `<ol>${resultList}</ol>`;
  } catch (error) {
    console.error("Something went wrong:", error);
    resultsPart.innerHTML =
      '<p style="color:red;">Failed to fetch data. Try again later.</p>';
  }
});
