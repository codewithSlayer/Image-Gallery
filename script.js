const store = document.querySelector(".gallery-container");
const galleryStore = document.querySelector(".saved-container");

let response = [];        // Stores current images from API
let page = 1;
let mode = "home";        // home | search
let searchQuery = "";

const ACCESS_KEY = "ik1BSErx1N88K4aoFN77B5YD-p_23RFSP7eidyr_s4M";
// https://api.unsplash.com/photos?page=1&client_id=ik1BSErx1N88K4aoFN77B5YD-p_23RFSP7eidyr_s4M
/* ----------------------------------------
   FETCH INITIAL IMAGES
----------------------------------------- */
async function loadImages() {
    const res = await fetch(
        `https://api.unsplash.com/photos?page=${page}&client_id=${ACCESS_KEY}`
    );
    const data = await res.json();
    response = [...response, ...data];
    renderImages(data);
}

loadImages();

/* ----------------------------------------
   RENDER IMAGES TO INDEX PAGE
----------------------------------------- */
function renderImages(images) {
    const html = images.map(img => `
        <div class="cart-container">
            <img src="${img.urls.small}" class="pic" alt="${img.alt_description}">
            <div class="image-info">
                <div class="description">
                    ${img.description ? img.description.slice(0,25)+"..." : "This is wonderful image"}
                </div>
                <button onclick="download('${img.urls.small}','${img.id}')">
                    <i class="fa-solid fa-download"></i>
                </button>
                <button class="saveBtn" data-id="${img.id}">
                    <i class="fa-solid fa-floppy-disk"></i>
                </button>
                <div class="likes">
                    <i class="fa-solid fa-heart"></i>${img.likes}
                </div>
            </div>
        </div>
    `).join("");

    store.innerHTML += html;
}

/* ----------------------------------------
   DOWNLOAD IMAGE USING BLOB
----------------------------------------- */
function download(url, id) {
    fetch(url)
        .then(res => res.blob()) // Converts response to file-like object (Blob)
        .then(blob => {
            const blobUrl = URL.createObjectURL(blob); // Temporary local URL
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = `image-${id}.jpg`;
            document.body.appendChild(a);
            a.click();

            // Cleanup memory
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
                a.remove();
            }, 1000);
        });
}

/* ----------------------------------------
   SEARCH IMAGES
----------------------------------------- */
async function searchResult() {
    store.innerHTML = "";
    response = [];
    page = 1;
    mode = "search";
    searchQuery = document.querySelector("#input-box").value.trim();

    const res = await fetch(
        `https://api.unsplash.com/search/photos?page=${page}&query=${searchQuery}&client_id=${ACCESS_KEY}`
    );
    const data = await res.json();
    response = data.results;
    renderImages(data.results);
}

/* ----------------------------------------
   SHOW MORE BUTTON
----------------------------------------- */
async function showMore() {
    page++;

    let url = "";
    if (mode === "search") {
        url = `https://api.unsplash.com/search/photos?page=${page}&query=${searchQuery}&client_id=${ACCESS_KEY}`;
    } else {
        url = `https://api.unsplash.com/photos?page=${page}&client_id=${ACCESS_KEY}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    const images = mode === "search" ? data.results : data;
    response = [...response, ...images];
    renderImages(images);
}

/* ----------------------------------------
   SAVE IMAGE TO LOCAL STORAGE
----------------------------------------- */
document.addEventListener("click", e => {
    const btn = e.target.closest(".saveBtn");
    if (!btn) return;

    const imageId = btn.dataset.id;
    const imageData = response.find(img => img.id === imageId);

    let saved = JSON.parse(localStorage.getItem("savedImages")) || [];

    // Prevent duplicates
    if (saved.some(img => img.id === imageId)) {
        alert("Image already saved");
        return;
    }

    saved.push(imageData);
    localStorage.setItem("savedImages", JSON.stringify(saved));

    alert("Image saved to gallery ✅");
});

/* ----------------------------------------
   LOAD SAVED IMAGES IN GALLERY PAGE
----------------------------------------- */
if (galleryStore) {
    const savedImages = JSON.parse(localStorage.getItem("savedImages")) || [];

    if (savedImages.length === 0) {
        galleryStore.innerHTML = "<p>No saved images yet</p>";
    } else {
        galleryStore.innerHTML = savedImages.map(img => `
            <div class="cart-container">
                <img src="${img.urls.small}" class="pic" alt="${img.alt_description}">
                <div class="image-info">
                    <div class="description">
                        ${img.description ? img.description.slice(0,25)+"..." : "This is wonderful image"}
                    </div>
                    <button onclick="download('${img.urls.small}','${img.id}')">
                        <i class="fa-solid fa-download"></i>
                    </button>
                    <div class="likes">
                        <i class="fa-solid fa-heart"></i>${img.likes}
                    </div>
                </div>
            </div>
        `).join("");
    }
}