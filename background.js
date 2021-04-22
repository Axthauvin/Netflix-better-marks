
chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: { hostContains: 'netflix'}
				})
			],
			actions: [ new chrome.declarativeContent.ShowPageAction() ]
		}]);
	});
});


chrome.tabs.onUpdated.addListener(
	function (tabId, changeInfo, tab) {
	  if (changeInfo.url) {
		chrome.tabs.query({active: true}, function(tabs) {
			if (tabs[0].url.includes("jbv=")) {
				var tab = tabs[0];
				localStorage.setItem("lang", "en");
				
				function getlang(result){
					console.log("Langue : " + result);
					localStorage.setItem("lang", result);


					var things = JSON.parse(localStorage.getItem("choses"));
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
					
					lang = localStorage.getItem("lang")
					var r = GetFilm(h1, lang, c, IMDBStatus, MetaStatus);
					var Note = r.Note;
					var ID = r.Id;
					var Metacritick = r.notemeta;
					var nom = r.nom;
					var type = r.type;
					var allo = getAlloresults(nom, c);
					var allonote = allo.note;
					var allourl = allo.url;
					var metaurl = r.metaurl;
					
					
					
					//console.log(localStorage.getItem("choses"));
					let msg =  {
						note : Note,
						id : ID,
						meta : Metacritick,
						nom : nom,
						type : type,
						allo : allonote,
						allourl : allourl,
						things : things,
						metaurl : metaurl
					}
					chrome.tabs.sendMessage(tabId, msg);
				}

				function getcreator (results) {
					c = results[0];
					console.log("Créateur : " + c);
					chrome.tabs.executeScript(tab.id, {
						code: 'document.documentElement.lang'
					}, getlang);
					
				}

				function display_h1 (results) {
					h1 = results[0];
					console.log(h1);
					chrome.tabs.executeScript(tab.id, {
						code: 'document.querySelector(".about-container").children[0].children[1].textContent.substring(1)'
					}, getcreator);
					
				}
				  
				chrome.tabs.executeScript(tab.id, {
					code: 'document.querySelector("strong").textContent'
				}, display_h1);
				

				
				
				

			}
			
		
		});
  
	  }
	}
  );




function httpGet(theUrl)
{
	var jepeuxenvoyerlasauce;
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
    
}

function httpGet2(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function getRealmoviename(filmname, langa, year) {
	var apikeyal = "k_swt1m5sc";
	var lang = langa;
	var requestgoodmoviename = "https://imdb-api.com/" + lang + "/API/Search/" + apikeyal +"/" + filmname;
	var result1 = JSON.parse(httpGet(requestgoodmoviename));
	var goodmoviename;
	var id;
	if (result1.errorMessage != ""){
		console.log(result1.errorMessage);
		console.log("On utilise alors la 2ème");
		var apikeyal = "k_nm14hapg";
		var requestgoodmoviename = "https://imdb-api.com/" + lang + "/API/Search/" + apikeyal +"/" + filmname;
		console.log(requestgoodmoviename);
		var result2 = JSON.parse(httpGet(requestgoodmoviename));
		goodmoviename = result2.results[0].title;
		id = result2.results[0].id;
	} else {
		console.log("Première key api valide !");
		goodmoviename = result1.results[0].title;
		id = result1.results[0].id;
	}
		return {moviename : goodmoviename, id : id}
	
}

function GetFilm(filmname, langa, year, im, me) {
	var askgood = getRealmoviename(filmname, langa, year);
	var goodmoviename = askgood.moviename;
	var id = askgood.id;
	if (me) {
		var request = "https://www.imdb.com/title/" + id +"/?ref_=fn_al_tt_1";
		console.log(request);
		var response = httpGet(request);
		var parser = new DOMParser();
		var doc = parser.parseFromString(response, "text/html");

		var note = doc.getElementsByClassName("ratingValue")[0].textContent.replaceAll(' ', '').replaceAll('\n', '');
		console.log(note);
		var seriedetector = doc.getElementsByClassName("bp_item np_episode_guide np_right_arrow").length;
		var type;
		if (seriedetector === 0){
			type = "movie";
		} else {
			type = "tv";
		}

		var notemeta;
		var req = "https://www.metacritic.com/" + type + "/" + goodmoviename.replaceAll(' and ', '-').replaceAll(' ', '-').replaceAll('+', '-').replaceAll('\'', '').toLowerCase();
		console.log(req);
		console.log("Type :" + type);
		var response = httpGet(req);
		if (response === "caca"){
			notemeta = "??"

		} else {
			var parser = new DOMParser();
			var doc = parser.parseFromString(response, "text/html");
			
			if (type == "tv"){
				notemeta = doc.getElementsByClassName("metascore_w larger tvshow")[0].textContent;
			} else {
				notemeta = doc.getElementsByClassName("metascore_w larger movie")[0].textContent;
			}
			
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
	
	
		
	
	
	} else if (im){
			var request = "https://www.imdb.com/title/" + id +"/?ref_=fn_al_tt_1";
			console.log(request);
			var response = httpGet(request);
			var parser = new DOMParser();
			var doc = parser.parseFromString(response, "text/html");
			//var NoteMeta = doc.querySelectorAll("span");

			var note = doc.getElementsByClassName("ratingValue")[0].textContent.replaceAll(' ', '').replaceAll('\n', '');
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
	console.log(note);
	console.log(notemeta);
	//return {Note : note, Id : id, Notemeta : notemeta};
	return {Note : note, Id : id, notemeta : notemeta, nom : goodmoviename, type : type, metaurl : req};
    


}


function getAlloresults(filmname, creator) {
	var request = "https://www.allocine.fr/_/autocomplete/" + filmname.replaceAll(' ', '_');
	console.log(request);
	var response = JSON.parse(httpGet(request));
	console.log(response);
	var goodindex = -1;
	if (response.results.length == 1){
		goodindex = 0;
	} else {
		c = creator.split(' ')[0] + ' ' + creator.split(' ')[1] 
		for (let pas = 0; pas < response.results.length; pas++) {
			if (response.results[pas].data.creator_name[0] == c){
				goodindex = pas;
				break;
			}
		}
	}
	
	if (goodindex != -1){
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
		
		var response = httpGet2(resquestfin);
		var parser = new DOMParser();
		var doc = parser.parseFromString(response, "text/html");
		var NotePresse = doc.querySelector(".stareval-note").textContent;
	} else {
		var NotePresse = "??";
	}
	
	
	console.log("La note de la presse Allociné est : " + NotePresse);
	
	return {note : NotePresse, url : resquestfin};
}


