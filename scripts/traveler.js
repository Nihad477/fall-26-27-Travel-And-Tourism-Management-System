

const me = "traveler";     
let editingTripId = null;  




function fillTourSelect() {
    let options = "<option value=''>Choose a tour</option>";
    for (let i = 0; i < tours.length; i++) {
        let t = tours[i];
        options = options + "<option value='" + t.id + "'>" + t.name + " - " + t.city + " (" + money(t.price) + ")</option>";
    }
    document.getElementById("tripTour").innerHTML = options;
}


function showTrips() {
    let keyword = document.getElementById("tripSearch").value;
    let filter = document.getElementById("tripFilter").value;
    let rows = "";
    let requested = 0;
    let confirmed = 0;
    let completed = 0;

    for (let i = 0; i < trips.length; i++) {
        let trip = trips[i];
        if (trip.traveler !== me) {
            continue;
        }

       
        if (trip.status === "Requested") {
            requested = requested + 1;
        } else if (trip.status === "Confirmed") {
            confirmed = confirmed + 1;
        } else if (trip.status === "Completed") {
            completed = completed + 1;
        }

        if (filter !== "" && trip.status !== filter) {
            continue;
        }

        let tour = findTour(trip.tourId);
        let tourName = "Removed tour";
        let city = "";
        let cost = 0;
        if (tour != null) {
            tourName = tour.name;
            city = tour.city;
            cost = tour.price * trip.people;
        }
        if (!hasText(tourName + " " + city, keyword)) {
            continue;
        }

        let buttons = "<span class='muted'>Locked</span>";
        if (trip.status === "Requested") {
            buttons =
                "<button class='btn btn-light btn-mini' onclick='editTrip(" + trip.id + ")'>Edit</button> " +
                "<button class='btn btn-danger btn-mini' onclick='deleteTrip(" + trip.id + ")'>Delete</button>";
        }

        rows = rows +
            "<tr>" +
                "<td><strong>" + tourName + "</strong><br><span class='muted'>" + city + "</span></td>" +
                "<td>" + trip.startDate + "</td>" +
                "<td>" + trip.people + "</td>" +
                "<td>" + money(cost) + "</td>" +
                "<td>" + statusTag(trip.status) + "</td>" +
                "<td>" + buttons + "</td>" +
            "</tr>";
    }

    if (rows === "") {
        rows = "<tr><td colspan='6'>No trips found.</td></tr>";
    }
    document.getElementById("tripRows").innerHTML = rows;
    document.getElementById("nRequested").innerHTML = requested;
    document.getElementById("nConfirmed").innerHTML = confirmed;
    document.getElementById("nCompleted").innerHTML = completed;
}


function updateEstimate() {
    let tour = findTour(Number(document.getElementById("tripTour").value));
    let people = Number(document.getElementById("tripPeople").value);
    let line = document.getElementById("tripEstimate");

    if (tour === null || !(people > 0)) {
        line.innerHTML = "Pick a tour to see the cost.";
        return;
    }
    line.innerHTML = people + " x " + money(tour.price) + " = " + money(people * tour.price) + " for " + tour.days + " day(s)";
}


function countNote() {
    let length = document.getElementById("tripNote").value.length;
    document.getElementById("noteCount").innerHTML = length + " / 150";
}

function editTrip(id) {
    let trip = getById(trips, id);
    editingTripId = id;
    clearErrors("tripForm");

    document.getElementById("tripTour").value = trip.tourId;
    document.getElementById("tripDate").value = trip.startDate;
    document.getElementById("tripPeople").value = trip.people;
    document.getElementById("tripPhone").value = trip.phone;
    document.getElementById("tripNote").value = trip.note;
    countNote();

    document.getElementById("tripFormTitle").innerHTML = "Change trip request";
    document.getElementById("tripSaveBtn").innerHTML = "Save changes";
    updateEstimate();
}

function clearTripForm() {
    document.getElementById("tripForm").reset();
    clearErrors("tripForm");
    editingTripId = null;
    document.getElementById("tripFormTitle").innerHTML = "Request a tour";
    document.getElementById("tripSaveBtn").innerHTML = "Send request";
    document.getElementById("noteCount").innerHTML = "0 / 150";
    updateEstimate();
}

