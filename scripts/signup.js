


function showRolePart() {
    let role = radioValue("role");
    let parts = ["traveler", "guide", "provider"];

    for (let i = 0; i < parts.length; i++) {
        let part = document.getElementById(parts[i] + "Part");
        if (parts[i] === role) {
            part.className = "";
        } else {
            part.className = "hidden";
        }
    }

    let photo = document.getElementById("sidePhoto");
    switch (role) {
        case "guide":
            photo.src = "images/side-guide.jpg";
            photo.alt = "Tour guide showing a map to a group";
            break;
        case "provider":
            photo.src = "images/side-provider.jpg";
            photo.alt = "Hotel room with a big bed and a city view";
            break;
        default:
            photo.src = "images/side-traveller.jpg";
            photo.alt = "Traveller with a backpack at the beach";
    }

    let cards = document.getElementsByClassName("role-option");
    let radios = document.getElementsByName("role");
    for (let i = 0; i < cards.length; i++) {
        if (radios[i].checked) {
            cards[i].className = "role-option picked";
        } else {
            cards[i].className = "role-option";
        }
    }
}


function checkStrength() {
    let pass = document.getElementById("password").value;
    let points = 0;

    if (pass.length >= 8) {
        points = points + 1;
    }
    if (hasAny(pass, CAPITALS) && hasAny(pass, "abcdefghijklmnopqrstuvwxyz")) {
        points = points + 1;
    }
    if (hasAny(pass, DIGITS)) {
        points = points + 1;
    }
    if (!onlyHas(pass, LETTERS + DIGITS) && pass.length > 0) {
        points = points + 1;
    }

    let words = ["Too short", "Weak", "Okay", "Good", "Strong"];
    let colours = ["#e5484d", "#e5484d", "#f2b134", "#4a90d9", "#3bb273"];

    document.getElementById("strengthFill").style.width = (points * 25) + "%";
    document.getElementById("strengthFill").style.background = colours[points];
    document.getElementById("strengthText").innerHTML = "Strength: " + words[points];
}

function resetStrength() {
    document.getElementById("strengthFill").style.width = "0";
    document.getElementById("strengthText").innerHTML = "Use letters, numbers and a symbol";
}


function ageFrom(birthDate) {
    return Math.floor(daysBetween(birthDate, todayDate()) / 365.25);
}


