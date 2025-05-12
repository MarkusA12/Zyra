document.getElementById("signup-btn").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form from submitting

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm-password").value;
    let username = document.getElementById("username").value;
    let termsAccepted = document.getElementById("remember").checked;

    let savedEmail = JSON.parse(localStorage.getItem("userEmail")) || [];
    let savedPassword = JSON.parse(localStorage.getItem("userPassword")) || [];
    let savedUsername = JSON.parse(localStorage.getItem("userUsername")) || [];

    


    if (!email || !password || !confirmPassword || !username) {
        alert("Please fill in all fields.");
        return;
    }

    if (!email.includes("@") || !email.includes(".")){
        alert("Email is not valid, please use another email.")
        return;
    }

    if(password.length < 8){
        alert("Minimum length of password is 8 character, please try again")
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    if (!termsAccepted) {
        alert("You must accept the Terms of Service to sign up.");
        return;
    }

    // Check if email already exists
    if (savedEmail.includes(email)) {
        alert("Email already taken, please choose another email.");
        return;
    }
    if (savedUsername.includes(username)) {
        alert("Username already taken, please choose another username.");
        return;
    }

    // Save new email and password
    savedEmail.push(email);
    savedPassword.push(password);
    savedUsername.push(username);

    localStorage.setItem("userEmail", JSON.stringify(savedEmail));
    localStorage.setItem("userPassword", JSON.stringify(savedPassword));
    localStorage.setItem("userUsername", JSON.stringify(savedUsername));

    alert("Account created successfully! Redirecting to login...");

    // Redirect to login page
    window.location.href = "login.html";
});