function deleteTrip(id) {
    let index = indexById(trips, id);
    let tour = findTour(trips[index].tourId);
    let name = "this tour";
    if (tour != null) {
        name = tour.name;
    }
    if (!confirm("Delete your request for " + name + "?")) {
        return;
    }

    trips = removeAt(trips, index);
    if (editingTripId === id) {
        clearTripForm();
    }
    toast("Trip request deleted.");
    showTrips();
}

function saveTrip() {
    clearErrors("tripForm");

    let tourId = Number(document.getElementById("tripTour").value);
    let startDate = document.getElementById("tripDate").value;
    let people = Number(document.getElementById("tripPeople").value);
    let phone = document.getElementById("tripPhone").value.trim();
    let note = document.getElementById("tripNote").value.trim();
    let tour = findTour(tourId);
    let valid = true;

    if (tour === null) {
        showError("tripTour", "Choose a tour.");
        valid = false;
    }
    if (isEmpty(startDate)) {
        showError("tripDate", "Pick a start date.");
        valid = false;
    } else if (daysBetween(todayDate(), startDate) < 3) {
        showError("tripDate", "Book at least 3 days before the trip.");
        valid = false;
    }
    if (!Number.isInteger(people) || people < 1 || people > 10) {
        showError("tripPeople", "1 to 10 people per request.");
        valid = false;
    } else if (tour != null && people > tour.seats) {
        showError("tripPeople", "This tour has only " + tour.seats + " seats.");
        valid = false;
    }
    if (!isPhoneBD(phone)) {
        showError("tripPhone", "Use an 11-digit number like 01712345678.");
        valid = false;
    }

    
    for (let i = 0; i < trips.length; i++) {
        let t = trips[i];
        if (t.traveler === me && t.id !== editingTripId && t.tourId === tourId && t.startDate === startDate) {
            showError("tripDate", "You already requested this tour on this date.");
            valid = false;
        }
    }

    if (!valid) {
        toast("Please fix the highlighted fields.", true);
        return false;
    }

    if (editingTripId === null) {
        trips.push({
            id: nextId(trips),
            traveler: me,
            tourId: tourId,
            startDate: startDate,
            people: people,
            phone: phone,
            note: note,
            status: "Requested"
        });
        toast("Request sent for " + tour.name + ".");
    } else {
        let trip = getById(trips, editingTripId);
        trip.tourId = tourId;
        trip.startDate = startDate;
        trip.people = people;
        trip.phone = phone;
        trip.note = note;
        toast("Trip request updated.");
    }

    clearTripForm();
    showTrips();
    return false;
}



const stages = ["Dream", "Planned", "Visited"];

function showWishlist() {
    for (let s = 0; s < stages.length; s++) {
        let stage = stages[s];
        let html = "";
        let count = 0;

        for (let i = 0; i < wishlist.length; i++) {
            let w = wishlist[i];
            if (w.stage !== stage) {
                continue;
            }
            count = count + 1;

            let back = "";
            let next = "";
            if (s > 0) {
                back = "<button class='btn btn-light btn-mini' onclick='moveWish(" + w.id + ", -1)'>&larr;</button>";
            }
            if (s < 2) {
                next = "<button class='btn btn-light btn-mini' onclick='moveWish(" + w.id + ", 1)'>&rarr;</button>";
            }

            html = html +
                "<div class='wish'>" +
                    "<strong>" + w.place + "</strong><br>" +
                    "<span class='muted'>" + w.country + "</span>" +
                    "<div class='item-row'>" +
                        "<span>" + back + " " + next + "</span>" +
                        "<button class='btn btn-danger btn-mini' onclick='removeWish(" + w.id + ")'>&times;</button>" +
                    "</div>" +
                "</div>";
        }

        if (html === "") {
            html = "<p class='muted'>Nothing here yet.</p>";
        }
        document.getElementById("lane" + stage).innerHTML = html;
        document.getElementById("count" + stage).innerHTML = "(" + count + ")";
    }
}


function moveWish(id, step) {
    let w = getById(wishlist, id);
    let newPos = stages.indexOf(w.stage) + step;
    w.stage = stages[newPos];
    if (w.stage === "Visited") {
        toast("You visited " + w.place + "! Great memory.");
    }
    showWishlist();
}

