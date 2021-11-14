chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(message, sender, sendresponse)
{
    console.log(message);
    var erreur = message.error;
    if (erreur != "none"){
        const container = document.createElement("div");
        container.id = "jesuislecontainerdelanoteimdb";
        container.style = "display : flex; align-items: center; border : 2px; padding-top : 10px; border-radius : 1rem; width : fit-content; padding-right : 10px; margin-bottom : 10px; background:linear-gradient(90deg, #292e49 0%,#536976 100% );";

        const error = document.createElement("span");
        error.textContent = erreur;
        error.style = "margin-right : 10px; align-items: center; margin-left : 10px; margin-bottom : 10px; color : #ff8d8d";
        document.querySelector(".previewModal--detailsMetadata-info").prepend(container);
        document.querySelector("#jesuislecontainerdelanoteimdb").appendChild(error);

    } else {
    var Note = message.note;
    var meta = message.meta;
    var id = message.id;
    var nom = message.nom;
    var type = message.type;
    var allo = message.allo;
    var allourl = message.allourl;
    var metaurl = message.metaurl
    
    var things = message.things;
    var IMDBStatus;
    var MetaStatus;
    var AlloStatus;
    var elinorder = [];
    for (let pas = 0; pas < things.length; pas++) {
        if (things[pas]["status"] === true) {
            elinorder.push(things[pas]["nom"]);
        }
        
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

    console.log(elinorder);
    
    console.log("IMDB mets de : " + Note);
    console.log("https://www.imdb.com/title/" + id + "?ref_=nv_sr_srsg_0")
    console.log("Metacritique mets : " + meta);
    console.log("Allociné mets : " + allo);

    const container = document.createElement("div");
    container.id = "jesuislecontainerdelanoteimdb";
    // background:linear-gradient(90deg, #16222a 0%,#3a6073 100% );
    // background:linear-gradient(90deg, #536976 0%,#292e49 100% );
    container.style = "display : flex; align-items: center; border : 2px; padding-top : 10px; border-radius : 1rem; width : fit-content; padding-right : 10px; margin-bottom : 10px; background:linear-gradient(90deg, #292e49 0%,#536976 100% );"

    const image = document.createElement("img");
	image.src  = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/320px-IMDB_Logo_2016.svg.png";
    //image.src = "/img/IMDB.png";
    image.width = "50";
    image.style = "vertical-align:middle";

    const Metaimage = document.createElement("img");
	Metaimage.src  = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Metacritic.svg/88px-Metacritic.svg.png";
    //Metaimage.src = "/img/Metacritic.png";
    Metaimage.height = "25.16";
    Metaimage.style = "vertical-align:middle";

    const alloimage = document.createElement("img");
	//alloimage.src  = "https://assets.allocine.fr/skin/img/logo-allocine-287bbe0668.svg";
    alloimage.src = "https://assets.allocine.fr/favicon/allocine.ico";
    //alloimage.src = "/img/allocine.ico";
    alloimage.height = "25.16";
    alloimage.style = "vertical-align:middle; margin-right : 0px";
    

    const a = document.createElement("a");
    if (Note != "??"){
        a.href = "https://www.imdb.com/title/" + id + "?ref_=nv_sr_srsg_0";
        a.target = '_blank';
        a.style = "margin-right : 10px; align-items: center; margin-left : 10px; margin-bottom : 10px";
        
    } else {
        console.log("No link IMDB");
        a.style = "cursor : default; margin-right : 10px; align-items: center; margin-left : 10px; margin-bottom : 10px";
    }
    
    a.id = "lelienpourallersurimsb";
    
    a.title = "Note donnée par les gens";
    

    const am = document.createElement("a");
    if (meta != "??"){
        am.href = metaurl;
        am.target = '_blank';
        am.style = "margin-right : 10px; align-items: center; margin-left : 10px; margin-bottom : 10px";

        
    } else {
        console.log("No link Metacritique");
        am.style = "cursor : default; margin-right : 10px; align-items: center; margin-left : 10px; margin-bottom : 10px";
    }
    
    
    am.id = "lelienpourallersurmeta";
    am.title = "Note donnée par métacritique";

    const aa = document.createElement("a");
    if (allo != "??"){
        aa.href = allourl;
        aa.target = '_blank';
        aa.style = "margin-right : 10px; align-items: center; margin-left : 10px; margin-bottom : 10px";
        
    } else {
        if (allourl != "") {
            aa.href = allourl;
            aa.target = '_blank';
            aa.style = "margin-right : 10px; align-items: center; margin-left : 10px; margin-bottom : 10px;";
        } else {
            console.log("No link Allociné");
            aa.style = "cursor : default; margin-right : 10px; align-items: center; margin-left : 10px; margin-bottom : 10px";
        }
        
    }
    aa.id = "lelienpourallersurallo";
    //aa.style = "margin-right : 10px;";
    aa.title = "Note Allociné " + allo;
    //aa.style = "align-items: center; margin-bottom : 10px; margin-left : 10px"

    const etoile = document.createElement("img");
    etoile.src = "https://images.emojiterra.com/twitter/v13.0/128px/2b50.png";
    etoile.width = "25";
    etoile.style = "vertical-align:middle";

    const etoileh = document.createElement("img");
    etoileh.src = "https://images.emojiterra.com/twitter/v13.0/128px/2b50.png";
    etoileh.width = "25";

    const ImDBNote = document.createElement("span");
    ImDBNote.textContent = " " + Note;
    ImDBNote.style = "vertical-align: baseline;";
    ImDBNote.style = "font-weight : bold";

    const metanote = document.createElement("span");
    metanote.textContent = " " + meta;
    metanote.style = "font-weight : bold";

    const allonote = document.createElement("span");
    allonote.style = "display : flex; font-weight : bold;";
    allonote.id = "euhgtpasinspirepourmonidalorsjedonneceluila"
    
    //allonote.textContent = " " + allo;
    
    
    

    function knowifitisgood(str, base){
        if (str === "??") {
            return "color : white"
        } else {
            if (str.includes("%") == true) {
                str = str.replaceAll("%", "/100");
            }
            var note = parseFloat(str.split('/'), 10);
            if (base == 5) {
                note = note * 2;
            }
            var color;
            if (note >= 7 * base / 10) {
                color = "color : #5fc478";
                
            } else if (note < 7 * base / 10 && note > 5.5 * base / 10) {
                color = "color : yellow";
            } else {
                color = "color : #FF4136";
            }
            return color
        }
        

        

        
        
    }

    if (IMDBStatus){
        ImDBNote.style = knowifitisgood(Note, 10);
    }
    if (MetaStatus){
        metanote.style = knowifitisgood(meta, 100);
    }
    if (AlloStatus){
        allonote.style = knowifitisgood(allo, 5);
        
    }
    
    
    

    document.querySelector(".previewModal--detailsMetadata-info").prepend(container);
    document.querySelector(".previewModal--detailsMetadata-info").innerHTML  += "<br />";
    
    
    

    for (let pas = 0; pas < elinorder.length; pas++) {
        var incheck = elinorder[pas];
        if (IMDBStatus  && incheck === "IMDB") {
            document.querySelector("#jesuislecontainerdelanoteimdb").appendChild(a);
            document.querySelector("#lelienpourallersurimsb").appendChild(image);
            document.querySelector("#lelienpourallersurimsb").appendChild(ImDBNote);
        }
        if (MetaStatus  && incheck === "Metacritic") {
            document.querySelector("#jesuislecontainerdelanoteimdb").appendChild(am);
            document.querySelector("#lelienpourallersurmeta").appendChild(Metaimage);
            document.querySelector("#lelienpourallersurmeta").appendChild(metanote);
        }
        if (AlloStatus  && incheck === "Allociné") {
            document.querySelector("#jesuislecontainerdelanoteimdb").appendChild(aa);
            document.querySelector("#lelienpourallersurallo").appendChild(alloimage);
            document.querySelector("#lelienpourallersurallo").appendChild(allonote);
            var monelement = document.querySelector("#euhgtpasinspirepourmonidalorsjedonneceluila");
            

            if (allo != "??") {
                var reste = allo.split(',')[1];
                var reste = parseInt(reste);
                console.log(reste);
                var coolnote = parseFloat(allo);
                console.log(coolnote);

                
                for (let pas = 0; pas < coolnote; pas++) {
                    monelement.appendChild(etoile.cloneNode(true));
                }
                var togo = 5;
                if (reste > 0) {
                    
                    etoileh.style = "vertical-align:middle; clip-path: inset(0px " + (100 - reste * 10).toString() + "% 0px 0);";
                    monelement.appendChild(etoileh.cloneNode(true));
                    etoileh.style = "vertical-align:middle; clip-path: inset(0px 0px 0px " + (reste * 10).toString() + "%); filter : grayscale(100%); margin-left : -25px";
                    monelement.appendChild(etoileh.cloneNode(true));
                    togo = 4;

                } else {
                    console.log("Note parfaite");
                }
                
                
                
                etoileh.style = "vertical-align:middle; filter : grayscale(100%);";

                for (let pas = 0; pas < togo - coolnote; pas++) {
                    monelement.appendChild(etoileh.cloneNode(true));
                }
            } else {
                monelement.textContent = "??";
            }
            
        }
    }

    
    
    //document.querySelector("#lelienpourallersurmeta").appendChild(Metaimage);
    //document.querySelector("#lelienpourallersurmeta").appendChild(metanote);

    //document.querySelector("#lelienpourallersurallo").appendChild(alloimage);
    //document.querySelector("#lelienpourallersurallo").appendChild(allonote);
    /*
    var monelement = document.querySelector("#euhgtpasinspirepourmonidalorsjedonneceluila");
    var reste = allo.split(',')[1];
    var reste = parseInt(reste);
    console.log(reste);

    var coolnote = parseFloat(allo);
    console.log(coolnote);
    for (let pas = 0; pas < coolnote; pas++) {
        monelement.appendChild(etoile.cloneNode(true));
    }
    if (reste > 0) {
        etoileh.style = "vertical-align:middle; clip-path: inset(0px " + (100 - reste * 10).toString() + "% 0px 0);";
        monelement.appendChild(etoileh.cloneNode(true));
    }
    
    etoileh.style = "vertical-align:middle; clip-path: inset(0px 0px 0px " + (reste * 10).toString() + "%); filter : grayscale(100%); margin-left : -25px";
    monelement.appendChild(etoileh.cloneNode(true));
    
    etoileh.style = "vertical-align:middle; filter : grayscale(100%);";

    for (let pas = 0; pas < 4 - coolnote; pas++) {
        monelement.appendChild(etoileh.cloneNode(true));
    }
    */
    }
}