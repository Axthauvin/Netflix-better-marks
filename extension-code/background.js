chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: { hostContains: ''}
				})
			],
			actions: [ new chrome.declarativeContent.ShowPageAction() ]
		}]);
	});
});

function resetBase() {
	var dictaa = {}
	dictaa.a = "aa"
	chrome.storage.local.set({"filmsStored" : dictaa});
	return "base was reseted"
}


async function readLocalStorage(key) {
	let promise =  new Promise((resolve, reject) => {
	  try {
		chrome.storage.local.get(key, function (result) {
		  resolve(result[key])
		});
	  } catch  (ex){
		reject(ex);
	  }
	  
	});

	let result = await promise;
  	return result;
}

chrome.tabs.onUpdated.addListener(
	function (tabId, changeInfo, tab) {
		
		if (changeInfo.url) {
		  
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				async function mainprog() {
					aa = await readLocalStorage("filmsStored");
				
					function getTabId() {
						return parseInt(tabs[0].id);
					}
		
					
					
					
					if (aa == null) {
						resetBase();
					}
		
					
					if (tabs[0].url.includes("jbv=")) {
						var tab = tabs[0];
						chrome.storage.local.set({"lang" : "en"});
						
						async function getlang(result){
							result = result[0].result;
							console.log("Langue : " + result);
							chrome.storage.local.set({"lang": result});
		
							//console.log( await readLocalStorage("choses") );
							var things = await readLocalStorage("choses");
							console.log(things);
							var IMDBStatus;
							var MetaStatus;
							var AlloStatus;
							for (let pas = 0; pas < things.length; pas++) {
								if (things[pas]["nom"] === "IMDB"){
									
									IMDBStatus = things[pas].status;
								} 
								if (things[pas]["nom"] === "Metacritic"){
									MetaStatus = things[pas].status;
								} 
								if (things[pas]["nom"] === "Allociné"){
									AlloStatus = things[pas].status;
								} 
							}
							
							
							console.log("imdb " + IMDBStatus);
							console.log("meta " + MetaStatus);
							console.log("allo " + AlloStatus);
							
							if (h1.length < 2){
								console.log("Le nom du film a mal été chargé.")
								let msg =  {
									error : "Le nom du film a mal été chargé. Veuillez réessayer"
								}
								chrome.tabs.sendMessage(tabId, msg);
							} else {
								lang = await readLocalStorage("lang")
								
								
								var r = await GetFilm(h1, lang, c, IMDBStatus, MetaStatus);
								var Note = r.Note;
								var ID = r.Id;
								console.log(Note);
								console.log(ID)
								var Metacritick = r.notemeta;
								var nom = r.nom;
								var type = r.type;
								var allo = await getAlloresults(nom, c, y);
								var allonote = allo.note;
								var allourl = allo.url;
								var metaurl = r.metaurl;
								var dateexpiration = r.date;
								console.log("La dernière fois que la note a été téléchargée est : " + dateexpiration.toString())
		
								
								let msg =  {
									note : Note,
									id : ID,
									meta : Metacritick,
									nom : nom,
									type : type,
									allo : allonote,
									allourl : allourl,
									things : things,
									metaurl : metaurl,
									error : "none",
									date : dateexpiration
								}
								
								var dict = {};
								dict[nom] = msg;
								getdatabase = await readLocalStorage("filmsStored")
								chrome.storage.local.set({"filmsStored": Object.assign( {}, dict,  getdatabase) });
								
								chrome.tabs.sendMessage(tabId, msg);
								
							}
							
							
							
							
							
							//console.log(await readLocalStorage("choses"));
							
						}
		
						function func1(){
							return document.documentElement.lang;
							
						}
		
						function getyear (results) {
							y = results[0].result;
							console.log("Année : " + y);
							chrome.scripting.executeScript({ 
								target : {tabId : tab.id},
								func : func1,
							},
							(injectionResults) => {getlang(injectionResults)}
							);
							
						}
		
						function func2() {
							return document.querySelector(".year").textContent;
							
						}
		
						function getcreator (results) {
							c = results[0].result.replaceAll(',', '');
							if (c.includes("6+Recommended for ages 16 and up")) {
								console.log("Le nom du film a mal été chargé.")
								let msg =  {
									error : "Le nom du film a mal été chargé. Veuillez réessayer"
								}
								chrome.tabs.sendMessage(tabId, msg);
							} else {
								console.log("Créateur : " + c);
								chrome.scripting.executeScript({
									target : {tabId : tab.id},
									func : func2,
								},
								(injectionResults) => {getyear(injectionResults)}
								);
							}
							
							
						}
		
						function func3 () {
							return document.querySelector(".about-container").children[0].children[1].textContent.substring(1);
							
						}
		
						function display_h1 (results) {
							h1 = results[0].result;
							console.log("Film : " + h1);
							chrome.scripting.executeScript({
								target : {tabId : tab.id},
								func : func3,
							},
							(injectionResults) => {getcreator(injectionResults)}
							);
							
						}
		
						function func4() {
							console.log(document.querySelector("strong").textContent);
							return document.querySelector("strong").textContent;
								
						}
						
						
						
						chrome.scripting.executeScript(
							{
								target : {tabId: tab.id},
								func : func4,
							},
							(injectionResults) => {display_h1(injectionResults)}
							);
		
		
					}
				}

				mainprog();

				
			
			});
  		}
	}
);






