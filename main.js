const store = document.querySelector(".gallery-container");
let response;
let page = 1;
let newResponse;
let x = document.querySelector("#showBtn");
// https://api.unsplash.com/photos?page=1&client_id=ik1BSErx1N88K4aoFN77B5YD-p_23RFSP7eidyr_s4M


fetch(`https://api.unsplash.com/photos?page=${page}&client_id=ik1BSErx1N88K4aoFN77B5YD-p_23RFSP7eidyr_s4M`)
    .then(res => res.json())
    .then(data => {
        response = data.map(res =>
            `<div class="cart-container">
            <img src="${res.urls.small}" class="pic" alt="${res.alt_description}">
            <div class="image-info">
                <div class="description">${res.description ? res.description.slice(0,25) + "..." : "This is wonderful image"}</div>
                 <div class="likes"><i class="fa-solid fa-heart"></i>${res.likes}</div>
            </div>
        </div>`).join("");

        store.innerHTML = response;
    })
    .catch(err => store.innerHTML = err)


async function showMore() {
    page++;
    let inputData_1 = document.querySelector("#input-box").value.trim();
    if (!inputData_1) {
        let moreData = await fetch(`https://api.unsplash.com/photos?page=${page}&client_id=ik1BSErx1N88K4aoFN77B5YD-p_23RFSP7eidyr_s4M`);
        const parseData = await moreData.json();
        let response2 = parseData.map(res => `<div class="cart-container">
            <img src="${res.urls.small}" class="pic" alt="${res.alt_description}">
            <div class="image-info">
                <div class="description">${res.description ? res.description.slice(0,25) + "..." : "This is wonderful image"}</div>
                 <div class="likes"><i class="fa-solid fa-heart"></i>${res.likes}</div>
            </div>
        </div>`).join("");
        response += response2;
        store.innerHTML = response;
    } else {
        let data = await fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${inputData_1}&client_id=ik1BSErx1N88K4aoFN77B5YD-p_23RFSP7eidyr_s4M`)
        let anotherResponse = await data.json();
        let searchData = anotherResponse.results.map(res => `<div class="cart-container">
            <img src="${res.urls.small}" class="pic" alt="${res.alt_description}">
            <div class="image-info">
                <div class="description">${res.description ? res.description.slice(0,25) + "..." : "This is wonderful image"}</div>
                 <div class="likes"><i class="fa-solid fa-heart"></i>${res.likes}</div>
            </div>
        </div>`).join("");
        newResponse += searchData;
        store.innerHTML = newResponse;
    }
}

const searchResult = async () => {
    const inputData = document.querySelector("#input-box").value.trim();
    let page2 = 1;
    try {
        let data = await fetch(`https://api.unsplash.com/search/photos?page=${page2}&query=${inputData}&client_id=ik1BSErx1N88K4aoFN77B5YD-p_23RFSP7eidyr_s4M`)
        let anotherResponse = await data.json();
        let searchData = anotherResponse.results.map(res => `<div class="cart-container">
            <img src="${res.urls.small}" class="pic" alt="${res.alt_description}">
            <div class="image-info">
                <div class="description">${res.description ? res.description.slice(0,25) + "..." : "This is wonderful image"}</div>
                 <div class="likes"><i class="fa-solid fa-heart"></i>${res.likes}</div>
            </div>
        </div>`).join("");
        newResponse = searchData;
        store.innerHTML = newResponse;
    }
    catch {
        store.innerHTML = `<p>Something went wrong please try after sometime</p>`;
    }
}
