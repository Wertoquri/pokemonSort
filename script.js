let pokemons;
let promises = [];
let sortedPokemons;

let resultElement = document.getElementById("result")
let navElement = document.querySelector("nav")



const kantoPokemonsUrl = 'https://pokeapi.co/api/v2/pokemon?limit=127';

const kantoXHR = new XMLHttpRequest()

kantoXHR.open("GET", kantoPokemonsUrl)
kantoXHR.responseType = "json"
kantoXHR.send()
kantoXHR.onload = () => {
    kantoXHR.response.results.forEach((pokemon) => {
        let promise = new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest()
            xhr.open("GET", pokemon.url)
            xhr.responseType = "json"
            xhr.send()
            xhr.onload = () => {
                if (xhr.status == 200) {
                    resolve(xhr.response)
                } else {
                    reject(xhr.statusText)
                }
            }
            xhr.onerror = () => {
                reject(xhr.statusText)
            }
        })
        promises.push(promise)

    })
    Promise.all(promises).then((result) => {
        pokemons = result
        sortedPokemons = pokemons.sort()
        console.log(pokemons)
        resultElement.innerHTML = ""
        sortedPokemons.forEach(pokemon => drawPokemon(pokemon))
    })

}


const drawPokemon = (pokemon) => {
    let pokemonElement = document.createElement("div")
    pokemonElement.classList.add("pokemon")
    pokemonElement.innerHTML = `
    <p>id: ${pokemon.id}</p>
    <hr>
    <h1>${pokemon.name}</h1>
    <img src="${pokemon.sprites.front_default}"
    <div class="status">
    <p class="hp"></p>&#10084; ${pokemon.stats[0].base_stat}</p>
    <p class="attack"></p>&#10084; ${pokemon.stats[1].base_stat}</p>
    <p class="defence"></p>&#10084; ${pokemon.stats[2].base_stat}</p>
    </div>`

    let typeList = document.createElement("ul")
    pokemon.types.forEach((type) => {
        let typeItem = document.createElement("li")
        typeList.appendChild(typeItem)
    })
    pokemonElement.appendChild(typeList)
    resultElement.appendChild(pokemonElement)
}


let order = 1;
let sortForm = document.getElementById("sort-form")

sortForm.addEventListener("change", (event) => {

    if (event.target.name == "order") {
        switch (event.target.value) {
            case "upsc":
                order = 1
                break;
            case "desc":
                order = -1
                break;
        }
    }
    switch (sortForm["Sort"].value) {
        case "id":
            sortedPokemons = sortedPokemons.sort((first, second) => {
                if (first.id > second.id) {
                    return order
                }
                if (first.id < second.id) {
                    return -order
                }
                return 0
            })
            break;
        case "name":
            sortedPokemons = sortedPokemons.sort((first, second) => {
                if (first.name > second.name) {
                    return order
                }
                if (first.name < first.name) {
                    return -order
                }
                return 0
            })
            break;
        case "hp":
            sortedPokemons = sortedPokemons.sort((first, second) => {
                if (first.stats[0].base_stat > second.stats[0].base_stat) {
                    return order
                }
                if (first.stats[0].base_stat < second.stats[0].base_stat) {
                    return -order
                }
                return 0
            })
            break;
        case "attack":
            sortedPokemons = sortedPokemons.sort((first, second) => {
                if (first.stats[1].base_stat > second.stats[1].base_stat) {
                    return order
                }
                if (first.stats[1].base_stat < second.stats[1].base_stat) {
                    return -order
                }
                return 0
            })
            break;
        case "defence":
            sortedPokemons = sortedPokemons.sort((first, second) => {
                if (first.stats[2].base_stat > second.stats[2].base_stat) {
                    return order
                }
                if (first.stats[2].base_stat < first.stats[2].base_stat) {
                    return -order
                }
                return 0
            })
            break;
    }
    redDrawSortPokemons()
})


function redDrawSortPokemons() {
    resultElement.innerHTML = ""
    sortedPokemons.forEach(pokemon => drawPokemon(pokemon))
}

document.getElementById("filter-form").addEventListener("submit", function(event){
    event.preventDefault();
    sortedPokemons = pokemons
    if(event.target["name-filter"].value){
        sortedPokemons = sortedPokemons.filter((pokemon) => {
            return pokemon.name.indexOf(event.target["name-filter"].value.toLowerCase()) != -1
        })
    }
    if(event.target["hp-filter-from"].value > 10){
        sortedPokemons = sortedPokemons.filter((pokemon)=>{
            return pokemon.stats[0].base_stat >= event.target["hp-filter-from"].value
        })
    }
    if(event.target["hp-filter-to"].value < 250){
        sortedPokemons = sortedPokemons.filter((pokemon)=>{
            return pokemon.stats[0].base_stat <= event.target["hp-filter-to"].value
        })
    }
    if(event.target["attack-filter-from"].value > 5){
        sortedPokemons = sortedPokemons.filter((pokemon)=>{
            return pokemon.stats[1].base_stat >= event.target["attack-filter-from"].value
        })
    }

    if(event.target["attack-filter-to"].value < 130){
        sortedPokemons = sortedPokemons.filter((pokemon)=>{
            return pokemon.stats[1].base_stat <= event.target["attack-filter-to"].value
        })
    }
    if(event.target["defence-filter-from"].value > 5){
        sortedPokemons = sortedPokemons.filter((pokemon)=>{
            return pokemon.stats[2].base_stat >= event.target["defence-filter-from"].value
        })
    }
    if(event.target["defence-filter-to"].value < 180){
        sortedPokemons = sortedPokemons.filter((pokemon)=>{
            return pokemon.stats[2].base_stat <= event.target["defence-filter-to"].value
        })
    }
    redDrawSortPokemons();
})