function removeWish(id) {
    wishlist = removeAt(wishlist, indexById(wishlist, id));
    showWishlist();
}

function addWish() {
    clearErrors("wishForm");

    let place = document.getElementById("wishPlace").value.trim();
    let country = document.getElementById("wishCountry").value.trim();
    let valid = true;

    if (place.length < 2) {
        showError("wishPlace", "Write the place name.");
        valid = false;
    } else {
        for (let i = 0; i < wishlist.length; i++) {
            if (wishlist[i].place.toLowerCase() === place.toLowerCase()) {
                showError("wishPlace", place + " is already on your board.");
                valid = false;
            }
        }
    }
    if (country.length < 2 || country.length > 30 || !onlyHas(country, LETTERS + " ")) {
        showError("wishCountry", "Country: letters only.");
        valid = false;
    }
    if (!valid) {
        return false;
    }

    wishlist.push({
        id: nextId(wishlist),
        place: place,
        country: country,
        stage: document.getElementById("wishStage").value
    });
    document.getElementById("wishForm").reset();
    toast(place + " added to your board.");
    showWishlist();
    return false;
}



function showSplitter() {
    
    let chips = "";
    let options = "";
    for (let i = 0; i < friends.length; i++) {
        chips = chips + "<button type='button' onclick='removeFriend(" + i + ")' title='Remove'>" + friends[i] + " &times;</button>";
        options = options + "<option>" + friends[i] + "</option>";
    }
    document.getElementById("friendChips").innerHTML = chips;
    document.getElementById("expPaidBy").innerHTML = options;

    
    let rows = "";
    let total = 0;
    for (let i = 0; i < expenses.length; i++) {
        let e = expenses[i];
        total = total + e.amount;
        rows = rows +
            "<tr>" +
                "<td>" + e.title + "</td>" +
                "<td>" + money(e.amount) + "</td>" +
                "<td>" + e.paidBy + "</td>" +
                "<td><button class='btn btn-danger btn-mini' onclick='removeExpense(" + e.id + ")'>Delete</button></td>" +
            "</tr>";
    }
    if (rows === "") {
        rows = "<tr><td colspan='4'>No expenses yet.</td></tr>";
    }
    document.getElementById("expenseRows").innerHTML = rows;

    
    let share = 0;
    if (friends.length > 0) {
        share = total / friends.length;
    }
    document.getElementById("totalSpent").innerHTML = money(total);
    document.getElementById("perHead").innerHTML = money(share);

    let list = "";
    for (let f = 0; f < friends.length; f++) {
        let paid = 0;
        for (let i = 0; i < expenses.length; i++) {
            if (expenses[i].paidBy === friends[f]) {
                paid = paid + expenses[i].amount;
            }
        }
        let balance = paid - share;

        let line = "is all settled";
        let colour = "grey";
        if (balance > 0.5) {
            line = "gets back " + money(balance);
            colour = "green";
        } else if (balance < -0.5) {
            line = "owes " + money(-balance);
            colour = "red";
        }
        list = list +
            "<div class='item-row item-card Low'>" +
                "<span><strong>" + friends[f] + "</strong> paid " + money(paid) + "</span>" +
                "<span class='tag " + colour + "'>" + line + "</span>" +
            "</div>";
    }
    document.getElementById("balanceList").innerHTML = list;
}

function removeFriend(index) {
    let name = friends[index];
    for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].paidBy === name) {
            toast(name + " has paid for something. Delete those expenses first.", true);
            return;
        }
    }
    if (friends.length <= 2) {
        toast("A group needs at least 2 people.", true);
        return;
    }
    friends = removeAt(friends, index);
    showSplitter();
}

function removeExpense(id) {
    expenses = removeAt(expenses, indexById(expenses, id));
    showSplitter();
}

