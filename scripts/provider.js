/* =========================================================
   TRAVESTRO - provider.js
   Hotel & transport service provider dashboard:
     My Rooms (create, read, update, delete, search)
     1. Booking Requests   2. Room Calendar   3. Bus Seat Map
   ========================================================= */

const me = "provider";       // the service provider who is signed in
let editingStayId = null;
let weekStart = todayDate(); // first day shown in the calendar
let pickedSeats = [];        // seats chosen on the seat map


// How many rooms do I have?
function myStayCount() {
    let count = 0;
    for (let i = 0; i < stays.length; i++) {
        if (stays[i].provider === me) {
            count = count + 1;
        }
    }
    return count;
}


/* =========================================================
   PANEL 1: MY ROOMS
   ========================================================= */

function showStays() {
    let keyword = document.getElementById("staySearch").value;
    let type = document.getElementById("typeFilter").value;
    let open = document.getElementById("openFilter").value;
    let rows = "";
    let shown = 0;

    for (let i = 0; i < stays.length; i++) {
        let s = stays[i];
        if (s.provider !== me) {
            continue;
        }
        if (type !== "" && s.roomType !== type) {
            continue;
        }
        if (open !== "" && s.status !== open) {
            continue;
        }
        if (!hasText(s.title + " " + s.roomType + " " + s.facilities.join(" "), keyword)) {
            continue;
        }
        shown = shown + 1;

        rows = rows +
            "<tr>" +
                "<td><strong>" + s.title + "</strong><br><span class='muted'>" + s.roomType + "</span></td>" +
                "<td>" + money(s.price) + "</td>" +
                "<td>" + s.maxGuests + "</td>" +
                "<td>" + s.facilities.join(", ") + "</td>" +
                "<td>" + statusTag(s.status) + "</td>" +
                "<td>" +
                    "<button class='btn btn-light btn-mini' onclick='editStay(" + s.id + ")'>Edit</button> " +
                    "<button class='btn btn-danger btn-mini' onclick='deleteStay(" + s.id + ")'>Delete</button>" +
                "</td>" +
            "</tr>";
    }

    if (rows === "") {
        rows = "<tr><td colspan='6'>No rooms match.</td></tr>";
    }
    document.getElementById("stayRows").innerHTML = rows;
    document.getElementById("stayCount").innerHTML = shown + " of " + myStayCount() + " rooms";
}

function editStay(id) {
    let s = findStay(id);
    editingStayId = id;
    clearErrors("stayForm");

    document.getElementById("stayTitle").value = s.title;
    document.getElementById("stayType").value = s.roomType;
    document.getElementById("stayPrice").value = s.price;
    document.getElementById("stayGuests").value = s.maxGuests;

    let boxes = document.getElementsByName("facility");
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].checked = (s.facilities.indexOf(boxes[i].value) !== -1);
    }
    setRadio("stayStatus", s.status);

    document.getElementById("stayFormTitle").innerHTML = "Edit: " + s.title;
    document.getElementById("staySaveBtn").innerHTML = "Save changes";
}

function clearStayForm() {
    document.getElementById("stayForm").reset();
    clearErrors("stayForm");
    editingStayId = null;
    document.getElementById("stayFormTitle").innerHTML = "List a new room";
    document.getElementById("staySaveBtn").innerHTML = "Add room";
}

function deleteStay(id) {
    let s = findStay(id);
    for (let i = 0; i < stayRequests.length; i++) {
        if (stayRequests[i].stayId === id && stayRequests[i].status === "Waiting") {
            toast(s.title + " has waiting requests. Answer them first.", true);
            return;
        }
    }
    if (!confirm("Delete the room " + s.title + "?")) {
        return;
    }

    stays = removeAt(stays, indexById(stays, id));

    // forget its blocked nights too (keys look like "3|2026-12-01")
    let kept = [];
    for (let i = 0; i < blockedNights.length; i++) {
        if (blockedNights[i].indexOf(id + "|") !== 0) {
            kept.push(blockedNights[i]);
        }
    }
    blockedNights = kept;

    if (editingStayId === id) {
        clearStayForm();
    }
    toast(s.title + " deleted.");
    refreshAll();
}

