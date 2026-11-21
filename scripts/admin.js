const me = "admin";          
let editingAccountId = null; 


function showAccounts() {
    let keyword = document.getElementById("accSearch").value;
    let role = document.getElementById("roleFilter").value;
    let status = document.getElementById("statusFilter").value;
    let rows = "";
    let shown = 0;

    for (let i = 0; i < accounts.length; i++) {
        let a = accounts[i];
        if (role !== "" && a.role !== role) {
            continue;
        }
        if (status !== "" && a.status !== status) {
            continue;
        }
        if (!hasText(a.fullName + " " + a.username + " " + a.email, keyword)) {
            continue;
        }

        shown = shown + 1;
        rows = rows +
            "<tr>" +
                "<td><strong>" + a.fullName + "</strong><br><span class='muted'>" + a.email + "</span></td>" +
                "<td>" + a.username + "</td>" +
                "<td>" + roleName(a.role) + "</td>" +
                "<td>" + statusTag(a.status) + "</td>" +
                "<td>" + a.joined + "</td>" +
                "<td>" +
                    "<button class='btn btn-light btn-mini' onclick='editAccount(" + a.id + ")'>Edit</button> " +
                    "<button class='btn btn-danger btn-mini' onclick='deleteAccount(" + a.id + ")'>Delete</button>" +
                "</td>" +
            "</tr>";
    }

    if (shown === 0) {
        rows = "<tr><td colspan='6'>No account matches your search.</td></tr>";
    }

    document.getElementById("accRows").innerHTML = rows;
    document.getElementById("accCount").innerHTML = "Showing " + shown + " of " + accounts.length + " accounts";
    updateCounts();
}

function updateCounts() {
    let travelers = 0;
    let guides = 0;
    let providers = 0;
    let pending = 0;

    for (let i = 0; i < accounts.length; i++) {
        switch (accounts[i].role) {
            case "traveler":
                travelers = travelers + 1;
                break;
            case "guide":
                guides = guides + 1;
                break;
            case "provider":
                providers = providers + 1;
                break;
        }
        if (accounts[i].status === "Pending") {
            pending = pending + 1;
        }
    }

    document.getElementById("countAll").innerHTML = accounts.length;
    document.getElementById("countTravelers").innerHTML = travelers;
    document.getElementById("countGuides").innerHTML = guides;
    document.getElementById("countPartners").innerHTML = providers;
    document.getElementById("countPending").innerHTML = pending;
}

function editAccount(id) {
    let a = getById(accounts, id);
    editingAccountId = id;
    clearErrors("accountForm");

    document.getElementById("accName").value = a.fullName;
    document.getElementById("accUser").value = a.username;
    document.getElementById("accEmail").value = a.email;
    document.getElementById("accPass").value = a.password;
    document.getElementById("accRole").value = a.role;
    setRadio("accStatus", a.status);

    document.getElementById("accFormTitle").innerHTML = "Edit: " + a.fullName;
    document.getElementById("accSaveBtn").innerHTML = "Save changes";
}

function clearAccountForm() {
    document.getElementById("accountForm").reset();
    clearErrors("accountForm");
    editingAccountId = null;
    document.getElementById("accFormTitle").innerHTML = "Add an account";
    document.getElementById("accSaveBtn").innerHTML = "Add account";
}

function deleteAccount(id) {
    let index = indexById(accounts, id);
    let a = accounts[index];

    if (a.username === me) {
        toast("You cannot delete the account you are signed in with.", true);
        return;
    }
    if (!confirm("Delete the account of " + a.fullName + "?")) {
        return;
    }

    accounts = removeAt(accounts, index);
    if (editingAccountId === id) {
        clearAccountForm();
    }
    toast(a.fullName + " was deleted.");
    showAccounts();
    showApprovals();
}

