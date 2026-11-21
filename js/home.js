

let chosenTag = "All";


function showTours() {
    let keyword = document.getElementById("tourSearch").value;
    let budget = Number(document.getElementById("budgetFilter").value);
    let html = "";
    let found = 0;

    for (let i = 0; i < tours.length; i++) {
        let tour = tours[i];
        let guide = findAccount(tour.guide);
        let guideName = tour.guide;
        if (guide != null) {
            guideName = guide.fullName;
        }

        
        if (chosenTag !== "All" && tour.tag !== chosenTag) {
            continue;
        }
        if (budget > 0 && tour.price > budget) {
            continue;
        }
        if (!hasText(tour.name + " " + tour.city + " " + guideName, keyword)) {
            continue;
        }

        found = found + 1;
        html = html +
            "<article class='tour-card'>" +
                "<div class='tour-band band-" + tour.tag + "'>" + tour.tag + " &middot; " + tour.days + " day(s)</div>" +
                "<div class='tour-body'>" +
                    "<h3>" + tour.name + "</h3>" +
                    "<p class='muted'>" + tour.city + " &middot; Guide: " + guideName + "</p>" +
                    "<p>" + tour.summary + "</p>" +
                    "<div class='tour-meta'>" +
                        "<span class='tag grey'>" + tour.level + "</span>" +
                        "<span class='tag grey'>" + tour.seats + " seats</span>" +
                    "</div>" +
                    "<span class='tour-price'>" + money(tour.price) + "</span> <span class='muted'>/ person</span>" +
                "</div>" +
            "</article>";
    }

    if (found === 0) {
        html = "<p>No tours match your search. Try another city or budget.</p>";
    }

    document.getElementById("tourGrid").innerHTML = html;
    document.getElementById("tourCount").innerHTML = found + " of " + tours.length + " tours found";
}



function pickTag(tag, number) {
    let chips = document.getElementById("tagChips").getElementsByTagName("button");
    for (let i = 0; i < chips.length; i++) {
        if (i === number) {
            chips[i].className = "on";
        } else {
            chips[i].className = "";
        }
    }
    chosenTag = tag;
    showTours();
}

function pickAll()       { pickTag("All", 0); }
function pickNature()    { pickTag("Nature", 1); }
function pickBeach()     { pickTag("Beach", 2); }
function pickAdventure() { pickTag("Adventure", 3); }
function pickHeritage()  { pickTag("Heritage", 4); }



function heroSearch() {
    document.getElementById("tourSearch").value = document.getElementById("heroKeyword").value;
    showTours();
    document.getElementById("tours").scrollIntoView();
    return false;
}



let chips = document.getElementById("tagChips").getElementsByTagName("button");
chips[0].addEventListener("click", pickAll);
chips[1].addEventListener("click", pickNature);
chips[2].addEventListener("click", pickBeach);
chips[3].addEventListener("click", pickAdventure);
chips[4].addEventListener("click", pickHeritage);

document.getElementById("tourSearch").addEventListener("keyup", showTours);
document.getElementById("budgetFilter").addEventListener("change", showTours);
document.getElementById("heroForm").onsubmit = heroSearch;

showTours();
