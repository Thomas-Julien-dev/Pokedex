// https://pokeapi.co/
// PokeAPI -> documentation -> Pokemon - Pokemon -> lien GET https://pokeapi.co/api/v2/pokemon/{id or name}/
// Pokemon -> PokemonSpecies -> GET https://pokeapi.co/api/v2/pokemon-species/{id or name}/

let allPokemon = [];
let tableauFin = [];
const searchInput = document.querySelector('.recherche-poke input');
const listePoke = document.querySelector('.liste-poke');
const chargement = document.querySelector('.loader');

const types = {
    grass: '#78c850',
	ground: '#E2BF65',
	dragon: '#6F35FC',
	fire: '#F58271',
	electric: '#F7D02C',
	fairy: '#D685AD',
	poison: '#966DA3',
	bug: '#B3F594',
	water: '#6390F0',
	normal: '#D9D5D8',
	psychic: '#F95587',
	flying: '#A98FF3',
	fighting: '#C25956',
    rock: '#B6A136',
    ghost: '#735797',
    ice: '#96D9D6'
};

// On vient faire un appel à l'API. Pour ça on fait une fonction. On y fait une première requête, on récupère les données de l'API une première fois. 

function fetchPokemonBase(){

    fetch("https://pokeapi.co/api/v2/pokemon?limit=151") // En plus de l'URL, il faut spécifier quelque chose. Ici je viens spécifier que je veux une limite que je place à 151. Ainsi je viens récupérer les 151 premiers pokémons. 
        .then(reponse => reponse.json()) // Une fois que la promesse faite via fetch est résolue et que j'ai mes données, je viens faire un .then qui me permet de créer une autre promesse me permettant de passer mes données au format JSON. 
        .then((allPoke) => { // Une fois que c'est fait, que toutes les données sont passées au format JSON, je viens récupérer tous les Pokémons.
            // Dans un premier temps, juste faire ce console.log, s'appercevoir que les noms sont en anglais. On va venir récupérer l'URL présente à côté d'un pokemon. L'ouvrir dans un nouvel onglet. On a vu sur toutes les caractéristiques du pokémon, et on va venir récupérer une picture, qu'on va venir afficher, mais aussi le type du pokémon. On va aussi pouvoir faire un appel du nom en anglais pour venir le mettre en français 
            // console.log(allPoke);

            // On voit que les pokémons sont tous stockés dans un tableau "results" de 151 objets. Du coup on va venir appeler une méthode pour chaque élément de ce tableau. Cette méthode nous servira à faire une requete http pour trouver les bon noms etc. 

            allPoke.results.forEach((pokemon) => { // Pour chaque élément du tableau, on va envoyer une fonction qui aura pour paramètre "pokemon". Sur chaque objet du tableau, donc sur chaque pokémon, on va venir appeler une méthode qui s'appelle fetchPokemonComplet qui aura en paramètre le Pokémon. On va appeler cette méthode avec chaque élément du tableau, et on lui passera à chaque fois l'élément en question du tableau.
                fetchPokemonComplet(pokemon); // On va venir créer cette fonction juste en dessous.
            })

        })

}
fetchPokemonBase();

console.log(fetchPokemonBase())

