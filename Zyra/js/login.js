document.getElementById("submit")?.addEventListener("click", function(e) {
    e.preventDefault();
    
    // Normalize email input
    const email = document.getElementById("email").value.toLowerCase().trim();
    const password = document.getElementById("password").value;
    
    // Get all data with validation
    const savedEmail = JSON.parse(localStorage.getItem("userEmail")) || [];
    const savedPassword = JSON.parse(localStorage.getItem("userPassword")) || [];
    const savedUsername = JSON.parse(localStorage.getItem("userUsername")) || [];
    
    // Verify data integrity
    if (savedEmail.length !== savedPassword.length || savedEmail.length !== savedUsername.length) {
        console.error("DATA CORRUPTION DETECTED! Array lengths:", {
            emails: savedEmail.length,
            passwords: savedPassword.length,
            usernames: savedUsername.length
        });
        cleanUserData(); // Automatically fix the data
        return;
    }
    
    // Find user with safety checks
    let userIndex = -1;
    for (let i = 0; i < savedEmail.length; i++) {
        if (savedEmail[i] && savedEmail[i].toLowerCase().trim() === email && 
            savedPassword[i] === password) {
            userIndex = i;
            break;
        }
    }
    
    if (userIndex >= 0 && savedUsername[userIndex]) {
        // Store the COMPLETE user object
        const userData = {
            index: userIndex,
            email: savedEmail[userIndex],
            username: savedUsername[userIndex],
            timestamp: new Date().getTime()
        };
        
        localStorage.setItem("currentUser", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
        
        console.log("Successful login:", userData);
        window.location.href = "Home.html";
    } else {
        alert("Invalid credentials or missing user data. Please try again.");
    }
});


// Logout function
function logout() {
    // Clear all possible auth data
    [
        "isLoggedIn", 
        "currentUser",
        "currentUserIndex",
        "loggedInUsername",
        "User"
    ].forEach(key => localStorage.removeItem(key));
    
    window.location.href = "Login.html";
}

function cleanUserData() {
    const emails = JSON.parse(localStorage.getItem("userEmail")) || [];
    const passwords = JSON.parse(localStorage.getItem("userPassword")) || [];
    const usernames = JSON.parse(localStorage.getItem("userUsername")) || [];
    
    // Find the minimum length
    const minLength = Math.min(emails.length, passwords.length, usernames.length);
    
    // Trim all arrays to match the minimum length
    localStorage.setItem("userEmail", JSON.stringify(emails.slice(0, minLength)));
    localStorage.setItem("userPassword", JSON.stringify(passwords.slice(0, minLength)));
    localStorage.setItem("userUsername", JSON.stringify(usernames.slice(0, minLength)));
    
    console.log("Cleaned user data. New lengths:", minLength);
}

// Run this once to fix existing data
cleanUserData();

// On page load
document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const loginNav = document.getElementById("loginNav");
    const logoutButton = document.getElementById("Logout");
    const usernameDisplay = document.getElementById("usernameDisplay");

    if (isLoggedIn) {
        // Try multiple methods to get username
        let username = null;
        let userData = null;
        
        // Method 1: Get from complete user object
        try {
            userData = JSON.parse(localStorage.getItem("currentUser"));
            if (userData && userData.username) {
                username = userData.username;
            }
        } catch (e) {
            console.error("Error parsing user data:", e);
        }
        
        // Method 2: Get from username array
        if (!username) {
            const usernames = JSON.parse(localStorage.getItem("userUsername")) || [];
            const userIndex = localStorage.getItem("currentUserIndex");
            if (usernames[userIndex]) {
                username = usernames[userIndex];
            }
        }
        
        // Update UI
        if (username) {
            loginNav.style.display = "none";
            logoutButton.style.display = "inline-block";
            usernameDisplay.style.display = "inline-block";
            usernameDisplay.textContent = `${username}`;
        } else {
            console.error("All username retrieval methods failed");
            logout(); // Force logout if we can't verify user
        }
    } else {
        loginNav.style.display = "inline-block";
        logoutButton.style.display = "none";
        usernameDisplay.style.display = "none";
    }

    logoutButton?.addEventListener("click", logout);
});