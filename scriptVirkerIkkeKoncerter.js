function hentKommendeKoncerter() {
  //ryd op
  document.querySelector(".kommende").removeEventListener("click", hentKommendeKoncerter);
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
  koncerter.forEach(show => {
    //definering af i hvilken rækkefølge dags dato og dato i json-fil skal læses ind (skal være sammenlignelige)
    let iDag = new Date(y, m, d);
    let koncertDato = new Date(show.aar, show.maaned, show.dag);

    //Hvis koncertdate er større end i dag og geofilter matcher det valgte filter ->
    if ((koncertDato > iDag && show.geografi == filter) || (koncertDato > iDag && filter == "alle")) {
      console.log("kommende koncerter");
      //definering af det indhold, som er i skabelonen
      const klon = koncertSkabelon.cloneNode(true).content;
      //Klon det ønskede indhold ind på den ønskede plads
      klon.querySelector(".koncert_sted").textContent = show.spillested;
      klon.querySelector(".dag").textContent = "Dato: " + show.dag + ".";
      klon.querySelector(".maaned").textContent = show.maaned + ".";
      klon.querySelector(".aar").textContent = show.aar;
      klon.querySelector(".by").textContent = "By: " + show.info_by;
      klon.querySelector(".pris").textContent = "Pris: " + show.pris;
      //Hvis der ikke er indtastet et tidspunkt -> lad teksten være tom
      if (show.tid == "") {
        klon.querySelector(".tid").textContent = "";
        //Ellers så skriv tiden ud i html
      } else {
        klon.querySelector(".tid").textContent = " kl. " + show.tid;
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