async function httpGet(theUrl)
{
	return fetch(theUrl).then(r => r.text()).then(result => {
		if (result != undefined) {
			return result;
		} else {
			return "caca";
		}
    	
	});
	
	
	/*
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false);
	xmlHttp.onloadend = function() {
		if(xmlHttp.status == 404) {
			console.log("Erreur 404 détectée");
			jepeuxenvoyerlasauce = "nope";
		} else {
			jepeuxenvoyerlasauce = "gobg";
		}
			
	}
    xmlHttp.send(null);
	if (jepeuxenvoyerlasauce === "gobg"){
		return xmlHttp.responseText;
	} else {
		return "caca";
	}
	*/
    
}

function httpGet2(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}



async function getRealmoviename(filmname, langa, year) {
	var apikeyal = "k_swt1m5sc";
	var lang = langa;
	var requestgoodmoviename = "https://imdb-api.com/" + lang + "/API/Search/" + apikeyal +"/" + filmname;
	requesttodo = await httpGet(requestgoodmoviename);
	var result1 = JSON.parse(requesttodo);
	var goodmoviename;
	var id;
	if (result1.errorMessage != ""){
		console.log(result1.errorMessage);
		console.log("On utilise alors la 2ème");
		var apikeyal = "k_nm14hapg";
		var requestgoodmoviename = "https://imdb-api.com/" + lang + "/API/Search/" + apikeyal +"/" + filmname;
		console.log(requestgoodmoviename);
		requesttodo = await httpGet(requestgoodmoviename)
		var result2 = JSON.parse(requesttodo);
		goodmoviename = result2.results[0].title;
		id = result2.results[0].id;
	} else {
		console.log("Première key api valide !");
		goodmoviename = result1.results[0].title;
		id = result1.results[0].id;
	}
		return {moviename : goodmoviename, id : id}
	
}

function getElementsByClassName(lachaine, classname){
	index = lachaine.indexOf(classname);
	index += classname.length;
	while (lachaine[index] != ">") {
		index += 1
	}
	index += 1
	chaine = ""
	while (lachaine[index] != "<") {
		chaine += lachaine[index]
		index += 1
	}
	return chaine;
}