function validateSignup() {
    clearErrors("signupForm");

    let role = radioValue("role");
    let fullName = document.getElementById("fullName").value.trim();
    let userName = document.getElementById("userName").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let birthDate = document.getElementById("birthDate").value;
    let password = document.getElementById("password").value;
    let confirmPass = document.getElementById("confirmPass").value;
    let valid = true;

    if (role === "") {
        document.getElementById("rolePickerError").innerHTML = "Please choose how you want to join.";
        valid = false;
    }

    if (fullName.length < 3) {
        showError("fullName", "Write your full name (at least 3 letters).");
        valid = false;
    } else if (!onlyHas(fullName, LETTERS + " .")) {
        showError("fullName", "Use letters, spaces and dots only.");
        valid = false;
    }

    if (!isUsername(userName, 4, 15)) {
        showError("userName", "4 to 15 letters, numbers or _ (no spaces).");
        valid = false;
    } else if (findAccount(userName) != null) {
        showError("userName", "This username is taken. Try another one.");
        valid = false;
    }

    if (!isEmail(email)) {
        showError("email", "Write a valid email like name@mail.com.");
        valid = false;
    } else {
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].email.toLowerCase() === email.toLowerCase()) {
                showError("email", "An account already uses this email.");
                valid = false;
            }
        }
    }

    if (!isPhoneBD(phone)) {
        showError("phone", "Use an 11-digit number like 01712345678.");
        valid = false;
    }

    if (isEmpty(birthDate)) {
        showError("birthDate", "Please pick your date of birth.");
        valid = false;
    } else {
        let minAge = 18;
        if (role === "traveler") {
            minAge = 12;
        }
        if (ageFrom(birthDate) < minAge) {
            showError("birthDate", "You must be at least " + minAge + " years old for this role.");
            valid = false;
        }
    }

    if (password.length < 8) {
        showError("password", "Password needs at least 8 characters.");
        valid = false;
    } else if (!hasAny(password, DIGITS)) {
        showError("password", "Add at least one number to your password.");
        valid = false;
    }

    if (confirmPass !== password || isEmpty(confirmPass)) {
        showError("confirmPass", "Both passwords must be the same.");
        valid = false;
    }

    if (role === "traveler") {
        if (isEmpty(document.getElementById("homeCity").value)) {
            showError("homeCity", "Choose your home city.");
            valid = false;
        }
        if (checkedValues("tripType").length === 0) {
            showError("tripTypes", "Pick at least one kind of trip.");
            valid = false;
        }
    }

    if (role === "guide") {
        if (!isCode(document.getElementById("licenseNo").value.trim(), "TG-", 5)) {
            showError("licenseNo", "Licence looks like TG-12345.");
            valid = false;
        }
        let years = document.getElementById("yearsExp").value;
        if (isEmpty(years) || Number(years) < 0 || Number(years) > 40) {
            showError("yearsExp", "Write a number from 0 to 40.");
            valid = false;
        }
        if (isEmpty(document.getElementById("region").value)) {
            showError("region", "Choose your main region.");
            valid = false;
        }
        if (checkedValues("language").length === 0) {
            showError("languages", "Pick at least one language.");
            valid = false;
        }
    }

    if (role === "provider") {
        if (document.getElementById("businessName").value.trim().length < 3) {
            showError("businessName", "Write your business name.");
            valid = false;
        }
        if (!isCode(document.getElementById("tradeNo").value.trim(), "TRD-", 6)) {
            showError("tradeNo", "Trade licence looks like TRD-123456.");
            valid = false;
        }
        if (radioValue("offer") === "") {
            showError("partnerType", "Tell us what you offer.");
            valid = false;
        }
        if (document.getElementById("address").value.trim().length < 10) {
            showError("address", "Write the full address (at least 10 characters).");
            valid = false;
        }
    }

    if (!document.getElementById("agree").checked) {
        showError("agreeBox", "You need to accept the terms.");
        valid = false;
    }

    let notice = document.getElementById("signupNotice");
    if (!valid) {
        notice.innerHTML = "Some fields need your attention.";
        notice.className = "notice bad";
        return false;
    }

    let shownName = fullName;
    if (role === "provider") {
        shownName = document.getElementById("businessName").value.trim();
    }
    let status = "Pending";
    if (role === "traveler") {
        status = "Active";
    }

    accounts.push({
        id: nextId(accounts),
        fullName: shownName,
        username: userName,
        email: email,
        password: password,
        role: role,
        status: status,
        joined: todayDate()
    });

    let message = "Welcome, " + fullName + "! Your traveller account is ready.";
    if (role !== "traveler") {
        message = "Thanks, " + fullName + "! Your account was sent to the admin team for approval.";
    }
    notice.innerHTML = message + " (Prototype note: data is kept only while this page is open.)";
    notice.className = "notice good";

    document.getElementById("signupForm").reset();
    showRolePart();
    resetStrength();
    window.scrollTo(0, 0);
    return false;
}


function startOver() {
    setTimeout(tidyAfterReset, 0);
}

function tidyAfterReset() {
    clearErrors("signupForm");
    showRolePart();
    resetStrength();
    document.getElementById("signupNotice").className = "notice hidden";
}


let roleRadios = document.getElementsByName("role");
for (let i = 0; i < roleRadios.length; i++) {
    roleRadios[i].addEventListener("change", showRolePart);
}
document.getElementById("password").addEventListener("keyup", checkStrength);
document.getElementById("resetBtn").addEventListener("click", startOver);
document.getElementById("signupForm").onsubmit = validateSignup;
