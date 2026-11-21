function money(amount) {
    return "৳" + Math.round(amount).toLocaleString("en-US");
}

function todayDate() {
    let d = new Date();
    let month = String(d.getMonth() + 1).padStart(2, "0");
    let day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + month + "-" + day;
}


function shiftDate(dateText, days) {
    let d = new Date(dateText + "T00:00:00");
    d.setDate(d.getDate() + days);
    let month = String(d.getMonth() + 1).padStart(2, "0");
    let day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + month + "-" + day;
}

function daysBetween(a, b) {
    let one = new Date(a + "T00:00:00");
    let two = new Date(b + "T00:00:00");
    return Math.round((two - one) / 86400000);
}

function shortDay(dateText) {
    let names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return names[new Date(dateText + "T00:00:00").getDay()];
}

function nextId(list) {
    let biggest = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i].id > biggest) {
            biggest = list[i].id;
        }
    }
    return biggest + 1;
}

function removeAt(list, index) {
    return list.slice(0, index).concat(list.slice(index + 1));
}


function indexById(list, id) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}

function getById(list, id) {
    let index = indexById(list, id);
    if (index === -1) {
        return null;
    }
    return list[index];
}

function hasText(text, keyword) {
    return String(text).toLowerCase().indexOf(keyword.trim().toLowerCase()) !== -1;
}

function isEmpty(value) {
    return String(value).trim() === "";
}

function onlyHas(text, allowed) {
    if (text.length === 0) {
        return false;
    }
    for (let i = 0; i < text.length; i++) {
        if (allowed.indexOf(text[i]) === -1) {
            return false;
        }
    }
    return true;
}

const DIGITS = "0123456789";
const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CAPITALS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function isDigitsOnly(text) {
    return onlyHas(text, DIGITS);
}

function hasAny(text, chars) {
    for (let i = 0; i < text.length; i++) {
        if (chars.indexOf(text[i]) !== -1) {
            return true;
        }
    }
    return false;
}

function isEmail(email) {
    let at = email.indexOf("@");
    let dot = email.indexOf(".", at);
    if (at < 1) {
        return false;
    }
    if (email.indexOf("@", at + 1) !== -1) {
        return false;
    }
    if (dot < at + 2 || dot > email.length - 3) {
        return false;
    }
    if (email.indexOf(" ") !== -1) {
        return false;
    }
    return true;
}

function isPhoneBD(phone) {
    if (phone.length !== 11 || !isDigitsOnly(phone)) {
        return false;
    }
    if (phone[0] !== "0" || phone[1] !== "1") {
        return false;
    }
    return "3456789".indexOf(phone[2]) !== -1;
}

function isUsername(text, min, max) {
    if (text.length < min || text.length > max) {
        return false;
    }
    return onlyHas(text, LETTERS + DIGITS + "_");
}

function isCode(text, start, digitCount) {
    if (text.indexOf(start) !== 0) {
        return false;
    }
    let rest = text.substring(start.length);
    return rest.length === digitCount && isDigitsOnly(rest);
}

function radioValue(name) {
    let radios = document.getElementsByName(name);
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return "";
}

function setRadio(name, value) {
    let radios = document.getElementsByName(name);
    for (let i = 0; i < radios.length; i++) {
        radios[i].checked = (radios[i].value === value);
    }
}

function checkedValues(name) {
    let boxes = document.getElementsByName(name);
    let values = [];
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].checked) {
            values.push(boxes[i].value);
        }
    }
    return values;
}

function showError(inputId, message) {
    let input = document.getElementById(inputId);
    let msg = document.getElementById(inputId + "Error");
    if (input != null) {
        input.style.borderColor = "#e5484d";
    }
    if (msg != null) {
        msg.innerHTML = message;
    }
}

function clearErrors(formId) {
    let form = document.getElementById(formId);

    let messages = form.getElementsByClassName("field-error");
    for (let i = 0; i < messages.length; i++) {
        messages[i].innerHTML = "";
    }

    let groups = ["input", "select", "textarea", "div"];
    for (let g = 0; g < groups.length; g++) {
        let items = form.getElementsByTagName(groups[g]);
        for (let i = 0; i < items.length; i++) {
            items[i].style.borderColor = "";
        }
    }
}

let toastTimer = null;

function toast(message, isBad) {
    let box = document.getElementById("toast");
    box.innerHTML = message;
    if (isBad) {
        box.className = "toast show bad";
    } else {
        box.className = "toast show";
    }
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 2500);
}

function hideToast() {
    document.getElementById("toast").className = "toast";
}

function statusTag(status) {
    let green = ["Active", "Confirmed", "Accepted", "Open", "Resolved", "Completed", "Approved", "Visited"];
    let amber = ["Pending", "Requested", "Waiting", "In Progress", "Upcoming", "Planned"];
    let red = ["Suspended", "Rejected", "Declined", "Expired", "Closed", "Cancelled"];

    let colour = "grey";
    if (green.indexOf(status) !== -1) {
        colour = "green";
    } else if (amber.indexOf(status) !== -1) {
        colour = "amber";
    } else if (red.indexOf(status) !== -1) {
        colour = "red";
    } else if (status === "Dream") {
        colour = "blue";
    }
    return "<span class='tag " + colour + "'>" + status + "</span>";
}

function starText(count) {
    let text = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= count) {
            text = text + "★";
        } else {
            text = text + "☆";
        }
    }
    return text;
}

function findAccount(username) {
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].username === username) {
            return accounts[i];
        }
    }
    return null;
}

function findTour(id) {
    return getById(tours, id);
}

function findStay(id) {
    return getById(stays, id);
}

function roleName(role) {
    switch (role) {
        case "traveler":
            return "Traveller";
        case "guide":
            return "Tour Guide";
        case "provider":
            return "Service Provider";
        default:
            return "Admin";
    }
}

function openPanel(number) {
    let links = document.getElementsByClassName("menu-link");
    let panels = document.getElementsByClassName("panel");

    for (let i = 0; i < links.length; i++) {
        if (i === number) {
            links[i].className = "menu-link current";
            panels[i].className = "panel";
        } else {
            links[i].className = "menu-link";
            panels[i].className = "panel hidden";
        }
    }

    document.getElementById("panelTitle").innerHTML = links[number].innerHTML;
}

function openPanel1() { openPanel(0); }
function openPanel2() { openPanel(1); }
function openPanel3() { openPanel(2); }
function openPanel4() { openPanel(3); }

function setupSidebar() {
    let links = document.getElementsByClassName("menu-link");
    links[0].addEventListener("click", openPanel1);
    links[1].addEventListener("click", openPanel2);
    links[2].addEventListener("click", openPanel3);
    links[3].addEventListener("click", openPanel4);

    document.getElementById("todayText").innerHTML = new Date().toDateString();
}
