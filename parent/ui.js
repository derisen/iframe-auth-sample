// Select DOM elements to work with
const welcomeDiv = document.getElementById("welcome-div");
const signInButton = document.getElementById("SignIn");
const frameDiv1 = document.getElementById("frame-div-1");

function welcomeUser(username) {
    // Reconfiguring DOM elements
    welcomeDiv.innerHTML = `Welcome ${username}`;
    signInButton.setAttribute("onclick", "signOut();");
    signInButton.setAttribute('class', "btn btn-success")
    signInButton.innerHTML = "Sign Out";
}
