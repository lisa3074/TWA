let albums = [];
/* const url = "https://lisabianca.dk/eksamen2/wordpress/wp-json/wp/v2/udgivelser?per_page=100";
const trackUrl = "https://lisabianca.dk/eksamen2/wordpress/wp-json/wp/v2/lyric?per_page=100";
const videoUrl = "https://lisabianca.dk/eksamen2/wordpress/wp-json/wp/v2/videoer?per_page=100";
const billedeUrl = "https://lisabianca.dk/eksamen2/wordpress/wp-json/wp/v2/billede?per_page=100";
const koncertUrl = "https://lisabianca.dk/eksamen2/wordpress/wp-json/wp/v2/koncert?per_page=100";
const bioUrl = "https://lisabianca.dk/eksamen2/wordpress/wp-json/wp/v2/biografi";
const kontaktUrl = "https://lisabianca.dk/eksamen2/wordpress/wp-json/wp/v2/kontakt"; */

const url =
  "https://thewhitealbum.dk/wordpress/wp-json/wp/v2/udgivelser?per_page=100";
const trackUrl =
  "https://thewhitealbum.dk/wordpress/wp-json/wp/v2/lyric?per_page=100";
const videoUrl =
  "https://thewhitealbum.dk/wordpress/wp-json/wp/v2/videoer?per_page=100";
const billedeUrl =
  "https://thewhitealbum.dk/wordpress/wp-json/wp/v2/billede?per_page=100";
const koncertUrl =
  "https://thewhitealbum.dk/wordpress/wp-json/wp/v2/koncert?per_page=100";
const bioUrl = "https://thewhitealbum.dk/wordpress/wp-json/wp/v2/biografi";
const kontaktUrl = "https://thewhitealbum.dk/wordpress/wp-json/wp/v2/kontakt";

let q = new Date();
let m = q.getMonth() + 1;
let d = q.getDay();
let y = q.getFullYear();

// Karrusellens tæller
let caroCurrentNum;
const albumListe = document.querySelector("#udgivelses_liste");
const trackListe = document.querySelector("#track_liste");
const videoListe = document.querySelector("#video_liste");
const koncertListe = document.querySelector("#koncert_liste");
let filter = "alle";
const filterknapper = document.querySelectorAll(".filter");
const sorterknapper = document.querySelectorAll(".sorter");
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const udgivelser = urlParams.get("udgivelser");
let count;

let index = document.querySelector(".start");
let koncert = document.querySelector(".koncerter");
let kontakt = document.querySelector(".kontakt_side");
let biografi = document.querySelector(".biografi");
let UdgivelserDetaljer = document.querySelector(".albums");
let videoer = document.querySelector(".video");
let billede = document.querySelector(".billede");

document.addEventListener("DOMContentLoaded", tjek);

//STARTFUNKTION DER TJEKKER PÅ SIDENS BREDDE OG SÆTTER INDEXFUNKTIONER I GANG

