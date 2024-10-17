const images = ["one", "two", "three", "four", "five"];
let currentIndex = 0;
let revealed = false;
let isJpgFirst = true;

const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");
const label1 = document.getElementById("label1");
const label2 = document.getElementById("label2");
const comparisonInfo = document.getElementById("comparisonInfo");

async function getFileSize(url) {
  const response = await fetch(url, { method: "HEAD" });
  return response.headers.get("content-length");
}

function loadImagePair() {
  const currentImage = images[currentIndex];

  // Randomize the image order
  isJpgFirst = Math.random() < 0.5;

  if (isJpgFirst) {
    img1.src = `./images/${currentImage}.jpg`;
    img2.src = `./images-webp/${currentImage}.webp`;
  } else {
    img1.src = `./images-webp/${currentImage}.webp`;
    img2.src = `./images/${currentImage}.jpg`;
  }

  label1.innerText = "";
  label2.innerText = "";
  comparisonInfo.innerHTML = "";

  revealed = false;
  document.getElementById("revealButton").innerText =
    "Reveal Format and Compare Sizes";
}

async function revealAndCompare() {
  const currentImage = images[currentIndex];

  if (!revealed) {
    const jpgSize = await getFileSize(`./images/${currentImage}.jpg`);
    const webpSize = await getFileSize(`./images-webp/${currentImage}.webp`);
    const sizeReduction = (((jpgSize - webpSize) / jpgSize) * 100).toFixed(2);

    if (isJpgFirst) {
      label1.innerText = `JPG (${(jpgSize / 1024).toFixed(2)} KB)`;
      label2.innerText = `WebP (${(webpSize / 1024).toFixed(2)} KB)`;
    } else {
      label1.innerText = `WebP (${(webpSize / 1024).toFixed(2)} KB)`;
      label2.innerText = `JPG (${(jpgSize / 1024).toFixed(2)} KB)`;
    }

    comparisonInfo.innerHTML = `
      <p class="reduction"><strong>Size Reduction:</strong> ${sizeReduction}%</p>
      <br>
      <br>
      <p>You probably cheating because <strong>webp always load faster!😅🚀</strong></p>
    `;

    revealed = true;
    document.getElementById("revealButton").innerText = "Next Image";
  } else {
    currentIndex = (currentIndex + 1) % images.length;
    loadImagePair();
  }
}

loadImagePair();

document
  .getElementById("revealButton")
  .addEventListener("click", revealAndCompare);
