const me = "guide";
const guideShare = 0.8;
let editingTourId = null;


function isMyTour(tourId) {
    let tour = findTour(tourId);
    return tour != null && tour.guide === me;
}

function myTourCount() {
    let count = 0;
    for (let i = 0; i < tours.length; i++) {
        if (tours[i].guide === me) {
            count = count + 1;
        }
    }
    return count;
}


function showTours() {
    let keyword = document.getElementById("tourSearch").value;
    let tag = document.getElementById("tagFilter").value;
    let level = document.getElementById("levelFilter").value;
    let html = "";
    let shown = 0;

    for (let i = 0; i < tours.length; i++) {
        let t = tours[i];
        if (t.guide !== me) {
            continue;
        }
        if (tag !== "" && t.tag !== tag) {
            continue;
        }
        if (level !== "" && t.level !== level) {
            continue;
        }
        if (!hasText(t.name + " " + t.city, keyword)) {
            continue;
        }
        shown = shown + 1;

        let booked = 0;
        for (let j = 0; j < trips.length; j++) {
            if (trips[j].tourId === t.id && trips[j].status !== "Completed") {
                booked = booked + 1;
            }
        }

        html = html +
            "<article class='tour-card'>" +
                "<div class='tour-band band-" + t.tag + "'>" + t.tag + " &middot; " + t.days + " day(s)</div>" +
                "<div class='tour-body'>" +
                    "<h3>" + t.name + "</h3>" +
                    "<p class='muted'>" + t.city + " &middot; " + t.level + " &middot; " + t.seats + " seats</p>" +
                    "<span class='tour-price'>" + money(t.price) + "</span>" +
                    "<p class='muted'>" + booked + " open booking(s)</p>" +
                    "<button class='btn btn-light btn-mini' onclick='editTour(" + t.id + ")'>Edit</button> " +
                    "<button class='btn btn-danger btn-mini' onclick='deleteTour(" + t.id + ")'>Delete</button>" +
                "</div>" +
            "</article>";
    }

    if (html === "") {
        html = "<p>No tours match.</p>";
    }
    document.getElementById("tourCards").innerHTML = html;
    document.getElementById("tourCount").innerHTML = shown + " of " + myTourCount() + " tours";
}

function countSummary() {
    let length = document.getElementById("tourSummary").value.length;
    document.getElementById("summaryCount").innerHTML = length + " / 250";
}

function editTour(id) {
    let t = findTour(id);
    editingTourId = id;
    clearErrors("tourForm");

    document.getElementById("tourName").value = t.name;
    document.getElementById("tourCity").value = t.city;
    document.getElementById("tourTag").value = t.tag;
    document.getElementById("tourDays").value = t.days;
    document.getElementById("tourSeats").value = t.seats;
    document.getElementById("tourPrice").value = t.price;
    document.getElementById("tourSummary").value = t.summary;
    setRadio("tourLevel", t.level);
    countSummary();

    document.getElementById("tourFormTitle").innerHTML = "Edit: " + t.name;
    document.getElementById("tourSaveBtn").innerHTML = "Save changes";
}

function clearTourForm() {
    document.getElementById("tourForm").reset();
    clearErrors("tourForm");
    editingTourId = null;
    document.getElementById("tourFormTitle").innerHTML = "Publish a tour";
    document.getElementById("tourSaveBtn").innerHTML = "Publish tour";
    document.getElementById("summaryCount").innerHTML = "0 / 250";
}

function deleteTour(id) {
    let t = findTour(id);

    let openTrips = 0;
    for (let i = 0; i < trips.length; i++) {
        if (trips[i].tourId === id && (trips[i].status === "Requested" || trips[i].status === "Confirmed")) {
            openTrips = openTrips + 1;
        }
    }
    if (openTrips > 0) {
        toast(t.name + " has " + openTrips + " open booking(s), so it cannot be deleted.", true);
        return;
    }
    if (!confirm("Delete the tour " + t.name + "?")) {
        return;
    }

    tours = removeAt(tours, indexById(tours, id));

    let kept = [];
    for (let i = 0; i < itinerary.length; i++) {
        if (itinerary[i].tourId !== id) {
            kept.push(itinerary[i]);
        }
    }
    itinerary = kept;

    if (editingTourId === id) {
        clearTourForm();
    }
    toast(t.name + " deleted.");
    refreshAll();
}