async function GetFilm(filmname, langa, year, im, me) {
	
	var askgood = await getRealmoviename(filmname, langa, year);
	var goodmoviename = askgood.moviename;
	var id = askgood.id;
	console.log("Le bon nom du film est", goodmoviename);
	films = await readLocalStorage("filmsStored");

	/*
	delete films['Lucifer']
	chrome.storage.local.set("filmsStored", JSON.stringify(films))
	films = JSON.parse(await readLocalStorage("filmsStored"));
	*/

	console.log(films);
	console.log("Recherche dans la base...");
	console.log(Object.keys(films));
	for (let i = 0; i < Object.keys(films).length; i++) {
		if (Object.keys(films)[i] == goodmoviename) {

			if (films[goodmoviename].id == id) {
				console.log("FOUNDED");
				//console.log(films[goodmoviename]);
				
				let msg =  {
					Note : films[goodmoviename].note,
					Id : films[goodmoviename].id,
					notemeta : films[goodmoviename].meta,
					nom : films[goodmoviename].nom,
					type : films[goodmoviename].type,
					allonote : films[goodmoviename].note,
					allourl : films[goodmoviename].allourl,
					things : films[goodmoviename].things,
					metaurl : films[goodmoviename].metaurl,
					error : "none",
					date : films[goodmoviename].date
				}
				console.log(msg);
				var today = new Date();
				var actualdate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
				
				var splited = actualdate.split("-");
				var dateeeee = (parseInt(splited[2]) - 7);
				var datetocompare = splited[0]+'-'+splited[1]+'-'+(dateeeee.toString());
				
				var splited2 = datetocompare.split('-')
				var splited1 = msg.date.split('-')

				/*

				console.log(msg.date);
				console.log(datetocompare);
				*/
				if (new Date(splited1[0], splited1[1]-1, splited1[2]) <= new Date(splited2[0], splited2[1]-1, splited2[2])) {
					console.log("On doit actualiser !");
				} else {
					console.log("La date est encore correcte !");
					return msg
				}
				
			}
		}
	}
	console.log("On lance les requêtes webs !");
	if (me) {
		var request = "https://www.imdb.com/title/" + id +"/?ref_=fn_al_tt_1";
		console.log(request);
		var response = await httpGet(request);
		//var doc = document.createElement( 'html' );
		//doc.innerHTML = response;
		//var parser = new DOMParser();
		//var doc = parser.parseFromString(response, "text/html");
		var note = getElementsByClassName(response, "sc-7ab21ed2-1 jGRxWM").replaceAll(' ', '').replaceAll('\n', '');
		var seriedetector = getElementsByClassName(response, "ipc-inline-list__item").length;

		var type;
		if (seriedetector === 0){
			type = "movie";
			console.log("C'est un film")
		} else {
			type = "tv";
			console.log("C'est une série")
		}

		var notemeta;
		var req = "https://www.metacritic.com/" + type + "/" + goodmoviename.replaceAll(' and ', '-').replaceAll(' ', '-').replaceAll('+', '-').replaceAll('\'', '').replaceAll('-&', '').toLowerCase();
		console.log(req);
		console.log("Type : " + type);
		var useernote = false;
		var response = await httpGet(req);
		if (response === "caca"){
			notemeta = "??"

		} else {
			
			if (type == "tv"){
				notemeta = getElementsByClassName(response, "metascore_w larger tvshow");
				if (notemeta == "tbd") {
					notemeta = getElementsByClassName(response, "metascore_w user larger tvshow");
					useernote = true;
				}
			} else {
				notemeta = getElementsByClassName(response, "metascore_w larger movie");
				if (notemeta == "tbd") {
					notemeta = getElementsByClassName(response, "metascore_w user larger movie");
					useernote = true;
				}
			}
			
		}
		
		

		if (notemeta == "tbd") {

			notemeta = "??";
		}
		if (notemeta.includes("%") == false && notemeta != "??") {
			if (useernote) {
				notemeta = (parseFloat(notemeta) * 10).toString() + "%"
				
			} else {
				if (notemeta.includes("/100") == false) {
					notemeta += "%";
				} else {
					notemeta.replaceAll("/100", "%");
				}
			}
			

		}

	
	
		
	
	
	} else if (im){
			var request = "https://www.imdb.com/title/" + id +"/?ref_=fn_al_tt_1";
			console.log(request);
			var response = await httpGet(request);

			var note = getElementsByClassName(response, "ratingValue").replaceAll(' ', '').replaceAll('\n', '');
			console.log(note);
			var notemeta = "nope";
	} else {
		var notemeta = "nope";
		var note = "nope";
	}
	 /*
	var seriedetector = doc.getElementsByClassName("bp_item np_episode_guide np_right_arrow").length;
	var type;
	if (seriedetector === 0){
		type = "movie";
	} else {
		type = "tv";
	}
	
	
	// J'enlève la méthode avec omdb
	/*
    var apikey = "2a6f0b83";
	goodmoviename = goodmoviename.replaceAll(' ', '+');
	goodmoviename = goodmoviename.replaceAll('&', '');
    var request = "http://www.omdbapi.com/?apikey=" + apikey + "&t=" + goodmoviename + "&y=" + year;
	console.log(request);
    var response = JSON.parse(httpGet(request));
	console.log(response);
	var note = "??";
	if (response.Ratings.length > 0){
		note = response.Ratings[0].Value;
	}
	
	var id = response.imdbID;
	var type = response.Type;
	if (type === "series") {
		type = "tv"
	}
	
		var notemeta;
		var req = "https://www.metacritic.com/" + type + "/" + goodmoviename.replaceAll(' ', '-').replaceAll('+', '-').replaceAll('\'', '').toLowerCase();
		console.log(req);
		var response = httpGet(req);
		if (response === "caca"){
			notemeta = "??"

		} else {
			var parser = new DOMParser();
			var doc = parser.parseFromString(response, "text/html");
			notemeta = doc.getElementsByClassName("metascore_w larger tvshow positive")[0].textContent;
		}
		
		

		if (notemeta == "tbd") {
			notemeta = "??";
		}
		if (notemeta.includes("%") == false && notemeta != "??") {
			if (notemeta.includes("/100") == false) {
				notemeta += "%";
			} else {
				notemeta.replaceAll("/100", "%");
			}
		}
	
	
		
	*/
	console.log("IMDB", note);
	console.log("Metacritic", notemeta);
	//return {Note : note, Id : id, Notemeta : notemeta};
	var today = new Date();
	var ladate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	console.log({Note : note, Id : id, notemeta : notemeta, nom : goodmoviename, type : type, metaurl : req, date:ladate});
	return {Note : note, Id : id, notemeta : notemeta, nom : goodmoviename, type : type, metaurl : req, date:ladate};
    


}