function saveAccount() {
    clearErrors("accountForm");

    let fullName = document.getElementById("accName").value.trim();
    let username = document.getElementById("accUser").value.trim();
    let email = document.getElementById("accEmail").value.trim();
    let password = document.getElementById("accPass").value;
    let role = document.getElementById("accRole").value;
    let status = radioValue("accStatus");
    let valid = true;

    if (fullName.length < 3) {
        showError("accName", "Name must have at least 3 letters.");
        valid = false;
    }
    if (!isUsername(username, 4, 15)) {
        showError("accUser", "4 to 15 letters, numbers or _.");
        valid = false;
    }
    if (!isEmail(email)) {
        showError("accEmail", "Write a valid email.");
        valid = false;
    }
    if (password.length < 6) {
        showError("accPass", "At least 6 characters.");
        valid = false;
    }
    if (role === "") {
        showError("accRole", "Choose a role.");
        valid = false;
    }

    for (let i = 0; i < accounts.length; i++) {
        let a = accounts[i];
        if (a.id === editingAccountId) {
            continue;
        }
        if (a.username.toLowerCase() === username.toLowerCase()) {
            showError("accUser", "Username already used.");
            valid = false;
        }
        if (a.email.toLowerCase() === email.toLowerCase()) {
            showError("accEmail", "Email already used.");
            valid = false;
        }
    }

    if (editingAccountId !== null) {
        let current = getById(accounts, editingAccountId);
        if (current.username === me && (role !== "admin" || status !== "Active")) {
            showError("accRole", "You cannot change your own role or status.");
            valid = false;
        }
    }

    if (!valid) {
        toast("Please fix the highlighted fields.", true);
        return false;
    }

    if (editingAccountId === null) {
        accounts.push({
            id: nextId(accounts),
            fullName: fullName,
            username: username,
            email: email,
            password: password,
            role: role,
            status: status,
            joined: todayDate()
        });
        toast("Account for " + fullName + " added.");
    } else {
        let a = getById(accounts, editingAccountId);
        a.fullName = fullName;
        a.username = username;
        a.email = email;
        a.password = password;
        a.role = role;
        a.status = status;
        toast("Changes saved.");
    }

    clearAccountForm();
    showAccounts();
    showApprovals();
    return false;
}

function showApprovals() {
    let cards = "";
    let waitingCount = 0;

    let select = document.getElementById("pickAccount");
    select.innerHTML = "";
    let first = document.createElement("option");
    first.value = "";
    first.innerHTML = "Choose an account";
    select.appendChild(first);

    for (let i = 0; i < accounts.length; i++) {
        let a = accounts[i];
        if (a.status !== "Pending") {
            continue;
        }
        waitingCount = waitingCount + 1;
        let days = daysBetween(a.joined, todayDate());

        cards = cards +
            "<div class='item-card'>" +
                "<div class='item-row'>" +
                    "<div>" +
                        "<h4>" + a.fullName + "</h4>" +
                        "<span class='muted'>" + roleName(a.role) + " &middot; " + a.email + " &middot; waiting " + days + " day(s)</span>" +
                    "</div>" +
                    "<button class='btn btn-ok btn-mini' onclick='quickPick(" + a.id + ")'>Review</button>" +
                "</div>" +
            "</div>";

        let option = document.createElement("option");
        option.value = a.id;
        option.innerHTML = a.fullName + " (" + roleName(a.role) + ")";
        select.appendChild(option);
    }

    if (waitingCount === 0) {
        cards = "<p class='muted'>Nobody is waiting. Nice work!</p>";
        first.innerHTML = "No pending accounts";
    }
    document.getElementById("waitingList").innerHTML = cards;

    let history = "";
    for (let i = decisions.length - 1; i >= 0; i--) {
        let d = decisions[i];
        let colour = "High";
        if (d.decision === "Approved") {
            colour = "Low";
        }
        let reasonText = "";
        if (d.reason !== "") {
            reasonText = " &middot; " + d.reason;
        }
        history = history +
            "<div class='item-card " + colour + "'>" +
                "<div class='item-row'>" +
                    "<h4>" + d.name + " <span class='muted'>(" + roleName(d.role) + ")</span></h4>" +
                    statusTag(d.decision) +
                "</div>" +
                "<span class='muted'>" + d.date + "</span>" + reasonText +
            "</div>";
    }
    if (history === "") {
        history = "<p class='muted'>No decisions yet.</p>";
    }
    document.getElementById("historyList").innerHTML = history;
}

function quickPick(id) {
    document.getElementById("pickAccount").value = id;
    document.getElementById("reason").focus();
}

function countReason() {
    let length = document.getElementById("reason").value.length;
    document.getElementById("reasonCount").innerHTML = length + " / 150";
}

