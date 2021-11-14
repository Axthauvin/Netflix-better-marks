window.addEventListener("DOMContentLoaded", function(){
    slist("sortlist");
  });
if (localStorage.getItem("choses") === null) {
  var choses = [{nom : "IMDB", status : true}, {nom : "Metacritic", status : true}, {nom : "Allociné", status : true}];
  localStorage.setItem("choses", JSON.stringify(choses))
}

function getall(){
    
    return JSON.parse(localStorage.getItem("choses"));
}

function changevalue(nom){
    var things = getall();
    console.log(things);
    for (let pas = 0; pas < things.length; pas++) {
        var actual = document.querySelectorAll(".list-item")[pas];
        var name = actual.textContent;
        var val = document.querySelector("#"+name).checked;
        things[pas] = {nom : name, status : val};
        
    }
    console.log(things);
    localStorage.setItem("choses", JSON.stringify(things));
    /*
    for (let pas = 0; pas < fin.length; pas++) {
        if (things[pas].nom === nom){
            

            if (things[pas].status === true){
              things[pas].status = false;
            } else if (fin[pas].status === false){
              things[pas].status = true;
                
            }
            console.log(things);
            localStorage.setItem("choses", JSON.stringify(fin));
            fin = [];
            break
        }
    }
    */
}

function set(c){
    var container = document.querySelector("ul");
    for (let pas = 0; pas < c.length; pas++) {
        
        const truc = document.createElement("img");
        var nom = c[pas].nom;
        var src = nom;
        if (src === "IMDB"){
            src = "IMDB.png";
        }
        if (src === "Metacritic"){
            src = "Metacritic.png";
        }
        if (src === "Allociné"){
            src = "allocine.ico";
        }
        src = "./img/" + src;

        truc.src = src;
        truc.height = "25"

        const text = document.createElement("span")
        text.textContent = nom;
        text.style = "margin-left : 10px";

        const li = document.createElement("li");
        li.className = "list-item";
        li.title = nom;
        
        container.appendChild(li.cloneNode(true));
        const div = document.createElement("div");
        div.className = "bordure";

        const input = document.createElement("input");
        input.type = "checkbox";
        //console.log(c[pas].status)
        //input.checked = c[pas].status;
        console.log(nom + " : " + c[pas].status.toString())
        input.checked = c[pas].status;
        input.id = nom;
        
        //input.addEventListener("change",);
        //input.onclick = changevalue(nom);
        //input.onclick = console.log("hey !");


        var lastli = document.querySelectorAll("li")[document.querySelectorAll("li").length - 1];
        lastli.appendChild(div.cloneNode(true));

        var lastdiv = document.querySelectorAll("div")[document.querySelectorAll("div").length - 1];
        lastdiv.appendChild(input.cloneNode(true));
        lastdiv.appendChild(truc.cloneNode(true));
        lastdiv.appendChild(text.cloneNode(true));
    }

        document.addEventListener('DOMContentLoaded', function () {
            var btn = document.getElementById("IMDB");
            btn.addEventListener('click', function() {
                changevalue("IMDB");
            });
            var btn = document.getElementById("Metacritic");
            btn.addEventListener('click', function() {
                changevalue("Metacritic");
            });
            var btn = document.getElementById("Allociné");
            btn.addEventListener('click', function() {
                changevalue("Allociné");
            });
        });
        var dernier = document.querySelectorAll(".list-item")[document.querySelectorAll(".list-item").length - 1];
        dernier.style = "border-bottom : 0";
}

choses = getall();
set(choses);

function slist (target) {
    // (A) GET LIST + ATTACH CSS CLASS
    target = document.getElementById(target);
    target.classList.add("slist");
  
    // (B) MAKE ITEMS DRAGGABLE + SORTABLE
    var items = target.getElementsByTagName("li"), current = null;
    for (let i of items) {
      // (B1) ATTACH DRAGGABLE
      i.draggable = true;
      
      // (B2) DRAG START - YELLOW HIGHLIGHT DROPZONES
      i.addEventListener("dragstart", function (ev) {
        current = this;
        for (let it of items) {
          if (it != current) { it.classList.add("hint"); }
        }
      });
      
      // (B3) DRAG ENTER - RED HIGHLIGHT DROPZONE
      i.addEventListener("dragenter", function (ev) {
        if (this != current) { this.classList.add("active"); }
      });
  
      // (B4) DRAG LEAVE - REMOVE RED HIGHLIGHT
      i.addEventListener("dragleave", function () {
        this.classList.remove("active");
      });
  
      // (B5) DRAG END - REMOVE ALL HIGHLIGHTS
      i.addEventListener("dragend", function () {
        for (let it of items) {
          it.classList.remove("hint");
          it.classList.remove("active");
        }
      });
      
      // (B6) DRAG OVER - PREVENT THE DEFAULT "DROP", SO WE CAN DO OUR OWN
      i.addEventListener("dragover", function (evt) {
        evt.preventDefault();
      });
      
      // (B7) ON DROP - DO SOMETHING
      i.addEventListener("drop", function (evt) {
        evt.preventDefault();
        if (this != current) {
          let currentpos = 0, droppedpos = 0;
          for (let it=0; it<items.length; it++) {
            if (current == items[it]) { currentpos = it; }
            if (this == items[it]) { droppedpos = it; }
          }
          if (currentpos < droppedpos) {
            this.parentNode.insertBefore(current, this.nextSibling);
          } else {
            this.parentNode.insertBefore(current, this);
          }
          var dernier = document.querySelectorAll(".list-item")[document.querySelectorAll(".list-item").length - 1];
          dernier.style = "border-bottom : 0";
          console.log(dernier);
          for (let it=0; it < document.querySelectorAll(".list-item").length - 1; it++) {
            document.querySelectorAll(".list-item")[it].style = "border-bottom : solid 2px #595959;"
          }
          
          changevalue(i.id);
        }

      });
    }
  }



function changelang(){
  var fr = "https://images.emojiterra.com/twitter/512px/1f1eb-1f1f7.png"
  var en = "https://images.emojiterra.com/twitter/v13.0/512px/1f1ec-1f1e7.png"
  var txtdetector = document.getElementById("txt").textContent;
  if (txtdetector.includes("English")) {
    document.getElementById("txt").textContent = "Changer vers Français";
    document.getElementById("flag").src = en;
    document.getElementById("Title").textContent = "Choose the order and activation of the sites whose notes you want to add :";
    document.getElementsByClassName("signature")[0].textContent = "By Axel Thauvin";
    document.getElementById("open").textContent = "Open Netflix";
  } else {
    document.getElementById("txt").textContent = "Switch to English";
    document.getElementById("flag").src = fr;
    document.getElementById("Title").textContent = "Choisir l'ordre et l'activation des sites dont vous voulez ajouter les notes :";
    document.getElementsByClassName("signature")[0].textContent = "Par Axel Thauvin";
    document.getElementById("open").textContent = "Ouvrir Netflix";
  }
}


document.getElementById("Switchlanguage").addEventListener("click", changelang);