function saveStay() {
    clearErrors("stayForm");

    let title = document.getElementById("stayTitle").value.trim();
    let roomType = document.getElementById("stayType").value;
    let price = Number(document.getElementById("stayPrice").value);
    let maxGuests = Number(document.getElementById("stayGuests").value);
    let status = radioValue("stayStatus");
    let facilities = checkedValues("facility");
    let valid = true;

    if (title.length < 4) {
        showError("stayTitle", "Room name needs at least 4 characters.");
        valid = false;
    } else {
        for (let i = 0; i < stays.length; i++) {
            let s = stays[i];
            if (s.provider === me && s.id !== editingStayId && s.title.toLowerCase() === title.toLowerCase()) {
                showError("stayTitle", "You already have a room with this name.");
                valid = false;
            }
        }
    }
    if (roomType === "") {
        showError("stayType", "Choose a room type.");
        valid = false;
    }
    if (!(price >= 500 && price <= 50000)) {
        showError("stayPrice", "৳500 to ৳50,000 per night.");
        valid = false;
    }
    if (!Number.isInteger(maxGuests) || maxGuests < 1 || maxGuests > 8) {
        showError("stayGuests", "1 to 8 guests.");
        valid = false;
    }
    if (facilities.length === 0) {
        showError("facilityBox", "Tick at least one facility.");
        valid = false;
    }
    if (!valid) {
        toast("Please fix the highlighted fields.", true);
        return false;
    }

    if (editingStayId === null) {
        stays.push({
            id: nextId(stays),
            title: title,
            roomType: roomType,
            price: price,
            maxGuests: maxGuests,
            facilities: facilities,
            status: status,
            provider: me
        });
        toast(title + " is listed.");
    } else {
        let s = findStay(editingStayId);
        s.title = title;
        s.roomType = roomType;
        s.price = price;
        s.maxGuests = maxGuests;
        s.facilities = facilities;
        s.status = status;
        toast("Room updated.");
    }

    clearStayForm();
    refreshAll();
    return false;
}


/* =========================================================
   PANEL 2: BOOKING REQUESTS (unique feature 1)
   ========================================================= */

// All nights of a stay, e.g. check-in 12th for 2 nights -> 12th, 13th
function nightsOf(request) {
    let list = [];
    for (let i = 0; i < request.nights; i++) {
        list.push(shiftDate(request.checkIn, i));
    }
    return list;
}

function showRequests() {
    let keyword = document.getElementById("reqSearch").value;
    let filter = document.getElementById("reqFilter").value;
    let rows = "";
    let waiting = 0;
    let accepted = 0;
    let declined = 0;
    let income = 0;

    for (let i = 0; i < stayRequests.length; i++) {
        let r = stayRequests[i];
        let s = findStay(r.stayId);
        let bill = 0;
        let roomTitle = "Removed room";
        if (s != null) {
            bill = s.price * r.nights;
            roomTitle = s.title;
        }

        switch (r.status) {
            case "Waiting":
                waiting = waiting + 1;
                break;
            case "Declined":
                declined = declined + 1;
                break;
            case "Accepted":
                accepted = accepted + 1;
                income = income + bill;
                break;
        }

        if (filter !== "" && r.status !== filter) {
            continue;
        }
        if (!hasText(r.guest + " " + roomTitle, keyword)) {
            continue;
        }

        let buttons = "<span class='muted'>Done</span>";
        if (r.status === "Waiting") {
            buttons =
                "<button class='btn btn-ok btn-mini' onclick='acceptRequest(" + r.id + ")'>Accept</button> " +
                "<button class='btn btn-danger btn-mini' onclick='declineRequest(" + r.id + ")'>Decline</button>";
        }

        let tooMany = "";
        if (s != null && r.guests > s.maxGuests) {
            tooMany = " <span class='tag red'>too many</span>";
        }

        rows = rows +
            "<tr>" +
                "<td>" + r.guest + "</td>" +
                "<td>" + roomTitle + "</td>" +
                "<td>" + r.checkIn + "</td>" +
                "<td>" + r.nights + "</td>" +
                "<td>" + r.guests + tooMany + "</td>" +
                "<td>" + money(bill) + "</td>" +
                "<td>" + statusTag(r.status) + "</td>" +
                "<td>" + buttons + "</td>" +
            "</tr>";
    }

    if (rows === "") {
        rows = "<tr><td colspan='8'>No requests.</td></tr>";
    }
    document.getElementById("reqRows").innerHTML = rows;
    document.getElementById("rWaiting").innerHTML = waiting;
    document.getElementById("rAccepted").innerHTML = accepted;
    document.getElementById("rDeclined").innerHTML = declined;
    document.getElementById("rIncome").innerHTML = money(income);
}