function saveDecision() {
    clearErrors("decisionForm");

    let id = Number(document.getElementById("pickAccount").value);
    let decision = radioValue("decision");
    let reason = document.getElementById("reason").value.trim();
    let valid = true;

    if (id === 0) {
        showError("pickAccount", "Choose an account first.");
        valid = false;
    }
    if (decision === "") {
        showError("decisionBox", "Approve or reject?");
        valid = false;
    }
    if (decision === "Rejected" && reason.length < 10) {
        showError("reason", "Explain the rejection in at least 10 characters.");
        valid = false;
    }
    if (!valid) {
        return false;
    }

    let account = getById(accounts, id);
    if (decision === "Approved") {
        account.status = "Active";
    } else {
        account.status = "Rejected";
    }

    decisions.push({
        name: account.fullName,
        role: account.role,
        decision: decision,
        reason: reason,
        date: todayDate()
    });

    toast(account.fullName + " was " + decision.toLowerCase() + ".");
    document.getElementById("decisionForm").reset();
    document.getElementById("reasonCount").innerHTML = "0 / 150";
    showApprovals();
    showAccounts();
    return false;
}

function showTickets() {
    let keyword = document.getElementById("ticketSearch").value;
    let status = document.getElementById("ticketStatus").value;
    let priority = document.getElementById("ticketPriority").value;
    let html = "";
    let open = 0;
    let progress = 0;
    let resolved = 0;
    let highOpen = 0;

    for (let i = 0; i < tickets.length; i++) {
        let t = tickets[i];

        if (t.status === "Open") {
            open = open + 1;
        } else if (t.status === "In Progress") {
            progress = progress + 1;
        } else {
            resolved = resolved + 1;
        }
        if (t.priority === "High" && t.status !== "Resolved") {
            highOpen = highOpen + 1;
        }

        if (status !== "" && t.status !== status) {
            continue;
        }
        if (priority !== "" && t.priority !== priority) {
            continue;
        }
        if (!hasText(t.subject + " " + t.from + " " + t.message, keyword)) {
            continue;
        }

        let user = findAccount(t.from);
        let userName = t.from;
        if (user != null) {
            userName = user.fullName;
        }

        let options = "";
        let choices = ["Open", "In Progress", "Resolved"];
        for (let c = 0; c < choices.length; c++) {
            let selected = "";
            if (choices[c] === t.status) {
                selected = " selected";
            }
            options = options + "<option" + selected + ">" + choices[c] + "</option>";
        }

        let removeButton = "";
        if (t.status === "Resolved") {
            removeButton = "<button class='btn btn-danger btn-mini' onclick='removeTicket(" + t.id + ")'>Remove</button>";
        }

        html = html +
            "<div class='item-card " + t.priority + "'>" +
                "<div class='item-row'>" +
                    "<h4>#" + t.id + " " + t.subject + "</h4>" +
                    "<span>" + statusTag(t.status) + " <span class='tag grey'>" + t.priority + "</span></span>" +
                "</div>" +
                "<p>" + t.message + "</p>" +
                "<div class='item-row'>" +
                    "<span class='muted'>From " + userName + " &middot; " + t.date + "</span>" +
                    "<span>" +
                        "<label class='hidden' for='ts" + t.id + "'>Status</label>" +
                        "<select id='ts" + t.id + "' onchange='changeTicket(" + t.id + ")'>" + options + "</select> " +
                        removeButton +
                    "</span>" +
                "</div>" +
            "</div>";
    }

    document.getElementById("tOpen").innerHTML = open;
    document.getElementById("tProgress").innerHTML = progress;
    document.getElementById("tResolved").innerHTML = resolved;
    document.getElementById("tHigh").innerHTML = highOpen;

    if (html === "") {
        html = "<p class='muted'>No tickets match.</p>";
    }
    document.getElementById("ticketList").innerHTML = html;
}

function changeTicket(id) {
    let t = getById(tickets, id);
    t.status = document.getElementById("ts" + id).value;
    toast("Ticket #" + id + " is now " + t.status + ".");
    showTickets();
}

function removeTicket(id) {
    tickets = removeAt(tickets, indexById(tickets, id));
    toast("Ticket #" + id + " removed.");
    showTickets();
}

function promoState(p) {
    let today = todayDate();
    if (today < p.from) {
        return "Upcoming";
    }
    if (today > p.to) {
        return "Expired";
    }
    return "Active";
}

function showPromos() {
    let rows = "";
    for (let i = 0; i < promos.length; i++) {
        let p = promos[i];
        rows = rows +
            "<tr>" +
                "<td><strong>" + p.code + "</strong><br><span class='muted'>" + p.note + "</span></td>" +
                "<td>" + p.percent + "%</td>" +
                "<td>" + p.from + "<br>" + p.to + "</td>" +
                "<td>" + statusTag(promoState(p)) + "</td>" +
                "<td><button class='btn btn-danger btn-mini' onclick='deletePromo(" + p.id + ")'>Delete</button></td>" +
            "</tr>";
    }
    if (rows === "") {
        rows = "<tr><td colspan='5'>No promo codes yet.</td></tr>";
    }
    document.getElementById("promoRows").innerHTML = rows;
}

