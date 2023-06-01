const wrapper = document.querySelector(".wrapper"),
    searchInput = wrapper.querySelector("input"),
    synonyms = wrapper.querySelector(".synonyms .list"),
    infoText = wrapper.querySelector(".info-text"),
    volumeIcon = wrapper.querySelector(".word i"),
    reamoveIcon = wrapper.querySelector(".search span");
let audio;

function data(result, word) {
    if (result.title) {
        // ai api returns the message of can't find word
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. please, try to search for another word.`;
    } else {
        wrapper.classList.add("active");
        let definitions = result[0].meanings[0].definitions[0],
            phonetics = `${result[0].meanings[0].partOfSpeech}/${result[0].phonetics[0].text}/`;

        // let's pass the praticular response data a particular html element
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phonetics;
        document.querySelector(".meaning span").innerText =
            definitions.definition;
        document.querySelector(".example span").innerText = definitions.example;
        audio = new Audio(result[0].phonetics[0].audio);

        if (definitions.synonyms[0] === undefined) {
            synonyms.parentElement.style.display = "none";
        } else {
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";
            for (let i = 0; i < 5; i++) {
                let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
                synonyms.insertAdjacentHTML("beforeend", tag);
            }
        }
    }
}

function search(word) {
    searchInput.value = word;
    fetchApi(word);
    wrapper.classList.remove("active");
}
// fetch api function
function fetchApi(word) {
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
        .then((response) => response.json())
        .then((result) => data(result, word));
}
searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && e.target.value) {
        fetchApi(e.target.value);
    }
});

volumeIcon.addEventListener("click", () => {
    audio.play();
});

reamoveIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#9a9a9a";
    infoText.innerHTML =
        "Type a word and press enter to get meaning exapmle, pronunciation, and synanums of that typed word.";
});