function tjek() {
  document.removeEventListener("DOMContentLoaded", tjek);
  console.log("tjek");
  setHeight();

  //Hvis index->
  if (index) {
    document.querySelector(".pil_ned").addEventListener("click", function () {
      index.classList.add("fade_out");
      //Der er sat en time-out for at index kan nå at fade ud inden
      setTimeout(function () {
        location.href = "concerts.html";
      }, 500);
    });
    document.querySelector("body").addEventListener("mousewheel", function () {
      //Der er sat en time-out for at index kan nå at fade ud inden
      index.classList.add("fade_out");
      setTimeout(function () {
        location.href = "concerts.html";
      }, 500);
    });

    // For at firefox kan fire scroll-event
    document.addEventListener("DOMMouseScroll", function () {
      index.classList.add("fade_out");
      setTimeout(function () {
        location.href = "koncerter.html";
      }, 500);
    });

    document.querySelector("body").addEventListener("touchmove", function () {
      index.classList.add("fade_out");
      setTimeout(function () {
        location.href = "koncerter.html";
      }, 500);
    });
  }

  if (!index) {
    document.querySelector("footer").classList.remove("hide");
    document.querySelector("footer").classList.add("opacity_slow");
    document.querySelector(".content").scrollTo(0, 0);
    document.querySelector(".content").scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  //Hvis billede-side->
  if (billede) {
    filter = "alle";
    billedeStorrelse();
    document.querySelector("#billede_liste").classList.remove("hide");
    document.querySelector("#billede_liste").classList.add("height");
    setInterval(function () {
      document.querySelector("#billede_liste").classList.remove("height");
    }, 2500);
    changeCheckedPics();
    koer();
  }
  if (videoer || billede) {
    //Sorteringsfunktion (drop down)
    document.querySelector(".dropD").addEventListener("change", function () {
      console.log("filtreingsdrop");
      filtreringDrop();
    });
  }
  //Hvis video-side->
  if (videoer) {
    console.log("start video");
    filter = "alle";
    document.querySelector("#video_liste").classList.remove("hide");
    document.querySelector("#video_liste").classList.add("opacity_delay");
    setInterval(function () {
      document.querySelector("#video_liste").classList.remove("opacity_delay");
    }, 3500);
    changeChecked();
  }
  //Hvis koncert-side->
  if (koncert) {
    document.querySelector("#koncert_liste").classList.remove("hide");
    document.querySelector("#koncert_liste").classList.add("height");
    setInterval(function () {
      document.querySelector("#koncert_liste").classList.remove("height");
    }, 2500);
    dropDownMenu();
    sorterKoncerter();
  }

  if (
    UdgivelserDetaljer ||
    videoer ||
    billede ||
    koncert ||
    biografi ||
    kontakt
  ) {
    json();
  }
  if (kontakt) {
    document.querySelector(".move").classList.remove("hide");
    document.querySelector(".move").classList.add("left_fast");
    setInterval(function () {
      document.querySelector(".move").classList.remove("left_fast");
    }, 2500);
  }

  if (UdgivelserDetaljer) {
    document.querySelector(".content").classList.remove("hide");
    document.querySelector(".content").classList.add("small_big");
    setInterval(function () {
      document.querySelector(".content").classList.remove("small_big");
    }, 3500);
  }

  if (biografi) {
    document.querySelector(".content").classList.remove("hide");
    document.querySelector(".content").classList.add("opacity_semi");
    setInterval(function () {
      document.querySelector(".content").classList.remove("opacity_semi");
    }, 2500);
    document.querySelector(".scroll").classList.remove("hide");
    document.querySelector(".scroll").classList.add("height");
    setInterval(function () {
      document.querySelector(".scroll").classList.remove("height");
    }, 2500);
  }

  //Hvis bredden er mindre en 1000px ->
  if (innerWidth < 1000) {
    console.log("tjek = mobil");
    fordel();
  } else {
    console.log("tjek = desktop");
    fordelDesk();
  }
}

function setHeight() {
  console.log("setHeight");
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  console.log(vh);
}

// ----------- FORDELERE PÅ SIDER (MOBIL/DESKTOP) ------------------

function fordel() {
  console.log("fordel");
  //Specificerede sider, da index ikke har en burgermenu (melder ellers fejl i konsol)
  if (
    koncert ||
    kontakt ||
    biografi ||
    UdgivelserDetaljer ||
    videoer ||
    billede
  ) {
    document.querySelector(".burgermenu").classList.remove("hide");
    document.querySelector(".burgermenu").classList.add("opacity");
    document.querySelector("#menuknap").addEventListener("click", burgerMenu);
  }

  if (koncert) {
    //Sorteringsfunktion (drop down) kommende/overståede koncerter
    document.querySelector(".dater").addEventListener("change", function () {
      console.log("koncerter drop");

      //Når værdien af den valgte option er overståede ->
      if (event.target.value == "Overstaede") {
        hentOverstaedeKoncerter();
      }
      //Når værdien af den valgte option er kommende ->
      if (event.target.value == "Kommende") {
        omraade();
      }
    });
  }
}

function fordelDesk() {
  //Specificerede sider, da index ikke har en menu (melder ellers fejl i konsol)
  if (
    kontakt ||
    biografi ||
    UdgivelserDetaljer ||
    videoer ||
    billede ||
    koncert
  ) {
    console.log("fordelDesk");
    dropDownMenu();
  }

  if (koncert) {
    console.log("right");
    //Start animation på sorteringsmenu
    document.querySelector(".overstaet").classList.remove("hide");
    document.querySelector(".overstaet").classList.add("right");
    document.querySelector(".overstaet").classList.add("color2");
  }
}

// ----------- INDLÆSNING AF DYNAMISK INDHOLD/JSON ------------------

async function json() {
  if (billede) {
    console.log("json billeder");
    //indlæsning af json
    let response = await fetch(billedeUrl);
    //Vent til alt er hentet
    billeder = await response.json();
    hentBilleder();
  }
  if (videoer) {
    console.log("json videoer");
    const response = await fetch(videoUrl);
    video = await response.json();
    console.log(video);
    hentVideo();
  }
  if (UdgivelserDetaljer) {
    console.log("json udgivelser");
    const response = await fetch(url);
    albums = await response.json();
    console.log(albums);
    albumSortering();
  }

  if (koncert) {
    console.log("json koncerter");
    const response = await fetch(koncertUrl);
    koncerter = await response.json();
    console.log(koncerter);
    filter = "alle";
    hentKommendeKoncerter();
  }

  if (biografi) {
    console.log("json biografi");
    const response = await fetch(bioUrl);
    biografien = await response.json();
    console.log(biografien);
    hentBio();
  }
  if (kontakt) {
    console.log("json kontakt");
    const response = await fetch(kontaktUrl);
    kontakten = await response.json();
    console.log(kontakten);
    hentKontakt();
  }
}

async function hentJsonLyrics() {
  //seperat funktion, da udgivelsesdetaljerne er en popup og altså på samme side som albums.
  //Denne json hentes kun, hvis der bliver bedt om albumdetaljer.
  const response = await fetch(trackUrl);
  sange = await response.json();
  console.log(sange);
  lyrics();
}

// ----------- KONCERTER ------------------

function sorterKoncerter() {
  let valgt = document.querySelector(".valgt_kategori");
  console.log("sorterKoncerter");
  //lytter på klik på kommende
  document.querySelector(".kommende").addEventListener("click", function () {
    //roterer pil 180deg (tilbage)
    document.querySelector(".stor_pil").classList.remove("rotate_arrow");
    //Starter animation på overstået
    document.querySelector(".overstaet").classList.add("color");
    //Fjerner animationsklassen på kommende
    document.querySelector(".kommende").classList.remove("color");
    //Fjerner hide-klasse på overstået
    document.querySelector(".overstaet").classList.remove("hide");
    //Sætter filter til alle, som siden starter med (alle kommende)
    filter = "alle";
    //Sætter overskriften til:
    valgt.textContent = "UPCOMING CONCERTS";
    //Sætter hide-klasse på kommende
    document.querySelector(".kommende").classList.add("hide");
    //Sætter filter/value til alle på den geografiske sortering
    document.querySelector("#geo").value = "alle";
    omraade();
  });

  document.querySelector(".overstaet").addEventListener("click", function () {
    console.log("Overståede");
    document.querySelector(".stor_pil").classList.add("rotate_arrow");
    document.querySelector(".overstaet").classList.remove("color");

    document.querySelector(".overstaet").classList.remove("right");
    document.querySelector(".overstaet").classList.remove("color2");
    document.querySelector(".kommende").classList.add("color");
    document.querySelector(".kommende").classList.remove("hide");
    filter = "alle";
    valgt.textContent = "PAST CONCERTS";
    document.querySelector(".overstaet").classList.add("hide");
    hentOverstaedeKoncerter();
  });

  document
    .querySelector(".geoSorteringKoncerter")
    .addEventListener("change", function () {
      //Når drop down (geo sortering mobil) ændrer option - >
      omraade();
    });
  document.querySelector(".sted").addEventListener("change", function () {
    //Når drop down (geo sortering desktop) ændrer option - >
    omraadeDesk();
  });
}

function omraade() {
  //ryd op
  document
    .querySelector(".dater")
    .removeEventListener("change", function () {});
  document
    .querySelector(".geoSorteringKoncerter")
    .removeEventListener("change", function () {});

  document.querySelector("#koncert_liste").classList.add("opacity");
  setTimeout(function () {
    document.querySelector("#koncert_liste").classList.remove("opacity");
  }, 1000);

  //Sætter den valgte value/option som en variabel
  let geo = document.querySelector(".geo").value;
  console.log("omraadeMobil");
  console.log(geo);
  //Sætter filter til valgt value/option
  filter = geo;
  hentKommendeKoncerter();
}

function omraadeDesk() {
  //ryd op
  document.querySelector(".sted").removeEventListener("change", function () {});
  document.querySelector("#koncert_liste").classList.add("opacity");
  document.querySelector(".if_none").classList.add("opacity");
  setTimeout(function () {
    document.querySelector(".if_none").classList.remove("opacity");
    document.querySelector("#koncert_liste").classList.remove("opacity");
  }, 1000);
  //Sætter den valgte value/option som en variabel
  let geoId = document.querySelector("#geo").value;
  console.log("omraadeDesk");
  console.log(geoId);
  //Sætter filter til valgt value/option
  filter = geoId;
  hentKommendeKoncerter();
}

function hentKommendeKoncerter() {
  //ryd op
  document
    .querySelector(".kommende")
    .removeEventListener("click", hentKommendeKoncerter);
  console.log("hentKommendeKoncerter");
  const koncertListe = document.querySelector("#koncert_liste");

  //tøm elementer, så nyt indhold kan læses ind
  koncertListe.innerHTML = "";
  document.querySelector(".if_none").innerHTML = "";

  //Definer template/skabelon
  const koncertSkabelon = document.querySelector(".events");
  let liveShow = document.querySelector(".liveShow");
  let geografi = document.querySelector("#geo");
  let landsdel = document.querySelector(".landsdel");
  console.log("kommende koncerter1");

  //Vis sortering
  document.querySelector(".geoSorteringKoncerter").classList.remove("hide");
  document.querySelector(".sted").classList.remove("not_visible");

  //sorterer datoer inden vi looper det ind i kloner
  koncerter.sort((a, b) => new Date(a.dato) - new Date(b.dato));
  console.log("sorter dato");
  //For hver koncert (post) så->
  koncerter.forEach((show) => {
    //definering af i hvilken rækkefølge dags dato og dato i json-fil skal læses ind (skal være sammenlignelige)
    let iDag = new Date(y, m, d);
    let koncertDato = new Date(show.aar, show.maaned, show.dag);

    //Hvis koncertdate er større end i dag og geofilter matcher det valgte filter ->
    if (
      (koncertDato > iDag && show.geografi == filter) ||
      (koncertDato > iDag && filter == "alle")
    ) {
      console.log("kommende koncerter");
      //definering af det indhold, som er i skabelonen
      const klon = koncertSkabelon.cloneNode(true).content;
      //Klon det ønskede indhold ind på den ønskede plads
      klon.querySelector(".koncert_sted").textContent = show.spillested;
      klon.querySelector(".dag").textContent = "Date: " + show.dag + ".";
      klon.querySelector(".maaned").textContent = show.maaned + ".";
      klon.querySelector(".aar").textContent = show.aar;
      klon.querySelector(".by").textContent = "City: " + show.info_by;
      klon.querySelector(".pris").textContent = "Price: " + show.pris;
      //Hvis der ikke er indtastet et tidspunkt -> lad teksten være tom
      if (show.tid == "") {
        klon.querySelector(".tid").textContent = "";
        //Ellers så skriv tiden ud i html
      } else {
        klon.querySelector(".tid").textContent = " Time: " + show.tid;
      }
      //Hvis der ikke er indtastet et link til billetsalg ->
      //Skriv Billet tba i html, gør teksten sort, fjern href-attributten, så der ikke kan klikkes
      if (show.billetsalg == "") {
        klon.querySelector(".billet_link").textContent = "BILLET TBA";
        klon.querySelector(".billet_link").classList.add("sort_ish");
        klon.querySelector(".billet_link_boks").removeAttribute("href");
        klon.querySelector(".billet_link_boks").classList.add("disabled");
        klon.querySelector(".liveShow").classList.add("disabled");
        //Hvis der er indtastet link -> sæt link som source på boks og tekst
      } else {
        klon.querySelector(".billet_link").href = show.billetsalg;
        klon.querySelector(".billet_link_boks").href = show.billetsalg;
      }
      //Udskriv klonerne til koncertListe
      koncertListe.appendChild(klon);
    }
  });
  message();
}

function hentOverstaedeKoncerter() {
  //Se ovenstående kommentering
  console.log("hentOverstaedeKoncerter");
  document.querySelector(".geomobil").value = "alle";
  document
    .querySelector(".dater")
    .removeEventListener("change", function () {});
  document
    .querySelector(".overstaet")
    .removeEventListener("click", hentOverstaedeKoncerter);
  const koncertListe = document.querySelector("#koncert_liste");
  koncertListe.innerHTML = "";
  const koncertSkabelon = document.querySelector(".events");
  let liveShow = document.querySelector(".liveShow");

  document.querySelector(".geoSorteringKoncerter").classList.add("hide");
  document.querySelector(".sted").classList.add("not_visible");

  //sorterer datoer inden vi looper det ind i kloner
  koncerter.sort((a, b) => new Date(b.dato) - new Date(a.dato));

  koncerter.forEach((show) => {
    let iDag = new Date(y, m, d);
    let koncertDato = new Date(show.aar, show.maaned, show.dag);

    if (koncertDato < iDag) {
      console.log("Overståede koncerter");
      const klon = koncertSkabelon.cloneNode(true).content;

      klon.querySelector(".koncert_sted").textContent = show.spillested;
      klon.querySelector(".dag").textContent = "Dato: " + show.dag + ".";
      klon.querySelector(".maaned").textContent = show.maaned + ".";
      klon.querySelector(".aar").textContent = show.aar;
      klon.querySelector(".by").textContent = "By: " + show.info_by;
      klon.querySelector(".pris").textContent = "Pris: " + show.pris;
      if (show.tid == "") {
        klon.querySelector(".tid").textContent = "";
      } else {
        klon.querySelector(".tid").textContent = " kl. " + show.tid;
      }
      klon.querySelector(".billet_link").classList.add("hide");
      klon.querySelector(".billet_link_boks").removeAttribute("href");
      klon.querySelector(".liveShow").classList.add("disabled");
      koncertListe.appendChild(klon);
    }
  });
  message();
}

function message() {
  console.log("message");
  let none = document.querySelector(".if_none");
  //Hvis der er flere end 0 children (Der er min. 1 koncert) -> Udskriv inden tekst i none, fjern baggrund
  if (koncertListe.children.length > 0) {
    console.log("yes");
    none.textContent = "";
    none.classList.remove("hvid_bg");

    //Ellers udskriv tekst i none og tilføj baggrund
  } else {
    console.log("no");
    none.textContent = "Lige nu er der desværre ingen koncerter her :(";
    none.classList.add("hvid_bg");
  }
}

// ----------- BILLEDER ------------------

function hentBilleder() {
  //Ryd op
  document.querySelector(".kryds").removeEventListener("click", function () {});
  document.querySelector(".pics").removeEventListener("click", function () {});
  console.log("hentBilleder");
  const billedeListe = document.querySelector("#billede_liste");
  billedeListe.innerHTML = "";
  const billedeSkabelon = document.querySelector(".billedeframe");
  const popUpBil = document.querySelector(".popup_billede");
  const pics = document.querySelector(".pics_container");

  billedeListe.classList.add("opacity");
  setTimeout(function () {
    billedeListe.classList.remove("opacity");
  }, 1000);

  // Antallet af billeder der kommer til at være i karrusellen, kender vi ikke før vi har loaded vores JSON
  //Tælleren starter på 0 og tæller en for hvert billede der loades fra json
  count = 0;

  //For hvert billede i json-filen->
  billeder.forEach((pic) => {
    //Hvis billedets kategori er det samme som filteret (Den kategori der er klikket på) eller hvis filteret er alle ->
    if (pic.kategori == filter || filter == "alle") {
      //Tæl en op for hver gang et billede opfylder kravet
      count++;
      //console.log(count++);
      console.log("billeder");
      const klon = billedeSkabelon.cloneNode(true).content;
      //Udskriv billedets source, set billedets id til det tal count er oppe på, og sæt billedets alt
      klon.querySelector("img").src = pic.billeder.guid;
      klon.querySelector("img").setAttribute("id", count);
      klon.querySelector("img").alt = pic.billeder.post_title;
      //Ved klik på billedet ->
      klon.firstElementChild.addEventListener("click", function () {
        //Definer id som billedets id - 1
        let id = this.getAttribute("id") - 1;
        console.log(-id + "00");
        console.log("billedeklik + ccNum: " + caroCurrentNum);
        //Tøm billedlisten
        document.querySelector(".pics").innerHTML = "";

        pics.classList.add("small_big_open");
        popUpBil.classList.add("opacity_fast");
        setTimeout(function () {
          pics.classList.remove("small_big_open");
          popUpBil.classList.remove("opacity_fast");
        }, 1000);

        //Vis popup og udskriv valgte ting til valgte positioner
        popUpBil.classList.remove("hide");
        //Sæt positionen på billedlisten til id + 00 + %, for at ramme præcis der, hvor det klikkede billede ligger på listen
        document.querySelector(".pics").style.left = -id + "00" + "%";
        //Vis popup
        popUpBil.classList.remove("hide");
        //Sæt coroCurrentNum til variablen id
        caroCurrentNum = id;
        buildCarousel();
      });
      //Udskriv alle billeder til html
      billedeListe.appendChild(klon);
    }
  });
  document.querySelector(".kryds").addEventListener("click", close);
  document.querySelector(".pics").addEventListener("click", close);
}

function close() {
  //ryd op
  document.querySelector(".kryds").removeEventListener("click", close);
  document.querySelector(".pics").removeEventListener("click", close);

  const pics = document.querySelector(".pics_container");
  const popUpBil = document.querySelector(".popup_billede");
  //Gem popup og reset caroCurrentNum (til 0)
  pics.classList.add("small_big_close");
  popUpBil.classList.add("opacity_reverse");
  setTimeout(function () {
    pics.classList.remove("small_big_close");
    popUpBil.classList.remove("opacity_reverse");
    popUpBil.classList.add("hide");
  }, 500);
  //caroCurrentNum = undefined;
  console.log("close + ccNum: " + caroCurrentNum);
  hentBilleder();
}

function koer() {
  console.log("koer");
  //Ved klik på -> send variabel med videre
  document.querySelector(".fwd").addEventListener("click", function () {
    fwd();
    console.log("fwd klik");
  });
  //document.querySelector(".bwd").addEventListener("click", bwd);
  document.querySelector(".bwd").addEventListener("click", function () {
    bwd();
    console.log("bwd klik");
  });
}

function buildCarousel() {
  console.log("buildCarousel");
  // Antallet af billeder i karrusellen svarer til længden af arrayet med billederne (count)
  // Vi sætter bredden af pics så den passer med antallet af billeder
  document.querySelector(".pics").style.width = `${count * 100}%`;

  //for hver billede i array'et ->
  billeder.forEach((pic) => {
    //Hvis billedets kategori passer med det valgte filter
    if (pic.kategori == filter || filter == "alle") {
      console.log("buildcaro");
      const theClone = document.querySelector("template").cloneNode(true)
        .content;
      theClone.querySelector("img").src = pic.billeder.guid;
      theClone.querySelector("img").alt = pic.billeder.post_title;
      theClone.querySelector("img").classList.add("minus");

      //Udskriv billeder i .pics
      document.querySelector(".pics").appendChild(theClone);
    }
  });
}

function fwd() {
  //Ryd op
  document.querySelector(".fwd").removeEventListener("click", function () {});
  document.querySelector(".bwd").removeEventListener("click", function () {});
  // Hvis karrusellens tæller er mindre end antallet af billeder minus 1 ->
  if (caroCurrentNum < count - 1) {
    // lægges en til tælleren
    caroCurrentNum++;
    navigate();
  }
  console.log("fwd + ccNum: " + caroCurrentNum);
}

function bwd() {
  //ryd op
  document.querySelector(".fwd").removeEventListener("click", function () {});
  document.querySelector(".bwd").removeEventListener("click", function () {});
  console.log("bwd");
  // Hvis karrusellens tæller er større end nul ->
  if (caroCurrentNum > 0) {
    // trækkes en fra tælleren
    caroCurrentNum--;
    navigate();
  }
  console.log("bwd + ccNum: " + caroCurrentNum);
}

function navigate() {
  console.log("navigate + ccNum: " + caroCurrentNum);
  // Vi flytter .pics billedelisten med caroCurrentNum (som tæller hver gang vi klikker frem eller tilbage) gange 100%
  //På denne måde rykker listen sig med det vi klikker
  document.querySelector(".pics").style.left = `${-caroCurrentNum * 100}%`;

  if (caroCurrentNum < count - 1) {
    // Hvis ikke vi er nået til sidste billede i kaarusellen skal fwd knappen have fuld opacity og cursoren skal være "aktiv"
    document.querySelector(".fwd").style.opacity = 1;
    document.querySelector(".fwd").style.cursor = "pointer";
  } else {
    // ellers skal knappen være næsten gennemsigtig og cursor være inaktiv
    document.querySelector(".fwd").style.opacity = 0.2;
    document.querySelector(".fwd").style.cursor = "default";
  }

  if (caroCurrentNum == 0) {
    // Hvis vi er ved det første billede i kaarusellen skal bwd knappen være inaktiv
    document.querySelector(".bwd").style.opacity = 0.2;
    document.querySelector(".bwd").style.cursor = "pointer";
  } else {
    // ellers skal den være aktiv
    document.querySelector(".bwd").style.opacity = 1;
    document.querySelector(".bwd").style.cursor = "default";
  }
}

function changeCheckedPics() {
  console.log("changeCheckedPics");
  //Lyt for hver radio-button ->
  document.querySelectorAll(".radio-inline").forEach((radioButton) => {
    console.log("selectorAllPics");
    //Hvis den valgte ændres, så sæt filter til den valgte value
    radioButton.addEventListener("change", function () {
      console.log("change filter Pics");
      filter = event.target.value;
      console.log(filter);
      hentBilleder();
    });
  });
}

function billedeStorrelse() {
  console.log("billedeStorrelse");
  document.querySelector(".fwd").removeEventListener("click", function () {});
  document.querySelector(".bwd").removeEventListener("click", function () {});
  let billedeListe = document.querySelector("#billede_liste");
  //Hvis der klikkes på ikonet for lille grid ->
  document.querySelector(".lille").addEventListener("click", function () {
    billedeListe.classList.toggle("opacity");
    setTimeout(function () {
      billedeListe.classList.remove("opacity");
    }, 1500);

    //fjern klassen grid_stor og sæt grid_lille på
    billedeListe.classList.remove("grid_stor");
    billedeListe.classList.add("grid_lille");
    //Gem lille grid ikon
    document.querySelector(".lille").classList.add("hide");
    //Vis stort grid ikon
    document.querySelector(".stor").classList.remove("hide");
  });
  //Hvis der klikkes på ikonet for stor grid ->
  document.querySelector(".stor").addEventListener("click", function () {
    billedeListe.classList.toggle("opacity");
    setTimeout(function () {
      billedeListe.classList.remove("opacity");
    }, 1500);
    billedeListe.classList.add("grid_stor");
    billedeListe.classList.remove("grid_lille");
    document.querySelector(".lille").classList.remove("hide");
    document.querySelector(".stor").classList.add("hide");
  });
}

// ----------- VIDEOER ------------------

function hentVideo() {
  console.log("hentVideo");
  //Tøm liste
  videoListe.innerHTML = "";
  //Tjek om den valgte radiobutton ændrer sig ->
  document.querySelectorAll(".radio-inline").forEach((button) => {
    //Ryd op
    button.removeEventListener("change", function () {});
  });
  const videoSkabelon = document.querySelector(".videoframe");

  videoListe.classList.add("opacity_delay");
  setTimeout(function () {
    videoListe.classList.remove("opacity_delay");
    console.log("delay");
  }, 3500);
  //For hver video i arrayet->
  video.forEach((film) => {
    // Hvis videoens kategori passer med valgte filter eller filteret alle ->
    if (film.kategori == filter || filter == "alle") {
      console.log("Video");
      const klon = videoSkabelon.cloneNode(true).content;
      klon.querySelector("iframe").src = film.link;
      klon.querySelector(".video_title").textContent = film.titel;
      klon.querySelector("iframe").title = film.titel;
      console.log("append");
      videoListe.appendChild(klon);
    }
  });
}

function changeChecked() {
  console.log("changeChecked");
  //Lyt for hver radio-button ->
  document.querySelectorAll(".radio-inline").forEach((button) => {
    console.log("selectorAll");
    //Hvis den valgte ændres, så sæt filter til den valgte value
    button.addEventListener("change", function () {
      console.log("change filter");
      filter = event.target.value;
      console.log(filter);
      hentVideo();
    });
  });
}

// ----------- UDGIVELSER ------------------

function albumSortering(content) {
  //Tøm liste
  albumListe.innerHTML = "";
  console.log("albumSortering");
  const albumSkabelon = document.querySelector(".udgivelsesframe");
  //For hvert album i arrayet
  albums.sort((a, b) => b.udgivet - a.udgivet);
  albums.forEach((cover) => {
    console.log("udgivelse");
    const klon = albumSkabelon.cloneNode(true).content;
    klon.querySelector(".cover_art").src = cover.albumcover.guid;
    klon.querySelector(".album_titel").textContent = cover.udgivelsens_navn;
    //Ved klik på album ->
    klon.firstElementChild.addEventListener("click", function () {
      hentJsonLyrics();
      visDetalje(cover);
    });
    albumListe.appendChild(klon);
  });
}

function visDetalje(cover) {
  console.log("visDetalje");
  console.log(cover);
  let max = document.querySelector(".max");
  let popUp = document.querySelector(".popup_album");
  max.classList.add("small_big_open");
  popUp.classList.add("opacity_fast");
  setTimeout(function () {
    max.classList.remove("small_big_open");
    popUp.classList.remove("opacity_fast");
  }, 1000);

  //Vis popup og udskriv valgte ting til valgte positioner
  popUp.classList.remove("hide");
  console.log("remove hide");
  document.querySelector(".tilbage").addEventListener("click", luk);
  document.querySelector(".cover").src = cover.albumcover.guid;
  document.querySelector(".aarstal").textContent = cover.udgivet;
  document.querySelector(".album_titel2").textContent = cover.udgivelsens_navn;
  document.querySelector(".antal").textContent = cover.sange;
  document.querySelector(".credits").textContent = cover.credits;
  document.querySelector(".nr").textContent = cover.udgivelsens_nummer;
  if (cover.lp == "") {
    document.querySelector(".lp_billede").classList.add("not_visible");
  } else {
    document.querySelector(".lp_billede").classList.remove("not_visible");
    document.querySelector(".lp_billede").href = cover.lp;
  }

  if (cover.cd == "") {
    document.querySelector(".cd").classList.add("not_visible");
  } else {
    document.querySelector(".cd").classList.remove("not_visible");
    document.querySelector(".cd").href = cover.cd;
  }
  UdgivelserDetaljer.classList.add(".overflow");
}

function lyrics() {
  console.log("lyrics");
  const trackSkabelon = document.querySelector(".track_liste");
  const klon = trackSkabelon.cloneNode(true).content;

  sange.sort((a, b) => a.tracknummer - b.tracknummer);
  //For hver sang i arrayet
  sange.forEach((sang) => {
    console.log("sang");
    console.log(sang.album_nummer == 3);
    //Hvis albumnummer er det sammen som sangens albumnummer ->
    if (sang.album_nummer == document.querySelector(".nr").textContent) {
      const klon = trackSkabelon.cloneNode(true).content;

      klon.querySelector(".track").textContent += sang.titel;
      //Ved klik på sang -> Udskriv lyrics

      //SÆT DENNE TIL NÅR LYRICS ER KLAR!!!!!

      /* klon.firstElementChild.addEventListener("click", function () {
     document.querySelector(".sangtitel").textContent = sang.titel;
     document.querySelector(".sangtekst").textContent = sang.sangtekst;
     document.querySelector(".baggrund").classList.remove("hide");
     //Når der klikkes scolles der hen til start af .tekst
     document.querySelector("#tekst").scrollIntoView({
         behavior: 'smooth',
         block: 'start'
     });
 });*/
      trackListe.appendChild(klon);
    }
  });
}

function luk() {
  let max = document.querySelector(".max");
  let popUp = document.querySelector(".popup_album");
  max.classList.add("small_big_close");
  popUp.classList.add("opacity_reverse");
  setTimeout(function () {
    max.classList.remove("small_big_close");
    popUp.classList.remove("opacity_reverse");
    popUp.classList.add("hide");
  }, 500);
  //Ved klik på luk kaldes denne funktion, som gemmer popup og tømmer lister, så de er klar til nyt indhold
  console.log("Luk");
  albumSortering();
  trackListe.textContent = "";
  document.querySelector(".sangtitel").textContent = "";
  document.querySelector(".sangtekst").textContent = "";
  document.querySelector(".baggrund").classList.add("hide");
  UdgivelserDetaljer.classList.remove(".overflow");
}

// ----------- BIOGRAFI ------------------

function hentBio() {
  console.log("hentBio");
  let bioTekst = document.querySelector(".bio_tekst");
  biografien.forEach((bio) => {
    bioTekst.textContent = bio.biografi_engelsk;
  });
}

// ----------- KONTAKT ------------------

function hentKontakt() {
  console.log("hentKontakt");
  //console.log(biografien.biografi_dansk);
  let bioTekst = document.querySelector(".bio_tekst");
  kontakten.forEach((kontaktFelt) => {
    document.querySelector(".navn").textContent = kontaktFelt.navn;
    document.querySelector(".gade").textContent = kontaktFelt.gade;
    document.querySelector(".by").textContent = kontaktFelt.by;
    document.querySelector(".tel_link").href = "tel:0045" + kontaktFelt.telefon;
    document.querySelector(".tlf").textContent = "+45 " + kontaktFelt.telefon;
    document.querySelector(".email").textContent = kontaktFelt.email;
    document.querySelector(".link").href = "mailto:" + kontaktFelt.email;
    document.querySelector(".web").textContent = kontaktFelt.website;
    document.querySelector(".web_link").href = "http://" + kontaktFelt.website;
  });
}

// ----------- FILTRERING ------------------

function filtreringDrop() {
  console.log("filtreringDrop");
  //Sætter filter til valgt value / option
  filter = event.target.value;
  json();
}

// ----------- MENUER ------------------

function dropDownMenu() {
  if (koncert) {
    //Ryd op
    document
      .querySelector(".kommende")
      .removeEventListener("click", function () {});
    document
      .querySelector(".overstaet")
      .removeEventListener("click", function () {});
  }
  //Når musen er over .drop -> vis .dropdown
  console.log("dropDownMenu");
  document.querySelector(".drop").addEventListener("mouseover", function () {
    console.log("mouseover på drop");
    document.querySelector(".drop_down").classList.remove("hide");
  });
  //Når musen er over .videoer -> vis .dropdown
  document.querySelector(".videoer").addEventListener("mouseover", function () {
    console.log("mouseover på videoer");
    document.querySelector(".drop_down").classList.remove("hide");
  });
  //Når musen er over .billeder -> vis .dropdown
  document
    .querySelector(".billeder")
    .addEventListener("mouseover", function () {
      console.log("mouseover på billeder");
      document.querySelector(".drop_down").classList.remove("hide");
    });
  //Når musen går væk fra .billeder ->
  document
    .querySelector(".billeder")
    .addEventListener("mouseleave", function () {
      console.log("mouseout på drop2");
      removeDropdown();
    });
  //Når musen går væk fra .videoer ->
  document
    .querySelector(".videoer")
    .addEventListener("mouseleave", function () {
      console.log("mouseout på videoer");
      removeDropdown();
    });

  //Når der scrolles på body ->
  document.querySelector("body").addEventListener("mousewheel", function () {
    console.log("scroll på body");
    removeDropdown();
  });
}

function removeDropdown() {
  console.log("removeDropdown");
  //Ryd op
  document
    .querySelector(".drop")
    .removeEventListener("mouseover", function () {});
  document
    .querySelector(".drop2")
    .removeEventListener("mouseover", function () {});
  document
    .querySelector(".drop2")
    .removeEventListener("mouseleave", function () {});
  document
    .querySelector("body")
    .removeEventListener("mousewheel", function () {});
  //Gem drop down
  document.querySelector(".drop_down").classList.add("hide");
}

function burgerMenu() {
  console.log("burgermenu");

  //Toggle hide på .burger
  document.querySelector(".burger").classList.toggle("hide");

  let erSkjult = document.querySelector(".burger").classList.contains("hide");

  //hvis .burger er gemt ->
  if (erSkjult == true) {
    console.log("skjul kryds");
    document.querySelector(".content").classList.remove("hide");
    //Selve menuknappen
    document.querySelector("#menuknap").classList = "fade_in";
    document.querySelector("#menuknap2").classList = "rotate_remove";
    document.querySelector("#menuknap1").classList = "rotate_remove";
    //Hvis vi er på billede-siden, så sæt .gone_back på lille og stor
    if (billede) {
      document.querySelector(".lille").classList.add("gone_back");
      document.querySelector(".stor").classList.add("gone_back");
    }

    //hvis .burger IKKE er gemt ->
  } else {
    console.log("skjul burger");
    //Selve menuknappen
    document.querySelector("#menuknap").classList = "fade_out";
    document.querySelector("#menuknap2").src = "billeder/burgerdel1.svg";
    document.querySelector("#menuknap1").src = "billeder/burgerdel2.svg";
    document.querySelector("#menuknap2").classList = "rotate_left";
    document.querySelector("#menuknap1").classList = "rotate_right";
    //Hvis vi er på billede-siden, så fjern .gone_back på lille og stor
    if (billede) {
      document.querySelector(".lille").classList.remove("gone_back");
      document.querySelector(".stor").classList.remove("gone_back");
    }

    //Gem .content
    document.querySelector(".content").classList.add("hide");
    //Ved klik på hjem -> index
    document.querySelector(".hjem").addEventListener("click", function () {
      location.href = "index.html";
    });

    //Sørger for at animationer kører og at burgermenuen lukkes efter der er klikket på et menupunkt.
    //for hvert menupunkt->
    document.querySelectorAll(".burger li").forEach((menupunkt) => {
      //Lyt efter klik
      menupunkt.addEventListener("click", function () {
        document.querySelector(".content").classList.remove("hide");
        //document.querySelector(".burger").classList.add("hide");
        document.querySelector("#menuknap").classList = "fade_in";
        if (billede) {
          document.querySelector("#menuknap2").classList = "rotate_remove";
          document.querySelector("#menuknap1").classList = "rotate_remove";
        }
      });
    });
  }
}