function deletePromo(id) {
    let index = indexById(promos, id);
    let code = promos[index].code;
    if (!confirm("Delete code " + code + "?")) {
        return;
    }
    promos = removeAt(promos, index);
    toast(code + " deleted.");
    showPromos();
}

function findPromo(code) {
    for (let i = 0; i < promos.length; i++) {
        if (promos[i].code === code) {
            return promos[i];
        }
    }
    return null;
}

function upperCaseCode() {
    let box = document.getElementById("promoCode");
    box.value = box.value.toUpperCase();
}

function savePromo() {
    clearErrors("promoForm");

    let code = document.getElementById("promoCode").value.trim().toUpperCase();
    let percentText = document.getElementById("promoPercent").value;
    let percent = Number(percentText);
    let from = document.getElementById("promoFrom").value;
    let to = document.getElementById("promoTo").value;
    let valid = true;

    if (code.length < 4 || code.length > 12 || !onlyHas(code, CAPITALS + DIGITS)) {
        showError("promoCode", "4 to 12 capital letters or numbers.");
        valid = false;
    } else if (findPromo(code) != null) {
        showError("promoCode", "This code already exists.");
        valid = false;
    }
    if (isEmpty(percentText) || percent < 5 || percent > 50) {
        showError("promoPercent", "Discount must be 5 to 50.");
        valid = false;
    }
    if (isEmpty(from)) {
        showError("promoFrom", "Pick a start date.");
        valid = false;
    }
    if (isEmpty(to)) {
        showError("promoTo", "Pick an end date.");
        valid = false;
    } else if (!isEmpty(from) && to < from) {
        showError("promoTo", "End date must be after the start date.");
        valid = false;
    }
    if (!valid) {
        return false;
    }

    let note = document.getElementById("promoNote").value.trim();
    if (note === "") {
        note = "-";
    }

    promos.push({
        id: nextId(promos),
        code: code,
        percent: percent,
        from: from,
        to: to,
        note: note
    });
    toast("Promo code " + code + " added.");
    document.getElementById("promoForm").reset();
    showPromos();
    return false;
}

function testPromo() {
    clearErrors("testForm");
    let result = document.getElementById("testResult");
    result.className = "result-line hidden";

    let code = document.getElementById("testCode").value.trim().toUpperCase();
    let amount = Number(document.getElementById("testAmount").value);
    let valid = true;

    if (isEmpty(code)) {
        showError("testCode", "Type a code.");
        valid = false;
    }
    if (!(amount > 0)) {
        showError("testAmount", "Type an amount above 0.");
        valid = false;
    }
    if (!valid) {
        return false;
    }

    let promo = findPromo(code);
    if (promo === null) {
        showError("testCode", "No such code.");
        return false;
    }
    if (promoState(promo) !== "Active") {
        showError("testCode", "This code is " + promoState(promo).toLowerCase() + ".");
        return false;
    }

    let saving = amount * promo.percent / 100;
    result.innerHTML = money(amount) + " &rarr; <strong>" + money(amount - saving) + "</strong> <span class='muted'>(save " + money(saving) + ")</span>";
    result.className = "result-line";
    return false;
}

document.getElementById("accountForm").onsubmit = saveAccount;
document.getElementById("accCancelBtn").addEventListener("click", clearAccountForm);
document.getElementById("accSearch").addEventListener("keyup", showAccounts);
document.getElementById("roleFilter").addEventListener("change", showAccounts);
document.getElementById("statusFilter").addEventListener("change", showAccounts);

document.getElementById("decisionForm").onsubmit = saveDecision;
document.getElementById("reason").addEventListener("keyup", countReason);

document.getElementById("ticketSearch").addEventListener("keyup", showTickets);
document.getElementById("ticketStatus").addEventListener("change", showTickets);
document.getElementById("ticketPriority").addEventListener("change", showTickets);

document.getElementById("promoForm").onsubmit = savePromo;
document.getElementById("promoCode").addEventListener("keyup", upperCaseCode);
document.getElementById("testForm").onsubmit = testPromo;

setupSidebar();
showAccounts();
showApprovals();
showTickets();
showPromos();