function fetchPokemonComplet(pokemon) {

    let objPokemonFull = {}; // On viendra stocker dans cet objet les données du pokémon, c'est à dire son nom complet, son image, son type.
    // On vient ensuite retirer l'url et le name depuis pokemon qu'on a fait passer à notre méthode. On vient récupérer l'url qui nous amenait sur une page avec toutes les caractéristiques, ainsi que le nom en anglais du pokémon.
    let url = pokemon.url;
    let nameP = pokemon.name;


    // Une fois qu'on à ça, on vient faire un premier fetch à l'url. Autrement dit, on récupère les données de l'URL. 
    fetch(url)
    .then(reponse => reponse.json()) // lorsque les données sont récupérées, on transforme la réponse du fetch dans un format json. 
    // On vient ensuite utiliser les données en question que l'on va appeler pokeData. 
    .then((pokeData) => {
        console.log(pokeData)
        // On vient console.log ces datas que l'on cherche à récupérer. Quand on regarde dans la console, après avoir recherché les infos, on voit que les images se trouvent dans "sprites", le type dans "type" et l'id dans "id" ce qui va nous permettre de récupérer les valeurs souhaitées. 
        // console.log(pokeData);

        objPokemonFull.pic = pokeData.sprites.front_default; // On créé ainsi une propriété à notre objet avec le .pic et on lui ajoute une donnée en le récupérant dans l'objet pokeData.
        objPokemonFull.type = pokeData.types[0].type.name; // types[0] parce-que types est un tableau dont la première donnée seulement nous intéresse. Dans cette première donnée du tableau on retrouve un type et un proto, on vient récupérer type qui est un objet, d'où le .name pour récupérer le nom du type.
        objPokemonFull.id = pokeData.id;

        // On vient ensuite sur le pokéAPI et on va venir récupérer le "PokémonSpecies" https://pokeapi.co/docs/v2#pokemonspecies

        // On vient du coup appeler l'API qui va nous permettre de récupérer les noms des pokémons en français. Pour ça, à la fin de l'adresse on ajoute la variable nameP qui contient le nom du pokémon en anglais. 
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}`)
        .then(reponse => reponse.json()) // On lit le corps de la réponse et on le transforme en JSON. 
        .then((pokeData) => { // Puis on récupère les données de nos pokémons et on les log. On peut remarquer dans notre objet une clé 'names', un tableau de 11 valeurs. C'est là dedans qu'on va venir récupérer le nom français de notre pokémon.
            // console.log(pokeData);

            objPokemonFull.name = pokeData.names[4].name;
            allPokemon.push(objPokemonFull); // Une fois que notre objet Pokémon est hydraté, on vient remplir le tableau initialement vide "allPokemon".

            if(allPokemon.length === 151) {
                // console.log(allPokemon);
                // QUand on a tous nos pokémons qui sont chargés, on vient récupérer notre tableauFin et on vient trier les pokémons à l'intérieur. 
                tableauFin = allPokemon.sort((a,b) => { // La méthode sort va prendre le premier élément du tableau et va le soustraire à un autre élément. Le résultat peut avoir trois valeurs. Soit le a est supérieur à b, soit il est inférieur, soit il est égal. Suivant ces valeurs, a sera positionné avant ou après b (ou ne pas bougé si c'est =). Cette méthode va s'appliquer à tous les éléments du tableau, du coup à la fin on aura un tableau avec les id triés. On récupère l'id du PokeData qui a été stocké dans l'objet "objPokemonFull", lui même stocké dans allPokemon, que l'on vient mettre dans tableauFin.
                    return a.id - b.id;
                }).slice(0,21); // Une fois qu'on a fait notre tri, on va couper le tableau pour ne conserver que les 21 premiers pokémons pour faire les 21 premières cartes. Grâce à la méthode slice(), on va pouvoir venir couper de 0 à 21 (21 non inclu, ce qui fait 21 pokémons). 
                // console.log(tableauFin);

                createCard(tableauFin); // On appelle la méthode que l'on va venir créer en dessous et on lui passe en paramètre le tableauFin qui est bien trié et prêt à être utilisé.
                chargement.style.display = "none";
            }

        })

    })

}

// Création des cartes

function createCard(arr){ // cette fonction prend le tableau qu'on lui passe, d'où le "arr" en paramètre.

    for(let i = 0; i < arr.length; i++) { // On vient itérer sur le tableau.
        // Manipulation de DOM, on vient créer une carte pour chaque pokémon.
        const carte = document.createElement('li');
        let couleur = types[arr[i].type]; // On vient chercher dans types, l'un des objets de notre tableau passé en paramètre et on y récupère le type.
        carte.style.background = couleur; // Background = couleur de son type.
        const txtCarte = document.createElement('h5');
        txtCarte.innerText = arr[i].name; // On récupère l'objet qui passe, par exemple l'objet Carapuce.name nous donnera "Carapuce".
        const idCarte = document.createElement('p');
        idCarte.innerText = `ID# ${arr[i].id}`;
        const imgCarte = document.createElement('img');
        imgCarte.src = arr[i].pic;

        // On vient nourir notre carte en lui insérant des enfants à notre li avec les données que l'on vient de récupérer, c'est à dire l'image, le texte et l'id.
        carte.appendChild(imgCarte);
        carte.appendChild(txtCarte);
        carte.appendChild(idCarte);

        // On rajoute la carte à notre listePoke (variable déclarée au début de la page JS).
        listePoke.appendChild(carte);

    }

}

// Maintenant, on ne veut pas juste avoir 21 cartes d'afficher, on cherche à avoir une sorte de lazy loading, avec un Scroll Infini (ou presque, au moins jusqu'à ce qu'on arrive à la fin de nos pokémons).

