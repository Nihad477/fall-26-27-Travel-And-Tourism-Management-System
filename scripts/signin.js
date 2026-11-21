function signinNotice(text, kind) {
    let box = document.getElementById("signinNotice");
    box.innerHTML = text;
    box.className = "notice " + kind;
}


function togglePassword() {
    let pass = document.getElementById("loginPass");
    let button = document.getElementById("peekBtn");
    if (pass.type === "password") {
        pass.type = "text";
        button.innerHTML = "Hide password";
    } else {
        pass.type = "password";
        button.innerHTML = "Show password";
    }
}


function validateSignin() {
    clearErrors("signinForm");
    document.getElementById("signinNotice").className = "notice hidden";

    let loginId = document.getElementById("loginId").value.trim();
    let password = document.getElementById("loginPass").value;
    let valid = true;

    if (isEmpty(loginId)) {
        showError("loginId", "Please type your username or email.");
        valid = false;
    }
    if (isEmpty(password)) {
        showError("loginPass", "Please type your password.");
        valid = false;
    } else if (password.length < 6) {
        showError("loginPass", "Passwords are at least 6 characters.");
        valid = false;
    }
    if (!valid) {
        return false;
    }

    let account = null;
    for (let i = 0; i < accounts.length; i++) {
        let a = accounts[i];
        if (a.username === loginId || a.email.toLowerCase() === loginId.toLowerCase()) {
            account = a;
            break;
        }
    }

    if (account === null || account.password !== password) {
        signinNotice("Wrong username/email or password. Please try again.", "bad");
        return false;
    }

    if (account.status === "Pending") {
        signinNotice("Hi " + account.fullName + ", your account is still waiting for admin approval.", "bad");
        return false;
    }
    if (account.status === "Suspended" || account.status === "Rejected") {
        signinNotice("This account is " + account.status.toLowerCase() + ". Please contact the help desk.", "bad");
        return false;
    }

    let page = "index.html";
    switch (account.role) {
        case "admin":
            page = "admin.html";
            break;
        case "traveler":
            page = "traveler.html";
            break;
        case "guide":
            page = "guide.html";
            break;
        case "provider":
            page = "provider.html";
            break;
    }

    signinNotice("Signed in! Opening your dashboard...", "good");
    window.location.href = page;
    return false;
}


document.getElementById("peekBtn").addEventListener("click", togglePassword);
document.getElementById("signinForm").onsubmit = validateSignin;