function acceptRequest(id) {
    let r = getById(stayRequests, id);
    let s = findStay(r.stayId);

    if (s === null) {
        toast("That room no longer exists.", true);
        return;
    }
    if (s.status === "Closed") {
        toast(s.title + " is closed. Open it first or decline.", true);
        return;
    }
    if (r.guests > s.maxGuests) {
        toast(s.title + " takes only " + s.maxGuests + " guests, this request has " + r.guests + ".", true);
        return;
    }

    let nights = nightsOf(r);
    for (let i = 0; i < nights.length; i++) {
        if (blockedNights.indexOf(s.id + "|" + nights[i]) !== -1) {
            toast(s.title + " is already blocked on " + nights[i] + ".", true);
            return;
        }
    }

    r.status = "Accepted";
    for (let i = 0; i < nights.length; i++) {
        blockedNights.push(s.id + "|" + nights[i]);
    }
    toast("Accepted " + r.guest + ". " + r.nights + " night(s) blocked in the calendar.");
    refreshAll();
}

function declineRequest(id) {
    let r = getById(stayRequests, id);
    r.status = "Declined";
    toast("Declined " + r.guest + ".");
    showRequests();
}


/* =========================================================
   PANEL 3: ROOM CALENDAR (unique feature 2)
   7 nights in a grid, click to block or free a night.
   ========================================================= */

function showCalendar() {
    let days = [];
    for (let i = 0; i < 7; i++) {
        days.push(shiftDate(weekStart, i));
    }

    // header row
    let head = "<tr><th>Room</th>";
    for (let i = 0; i < days.length; i++) {
        let mark = "";
        if (days[i] === todayDate()) {
            mark = " (today)";
        }
        head = head + "<th>" + shortDay(days[i]) + "<br>" + days[i].substring(5) + mark + "</th>";
    }
    head = head + "<th>Free</th></tr>";
    document.getElementById("calHead").innerHTML = head;

    // one row for every room
    let body = "";
    let freeTotal = 0;
    for (let r = 0; r < stays.length; r++) {
        let s = stays[r];
        if (s.provider !== me) {
            continue;
        }
        let free = 0;
        body = body + "<tr><td><strong>" + s.title + "</strong></td>";

        for (let i = 0; i < days.length; i++) {
            let key = s.id + "|" + days[i];
            if (s.status === "Closed") {
                body = body + "<td><button class='cal-cell closed' disabled>Closed</button></td>";
            } else if (blockedNights.indexOf(key) !== -1) {
                body = body + "<td><button class='cal-cell blocked' onclick=\"toggleNight('" + key + "')\">Blocked</button></td>";
            } else {
                free = free + 1;
                body = body + "<td><button class='cal-cell free' onclick=\"toggleNight('" + key + "')\">Free</button></td>";
            }
        }

        freeTotal = freeTotal + free;
        body = body + "<td>" + free + " / 7</td></tr>";
    }
    if (body === "") {
        body = "<tr><td colspan='9'>Add a room first.</td></tr>";
    }
    document.getElementById("calBody").innerHTML = body;

    document.getElementById("weekLabel").innerHTML = days[0] + " to " + days[6];
    document.getElementById("calSummary").innerHTML = "<strong>" + freeTotal + "</strong> free room-nights in this week.";
}

function toggleNight(key) {
    let index = blockedNights.indexOf(key);
    if (index === -1) {
        blockedNights.push(key);
    } else {
        blockedNights = removeAt(blockedNights, index);
    }
    showCalendar();
}

function previousWeek() {
    weekStart = shiftDate(weekStart, -7);
    showCalendar();
}

function nextWeek() {
    weekStart = shiftDate(weekStart, 7);
    showCalendar();
}

function backToToday() {
    weekStart = todayDate();
    showCalendar();
}


/* =========================================================
   PANEL 4: BUS SEAT MAP (unique feature 3)
   20 seats: 5 rows of 2 + aisle + 2
   ========================================================= */

function fillBuses() {
    let options = "";
    for (let i = 0; i < buses.length; i++) {
        let b = buses[i];
        options = options + "<option value='" + b.id + "'>" + b.name + ": " + b.route + " (" + b.date + ")</option>";
    }
    document.getElementById("busSelect").innerHTML = options;
}

function currentBus() {
    return getById(buses, Number(document.getElementById("busSelect").value));
}