window.addEventListener('scroll', () => { // On vient écouter l'événement scroll sur notre objet global window. 

    const {scrollTop, scrollHeight, clientHeight} = document.documentElement; // On vient faire du destructuring et sortir trois valeurs depuis document.documentElement. On peut aller voir ça dans un nouvel onglet, appeler window dans la console et chercher document - documentElement - ScrollingElement.
    // scrollTop = scroll depuis le top
    // scrollHeight = scroll total
    // clientHeight = hauteur de la fenêtre, partie visible.
    // Puisqu'elles sont maintenant des constantes, on peu venir les loger pour voir ce qu'elles ont en elles : (pour le voir, il faut scroller):
    // console.log(scrollHeight,scrollTop,clientHeight);

    // Si la partie visible + ce qu'on scrollé depuis le top, est >= au scroll total - 20 pour que ça se déclenche un peu avant, on appelle la méthode addPoke avec 6 en paramètre pour ajouter 6 cartes.
    if(clientHeight + scrollTop >= scrollHeight - 20) {
        addPoke(6);
    }

})

let index = 21; // Nombre de pokémon qu'on a déjà montré sur l'écran de base.

function addPoke(nb) {
    if(index > 151) { 
        return; // Si l'index est > à 151, on ne fait plus rien puisqu'il n'y a plus de pokémon à afficher. 
    }
    // Sinon on vient ajouter un morceau de tableau avec le nombre de pokémon qu'on a envie de venir ajouter. Ce tableau on vient l'extraire depuis notre tableau allPokemon. On slice donc à partir de index (21) jusqu'à index + le nombre passé en paramètre.
    const arrToAdd = allPokemon.slice(index, index + nb);
    console.log(index, index + nb);
    createCard(arrToAdd); // On rappelle notre fonction qui va créer des cartes avec notre morceau de tableau supplémentaire.
    index += nb;// On vient incrémenter le total de l'index avec le nombre passé en paramètre pour pouvoir répéter l'opération en partant du nouvel index par la suite.
}

// Recherche via un filtre dynamique fonctionnant dès que l'on tape dans la barre de recherche
searchInput.addEventListener('keyup', recherche);

function recherche(){

    if(index < 151) { // Si on se met à écrire, et que l'index est inférieur à 151, alors on va venir afficher les 130 autres pokémons. Oui mais si on a déjà scrollé et que l'index n'est plus égal à 21, est-ce que ça ne va pas poser problème puisqu'on vient ajouter 130 pokémons ? Et bah non. La méthode slice utilisée dans addPoke permet de gérer ça. Par exemple si notre index est de 50, elle viendra ajouter 130 à 50. En voyant que 180 > 151, la méthode slice permettra automatiquement de revenir à la longueur max du tableau (151).
        addPoke(130);
    }

    let filter, allLi, titleValue, allTitles;
    filter = searchInput.value.toUpperCase(); // Permet d'éviter les erreurs liées à la casse. (Maj/min) . On met toutes les valeurs passées à l'input en majuscule ici.
    allLi = document.querySelectorAll('li');
    allTitles = document.querySelectorAll('li > h5');
    
    // On gère le système de recherche : 
    for(i = 0; i < allLi.length; i++) {

        titleValue = allTitles[i].innerText; // = au nom du pokémon qui est en train de passer dans la boucle. 

        // Ne nous reste plus qu'à comparer le nom du pokémon avec ce qu'on est en train d'écrire dans l'input.
        
        // Si l'index de ce qu'on est en train de chercher est supérieur à -1, ça veut dire que ça se trouve dans notre chaîne de caractère.
        if(titleValue.toUpperCase().indexOf(filter) > -1) {
            // Du coup on lui laisse son style display flex pour qu'il reste affiché, sinon on le fait disparaître.
            allLi[i].style.display = "flex";
        } else {
            allLi[i].style.display = "none";
        }
    }
}


// Animation Input

searchInput.addEventListener('input', function(e) { // qu'est-ce que JavaScript comprend par événement "input" ? Dès qu'on va venir entrer des choses dans un input, ça va déclencher l'événement input. AddEventListener va renvoyer une fonction qui va prendre le "e" en argument, qui est un paramètre pré-conçu avec la méthode addEventListener où "e" est un objet ayant toutes les propriétés de l'évènement. Ici, l'évènement input.

    if(e.target.value !== "") { // e est notre objet ayant les propriété de l'évènement, target c'est notre input et value c'est ce qu'on rentre dedans. Donc, si on est en train d'écrire dans l'input (s'il y a à minima une seule lettre)
        e.target.parentNode.classList.add('active-input'); // On vient récupérer le parent de notre input (donc notre formulaire). On accede aux méthodes de class avec classList, et on vient ajouter la class qu'on passe en paramètre.
    } else if (e.target.value === "") { // Sinon, si la valeur de l'input est vide, on vient remove la class active-input.
        e.target.parentNode.classList.remove('active-input');
    }

})