function querySelector(lachaine, classname){
	lachaine = lachaine.substring(120000)
	index = lachaine.indexOf(classname)
	index += classname.length;
	while (lachaine[index] != ">") {
		index += 1
	}
	index += 1
	chaine = ""
	while (lachaine[index] != "<") {
		chaine += lachaine[index]
		index += 1
	}
	return chaine;
}


async function getAlloresults(filmname, creator, year) {
	var request = "https://www.allocine.fr/_/autocomplete/" + filmname.replaceAll(' ', '_');
	console.log(request);
	requesttodo = await httpGet(request)
	var response = JSON.parse(requesttodo);
	console.log(response);
	console.log("Résultats trouvés : " + response.results.length.toString());
	var goodindex = -1;
	if (response.results.length == 1){
		goodindex = 0;
	} else {
		c = creator.split(' ')[0] + ' ' + creator.split(' ')[1]
		
		for (let pas = 0; pas < response.results.length; pas++) {
			if (("creator_name" in response.results[pas].data)) {
				if (response.results[pas].data.creator_name[0] == c || response.results[pas].data.year == y || response.results[pas].data.director_name == c){
					goodindex = pas;
					break;
				}
			}
			if (("director_name" in response.results[pas].data)) {
				if (response.results[pas].data.director_name == c){
					goodindex = pas;
					break;
				}
			}
			
		}
		
		if (goodindex == -1){
			console.log("Avec les paramètres non trouvé. On cherche juste avec les recherches associées !");
			for (let ii = 0; ii < response.results.length; ii++) {
				console.log(response.results[ii].label)
				if (response.results[ii].text_search_data.includes(filmname)){
					goodindex = ii;
					break
				}
				
			}
			if (goodindex == -1) {
				console.log("Avec le nom ?");
				for (let ii = 0; ii < response.results.length; ii++) {
					console.log(response.results[ii].label)
					if (response.results[ii].label == filmname){
						goodindex = ii;
						break
					}
					
				}
				
				if (goodindex == -1) {
					console.log("Avec le créateur alors ?!");
					for (let ii = 0; ii < response.results.length; ii++) {
						console.log(response.results[ii].label)
						if (("creator_name" in response.results[ii].data)) {
							if (response.results[ii].data.creator_name[0] == c || response.results[pas].data.year == y){
								goodindex = pas;
								break;
							}
						}
						
					}
				}
			} 
			 
			
		
		} else {
			console.log("On a le film sur Allociné !");
		}
		
		
	}
	
	if (goodindex != -1){
		console.log("Index final", goodindex);
		var type = response.results[goodindex].entity_type;
		console.log(response.results[goodindex].data.id);
		console.log(type);
		
		var id = response.results[goodindex].entity_id;
		
		var resquestfin;
		if (type === "movie"){
			resquestfin = "https://www.allocine.fr/film/fichefilm_gen_cfilm=" + id + ".html";
		} else {
			resquestfin = "https://www.allocine.fr/series/ficheserie_gen_cserie=" + id + ".html";
		}
		console.log(resquestfin);
		var response = await httpGet(resquestfin);
		
		
		trouve = querySelector(response, "stareval-note");

		if (trouve != null ) {
			var NotePresse = trouve;
		}
		else {
			var NotePresse = "??";
		
		}
		
	} else {
		var NotePresse = "??";
	}
	
	
	console.log("La note de la presse Allociné est : " + NotePresse);
	
	return {note : NotePresse, url : resquestfin};
}