function saveTour() {
    clearErrors("tourForm");

    let name = document.getElementById("tourName").value.trim();
    let city = document.getElementById("tourCity").value;
    let tag = document.getElementById("tourTag").value;
    let days = Number(document.getElementById("tourDays").value);
    let seats = Number(document.getElementById("tourSeats").value);
    let price = Number(document.getElementById("tourPrice").value);
    let summary = document.getElementById("tourSummary").value.trim();
    let level = radioValue("tourLevel");
    let valid = true;

    if (name.length < 5) {
        showError("tourName", "Name needs at least 5 characters.");
        valid = false;
    } else {
        for (let i = 0; i < tours.length; i++) {
            if (tours[i].id !== editingTourId && tours[i].name.toLowerCase() === name.toLowerCase()) {
                showError("tourName", "A tour with this name already exists.");
                valid = false;
            }
        }
    }
    if (city === "") {
        showError("tourCity", "Choose a city.");
        valid = false;
    }
    if (tag === "") {
        showError("tourTag", "Choose a type.");
        valid = false;
    }
    if (!Number.isInteger(days) || days < 1 || days > 15) {
        showError("tourDays", "1 to 15 days.");
        valid = false;
    }
    if (!Number.isInteger(seats) || seats < 1 || seats > 40) {
        showError("tourSeats", "1 to 40 seats.");
        valid = false;
    }
    if (!(price >= 500 && price <= 100000)) {
        showError("tourPrice", "Price must be ৳500 to ৳1,00,000.");
        valid = false;
    }
    if (summary.length < 20) {
        showError("tourSummary", "Write at least 20 characters.");
        valid = false;
    }

    if (editingTourId !== null && Number.isInteger(days)) {
        for (let i = 0; i < itinerary.length; i++) {
            if (itinerary[i].tourId === editingTourId && itinerary[i].day > days) {
                showError("tourDays", "The itinerary has stops after day " + days + ". Remove them first.");
                valid = false;
                break;
            }
        }
    }

    if (!valid) {
        toast("Please fix the highlighted fields.", true);
        return false;
    }

    if (editingTourId === null) {
        tours.push({
            id: nextId(tours),
            name: name,
            city: city,
            tag: tag,
            days: days,
            price: price,
            seats: seats,
            level: level,
            guide: me,
            summary: summary
        });
        toast(name + " is now live.");
    } else {
        let t = findTour(editingTourId);
        t.name = name;
        t.city = city;
        t.tag = tag;
        t.days = days;
        t.price = price;
        t.seats = seats;
        t.level = level;
        t.summary = summary;
        toast("Tour updated.");
    }

    clearTourForm();
    refreshAll();
    return false;
}


function buildPlanSelect() {
    let holder = document.getElementById("planTourHolder");
    let old = document.getElementById("planTour");
    let oldValue = "";
    if (old != null) {
        oldValue = old.value;
    }
    holder.innerHTML = "";

    let select = document.createElement("select");
    select.id = "planTour";
    for (let i = 0; i < tours.length; i++) {
        if (tours[i].guide !== me) {
            continue;
        }
        let option = document.createElement("option");
        option.value = tours[i].id;
        option.innerHTML = tours[i].name + " (" + tours[i].days + " days)";
        select.appendChild(option);
    }
    if (oldValue !== "" && isMyTour(Number(oldValue))) {
        select.value = oldValue;
    }

    select.addEventListener("change", showPlan);
    holder.appendChild(select);
}

function showPlan() {
    let tour = findTour(Number(document.getElementById("planTour").value));
    if (tour === null) {
        document.getElementById("planTimeline").innerHTML = "<p>Publish a tour first.</p>";
        document.getElementById("planInfo").innerHTML = "";
        return;
    }

    document.getElementById("planDay").max = tour.days;

    let stops = [];
    for (let i = 0; i < itinerary.length; i++) {
        if (itinerary[i].tourId === tour.id) {
            stops.push(itinerary[i]);
        }
    }

    for (let a = 0; a < stops.length; a++) {
        for (let b = a + 1; b < stops.length; b++) {
            let laterDay = stops[a].day > stops[b].day;
            let sameDayLaterTime = stops[a].day === stops[b].day && stops[a].time > stops[b].time;
            if (laterDay || sameDayLaterTime) {
                let temp = stops[a];
                stops[a] = stops[b];
                stops[b] = temp;
            }
        }
    }

    let html = "";
    let lastDay = 0;
    for (let i = 0; i < stops.length; i++) {
        let s = stops[i];
        if (s.day !== lastDay) {
            html = html + "<h3>Day " + s.day + "</h3>";
            lastDay = s.day;
        }
        html = html +
            "<div class='stop item-row'>" +
                "<span><strong>" + s.time + "</strong> &nbsp; " + s.activity + "</span>" +
                "<button class='btn btn-danger btn-mini' onclick='removeStop(" + s.id + ")'>Remove</button>" +
            "</div>";
    }

    let emptyDays = [];
    for (let d = 1; d <= tour.days; d++) {
        let found = false;
        for (let i = 0; i < stops.length; i++) {
            if (stops[i].day === d) {
                found = true;
            }
        }
        if (!found) {
            emptyDays.push(d);
        }
    }

    if (html === "") {
        html = "<p class='muted'>No stops yet. Add the first one.</p>";
    }
    document.getElementById("planTimeline").innerHTML = html;

    let info = tour.days + "-day tour, " + stops.length + " stop(s). ";
    if (emptyDays.length > 0) {
        info = info + "Days without a plan: " + emptyDays.join(", ");
    } else {
        info = info + "Every day has a plan.";
    }
    document.getElementById("planInfo").innerHTML = info;
}

