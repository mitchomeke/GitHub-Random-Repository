let languages = [];
fetch('languages.json').then(response => response.json()).then(data => {languages = data;});

async function getRandomRepo(LanguageName){
    const perPage = 100;
    const maxPages = 10;
    const randomPage = Math.floor(Math.random() * maxPages) + 1;

    const query = `language:${LanguageName}`;
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${perPage}&page=${randomPage}`;

    const response = await fetch(url, {
        headers: {'Accept': 'application/vnd.github.v3+json',}});

    if (!response.ok){
        throw new Error(`GitHub API Error: ${response.status}`);
    }

    const data = await response.json();
    const items = data.items;

    if (items.length === 0){
        throw new Error("No repo found");
    }

    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}
function DropDown (){
    const Container = document.getElementById("DDC");
    Container.innerHTML = "";
    const state = document.getElementById("first-state-id");
    state.classList.add('hide');

    const DropDown = document.createElement("div");
    DropDown.style.height = "200px";
    DropDown.style.width = "200px";
    DropDown.style.border = "2px solid black";
    DropDown.style.borderRadius = "10px";
    DropDown.style.display = "grid";
    DropDown.style.opacity = "1";
    DropDown.style.transition = "opacity 0.5s ease";
    DropDown.style.marginLeft = "90px";

    languages.forEach(language => {
        const button = document.createElement("button");
        button.innerText = language.title;
        button.style.width = "200px";
        button.style.height = "25px";
        button.style.border = "2px solid black";
        button.style.borderRadius = "10px";

        button.onclick = function (){
            DropDown.style.opacity = "0";

            const select = document.getElementById("select");
            select.innerText = button.innerText;
            const details = document.getElementById("detail");

            const refresh = document.getElementById("refresh");
            const loading = document.getElementById("loading");
            const error = document.getElementById("error");

            state.classList.remove("hide");
            document.getElementById("select-language").style.display = "none";
            error.style.display = "none";
            loading.style.display = "block";
            details.innerHTML = "";

            const title = document.createElement("span");
            const desc = document.createElement("span");
            getRandomRepo(button.innerText).then(
                repo => {

                    state.classList.add("hide");
                    loading.style.display = "none";

                    title.innerText = repo.full_name;
                    desc.innerText = repo.description;
                    details.appendChild(title);
                    details.appendChild(desc);
                    details.classList.add("show");
                    refresh.classList.add("show");
                }).catch(() => {
                loading.style.display = "none";
                error.style.display = "block";
            })

            refresh.onclick = function (){
                DropDown.style.opacity = "1";
                select.innerText = "Select a Language";
                details.classList.remove("show");
                refresh.classList.remove("show");

                document.getElementById("select-language").style.display = "block";
                error.style.display = "none";
                loading.style.display = "none";
                state.classList.remove("hide");
            };
        };
        DropDown.appendChild(button);
    });
    Container.appendChild(DropDown);
}