function showSeats() {
    let bus = currentBus();
    let html = "";

    for (let seat = 1; seat <= 20; seat++) {
        let seatClass = "seat";
        if (bus.booked.indexOf(seat) !== -1) {
            seatClass = "seat taken";
        } else if (pickedSeats.indexOf(seat) !== -1) {
            seatClass = "seat picked";
        }
        html = html + "<button type='button' class='" + seatClass + "' onclick='clickSeat(" + seat + ")'>" + seat + "</button>";

        // empty aisle after the 2nd seat of every row
        if (seat % 4 === 2) {
            html = html + "<span></span>";
        }
    }
    document.getElementById("seatGrid").innerHTML = html;

    document.getElementById("busInfo").innerHTML = "<strong>" + bus.route + "</strong><br>" + bus.date + " at " + bus.time + " &middot; " + money(bus.fare) + " per seat";
    document.getElementById("seatsLeft").innerHTML = 20 - bus.booked.length;
    document.getElementById("seatSales").innerHTML = money(bus.booked.length * bus.fare);

    let pickedText = "none";
    if (pickedSeats.length > 0) {
        pickedText = pickedSeats.join(", ");
    }
    document.getElementById("pickedText").innerHTML = pickedText;
    document.getElementById("fareLine").innerHTML = "Fare: " + pickedSeats.length + " x " + money(bus.fare) + " = " + money(pickedSeats.length * bus.fare);
}

function clickSeat(seat) {
    let bus = currentBus();
    let soldAt = bus.booked.indexOf(seat);
    let pickedAt = pickedSeats.indexOf(seat);

    if (soldAt !== -1) {
        if (confirm("Seat " + seat + " is sold. Cancel this ticket and free the seat?")) {
            bus.booked = removeAt(bus.booked, soldAt);
            toast("Seat " + seat + " is free again.");
        }
    } else if (pickedAt !== -1) {
        pickedSeats = removeAt(pickedSeats, pickedAt);
    } else if (pickedSeats.length >= 4) {
        toast("One passenger can buy up to 4 seats.", true);
    } else {
        pickedSeats.push(seat);
    }
    showSeats();
}

function changeBus() {
    pickedSeats = [];
    showSeats();
}

function sellTickets() {
    clearErrors("ticketForm");

    let name = document.getElementById("passenger").value.trim();
    let phone = document.getElementById("passPhone").value.trim();
    let valid = true;

    if (pickedSeats.length === 0) {
        document.getElementById("seatGridError").innerHTML = "Click at least one free seat on the map.";
        valid = false;
    }
    if (name.length < 3 || name.length > 40 || !onlyHas(name, LETTERS + " .")) {
        showError("passenger", "Write the passenger's name (letters only).");
        valid = false;
    }
    if (!isPhoneBD(phone)) {
        showError("passPhone", "Use an 11-digit number like 01712345678.");
        valid = false;
    }
    if (!valid) {
        return false;
    }

    let bus = currentBus();
    for (let i = 0; i < pickedSeats.length; i++) {
        bus.booked.push(pickedSeats[i]);
    }
    toast(name + " got seat(s) " + pickedSeats.join(", ") + ".");
    pickedSeats = [];
    document.getElementById("ticketForm").reset();
    showSeats();
    return false;
}


/* ---------- connect the events ---------- */
document.getElementById("stayForm").onsubmit = saveStay;
document.getElementById("stayCancelBtn").addEventListener("click", clearStayForm);
document.getElementById("staySearch").addEventListener("keyup", showStays);
document.getElementById("typeFilter").addEventListener("change", showStays);
document.getElementById("openFilter").addEventListener("change", showStays);

document.getElementById("reqSearch").addEventListener("keyup", showRequests);
document.getElementById("reqFilter").addEventListener("change", showRequests);

document.getElementById("prevWeek").addEventListener("click", previousWeek);
document.getElementById("nextWeek").addEventListener("click", nextWeek);
document.getElementById("thisWeek").addEventListener("click", backToToday);

document.getElementById("busSelect").addEventListener("change", changeBus);
document.getElementById("clearSeats").addEventListener("click", changeBus);
document.getElementById("ticketForm").onsubmit = sellTickets;


/* ---------- start ---------- */
function refreshAll() {
    showStays();
    showRequests();
    showCalendar();
}

// a few blocked nights so the calendar is not empty
blockedNights.push("1|" + shiftDate(todayDate(), 1));
blockedNights.push("1|" + shiftDate(todayDate(), 2));
blockedNights.push("2|" + shiftDate(todayDate(), 4));
for (let i = 0; i < stayRequests.length; i++) {
    if (stayRequests[i].status === "Accepted") {
        let nights = nightsOf(stayRequests[i]);
        for (let n = 0; n < nights.length; n++) {
            blockedNights.push(stayRequests[i].stayId + "|" + nights[n]);
        }
    }
}

setupSidebar();
refreshAll();
fillBuses();
showSeats();