function removeStop(id) {
    itinerary = removeAt(itinerary, indexById(itinerary, id));
    showPlan();
}

function addStop() {
    clearErrors("planForm");

    let tour = findTour(Number(document.getElementById("planTour").value));
    let day = Number(document.getElementById("planDay").value);
    let time = document.getElementById("planTime").value;
    let activity = document.getElementById("planActivity").value.trim();
    let valid = true;

    if (tour === null) {
        toast("Publish a tour first.", true);
        return false;
    }
    if (!Number.isInteger(day) || day < 1 || day > tour.days) {
        showError("planDay", "This tour has days 1 to " + tour.days + ".");
        valid = false;
    }
    if (isEmpty(time)) {
        showError("planTime", "Pick a time.");
        valid = false;
    }
    if (activity.length < 4) {
        showError("planActivity", "Describe the activity.");
        valid = false;
    }
    for (let i = 0; i < itinerary.length; i++) {
        let s = itinerary[i];
        if (s.tourId === tour.id && s.day === day && s.time === time) {
            showError("planTime", "Day " + day + " already has a stop at " + time + ".");
            valid = false;
        }
    }
    if (!valid) {
        return false;
    }

    itinerary.push({
        id: nextId(itinerary),
        tourId: tour.id,
        day: day,
        time: time,
        activity: activity
    });
    document.getElementById("planTime").value = "";
    document.getElementById("planActivity").value = "";
    toast("Stop added to day " + day + ".");
    showPlan();
    return false;
}


function showReviews() {
    let show = document.getElementById("replyFilter").value;
    let stars = Number(document.getElementById("starFilter").value);
    let sum = 0;
    let count = 0;
    let needReply = 0;
    let html = "";

    for (let i = 0; i < reviews.length; i++) {
        let r = reviews[i];
        let tour = findTour(r.tourId);

        if (tour != null && tour.guide !== me) {
            continue;
        }

        sum = sum + r.stars;
        count = count + 1;
        if (r.reply === "") {
            needReply = needReply + 1;
        }

        if (show === "todo" && r.reply !== "") {
            continue;
        }
        if (show === "done" && r.reply === "") {
            continue;
        }
        if (stars > 0 && r.stars !== stars) {
            continue;
        }

        let replyPart = "";
        if (r.reply !== "") {
            replyPart = "<p class='notice good'><strong>Your reply:</strong> " + r.reply + "</p>";
        } else {
            replyPart =
                "<label for='reply" + r.id + "' class='hidden'>Reply</label>" +
                "<textarea id='reply" + r.id + "' class='reply-box' rows='2' placeholder='Write a polite reply...'></textarea>" +
                "<button class='btn btn-plum btn-mini' onclick='sendReply(" + r.id + ")'>Send reply</button>";
        }

        let colour = "High";
        if (r.stars >= 4) {
            colour = "Low";
        } else if (r.stars === 3) {
            colour = "Medium";
        }

        let tourName = "Old tour";
        if (tour != null) {
            tourName = tour.name;
        }

        html = html +
            "<div class='item-card " + colour + "'>" +
                "<div class='item-row'>" +
                    "<h4>" + r.from + "</h4>" +
                    "<span class='stars'>" + starText(r.stars) + "</span>" +
                "</div>" +
                "<p class='muted'>" + tourName + " &middot; " + r.date + "</p>" +
                "<p>\"" + r.comment + "\"</p>" +
                replyPart +
            "</div>";
    }

    let average = 0;
    if (count > 0) {
        average = sum / count;
    }
    document.getElementById("avgScore").innerHTML = average.toFixed(1);
    document.getElementById("reviewTotal").innerHTML = count;
    document.getElementById("needReply").innerHTML = needReply;

    if (html === "") {
        html = "<p class='muted'>No reviews here.</p>";
    }
    document.getElementById("reviewList").innerHTML = html;
}