function addFriend() {
    clearErrors("friendForm");
    let name = document.getElementById("friendName").value.trim();

    if (name.length < 2 || name.length > 15 || !onlyHas(name, LETTERS)) {
        showError("friendName", "2 to 15 letters, no spaces.");
        return false;
    }
    for (let i = 0; i < friends.length; i++) {
        if (friends[i].toLowerCase() === name.toLowerCase()) {
            showError("friendName", name + " is already in the group.");
            return false;
        }
    }
    if (friends.length >= 8) {
        showError("friendName", "A group can have up to 8 people.");
        return false;
    }

    friends.push(name);
    document.getElementById("friendForm").reset();
    showSplitter();
    return false;
}

function addExpense() {
    clearErrors("expenseForm");

    let title = document.getElementById("expTitle").value.trim();
    let amount = Number(document.getElementById("expAmount").value);
    let valid = true;

    if (title.length < 3) {
        showError("expTitle", "Write what it was for.");
        valid = false;
    }
    if (!(amount > 0) || amount > 500000) {
        showError("expAmount", "Amount must be between 1 and 5,00,000.");
        valid = false;
    }
    if (!valid) {
        return false;
    }

    expenses.push({
        id: nextId(expenses),
        title: title,
        amount: amount,
        paidBy: document.getElementById("expPaidBy").value
    });
    document.getElementById("expenseForm").reset();
    toast("Expense added.");
    showSplitter();
    return false;
}



function fillCurrencies() {
    let options = "";
    let rows = "";
    for (let i = 0; i < rates.length; i++) {
        let r = rates[i];
        options = options + "<option value='" + r.code + "'>" + r.code + " - " + r.name + "</option>";
        if (r.code !== "BDT") {
            let extra = "";
            if (r.taka < 10) {
                extra = " (" + r.taka + ")";
            }
            rows = rows + "<tr><td>" + r.code + " - " + r.name + "</td><td>" + money(r.taka) + extra + "</td></tr>";
        }
    }
    document.getElementById("convFrom").innerHTML = options;
    document.getElementById("convTo").innerHTML = options;
    document.getElementById("convFrom").value = "USD";
    document.getElementById("convTo").value = "BDT";
    document.getElementById("rateRows").innerHTML = rows;
}

function rateOf(code) {
    for (let i = 0; i < rates.length; i++) {
        if (rates[i].code === code) {
            return rates[i].taka;
        }
    }
    return 1;
}

function convertMoney() {
    clearErrors("convertForm");
    let result = document.getElementById("convResult");
    result.className = "result-line hidden";

    let amountText = document.getElementById("convAmount").value;
    let amount = Number(amountText);
    let from = document.getElementById("convFrom").value;
    let to = document.getElementById("convTo").value;
    let valid = true;

    if (isEmpty(amountText) || !(amount > 0) || amount > 10000000) {
        showError("convAmount", "Type an amount between 0 and 1,00,00,000.");
        valid = false;
    }
    if (from === to) {
        showError("convTo", "Choose two different currencies.");
        valid = false;
    }
    if (!valid) {
        return false;
    }

    let inTaka = amount * rateOf(from);
    let answer = inTaka / rateOf(to);

    result.innerHTML = amount + " " + from + " = <strong>" + answer.toFixed(2) + " " + to + "</strong>";
    result.className = "result-line";
    return false;
}

function swapCurrencies() {
    let from = document.getElementById("convFrom").value;
    document.getElementById("convFrom").value = document.getElementById("convTo").value;
    document.getElementById("convTo").value = from;
}



document.getElementById("tripForm").onsubmit = saveTrip;
document.getElementById("tripTour").addEventListener("change", updateEstimate);
document.getElementById("tripPeople").addEventListener("keyup", updateEstimate);
document.getElementById("tripPeople").addEventListener("change", updateEstimate);
document.getElementById("tripNote").addEventListener("keyup", countNote);
document.getElementById("tripCancelBtn").addEventListener("click", clearTripForm);
document.getElementById("tripSearch").addEventListener("keyup", showTrips);
document.getElementById("tripFilter").addEventListener("change", showTrips);

document.getElementById("wishForm").onsubmit = addWish;
document.getElementById("friendForm").onsubmit = addFriend;
document.getElementById("expenseForm").onsubmit = addExpense;
document.getElementById("convertForm").onsubmit = convertMoney;
document.getElementById("swapBtn").addEventListener("click", swapCurrencies);



setupSidebar();
fillTourSelect();
showTrips();
showWishlist();
showSplitter();
fillCurrencies();