function sendReply(id) {
    let box = document.getElementById("reply" + id);
    let text = box.value.trim();
    if (text.length < 5) {
        box.style.borderColor = "#e5484d";
        toast("A reply needs at least 5 characters.", true);
        return;
    }
    let r = getById(reviews, id);
    r.reply = text;
    toast("Reply sent to " + r.from + ".");
    showReviews();
}


function isPaidTrip(trip) {
    return isMyTour(trip.tourId) && (trip.status === "Confirmed" || trip.status === "Completed");
}

function fillMonths() {
    let months = [];
    for (let i = 0; i < trips.length; i++) {
        if (!isPaidTrip(trips[i])) {
            continue;
        }
        let m = trips[i].startDate.substring(0, 7);
        if (months.indexOf(m) === -1) {
            months.push(m);
        }
    }

    for (let a = 0; a < months.length; a++) {
        for (let b = a + 1; b < months.length; b++) {
            if (months[a] > months[b]) {
                let temp = months[a];
                months[a] = months[b];
                months[b] = temp;
            }
        }
    }

    let select = document.getElementById("monthFilter");
    let old = select.value;
    let options = "<option value=''>All months</option>";
    for (let i = 0; i < months.length; i++) {
        options = options + "<option value='" + months[i] + "'>" + months[i] + "</option>";
    }
    select.innerHTML = options;
    if (months.indexOf(old) !== -1) {
        select.value = old;
    }
}

function showEarnings() {
    let month = document.getElementById("monthFilter").value;
    let status = document.getElementById("earnStatus").value;
    let rows = "";
    let total = 0;
    let count = 0;
    let people = 0;

    for (let i = 0; i < trips.length; i++) {
        let t = trips[i];
        if (!isPaidTrip(t)) {
            continue;
        }
        if (month !== "" && t.startDate.substring(0, 7) !== month) {
            continue;
        }
        if (status !== "" && t.status !== status) {
            continue;
        }

        let tour = findTour(t.tourId);
        let traveller = findAccount(t.traveler);
        let travellerName = t.traveler;
        if (traveller != null) {
            travellerName = traveller.fullName;
        }
        let value = tour.price * t.people;
        let share = value * guideShare;

        total = total + share;
        count = count + 1;
        people = people + t.people;

        rows = rows +
            "<tr>" +
                "<td>" + t.startDate + "</td>" +
                "<td>" + tour.name + "</td>" +
                "<td>" + travellerName + "</td>" +
                "<td>" + t.people + "</td>" +
                "<td>" + money(value) + "</td>" +
                "<td><strong>" + money(share) + "</strong></td>" +
                "<td>" + statusTag(t.status) + "</td>" +
            "</tr>";
    }

    if (rows === "") {
        rows = "<tr><td colspan='7'>No paid trips for this choice.</td></tr>";
    }
    document.getElementById("earnRows").innerHTML = rows;
    document.getElementById("earnTotal").innerHTML = money(total);
    document.getElementById("earnTrips").innerHTML = count;
    document.getElementById("earnPeople").innerHTML = people;
}


document.getElementById("tourForm").onsubmit = saveTour;
document.getElementById("tourSummary").addEventListener("keyup", countSummary);
document.getElementById("tourCancelBtn").addEventListener("click", clearTourForm);
document.getElementById("tourSearch").addEventListener("keyup", showTours);
document.getElementById("tagFilter").addEventListener("change", showTours);
document.getElementById("levelFilter").addEventListener("change", showTours);

document.getElementById("planForm").onsubmit = addStop;

document.getElementById("replyFilter").addEventListener("change", showReviews);
document.getElementById("starFilter").addEventListener("change", showReviews);

document.getElementById("monthFilter").addEventListener("change", showEarnings);
document.getElementById("earnStatus").addEventListener("change", showEarnings);


function refreshAll() {
    showTours();
    buildPlanSelect();
    showPlan();
    showReviews();
    fillMonths();
    showEarnings();
}

setupSidebar();
refreshAll();
