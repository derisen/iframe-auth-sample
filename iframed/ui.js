// Select DOM elements to work with
const cardDiv = document.getElementById("card-div");
const profileDiv = document.getElementById("profile-div")
const signInButton = document.getElementById("SignIn");
const callApiButton = document.getElementById("callApiButton");

function welcomeUser() {
    signInButton.setAttribute("onclick", "signOut();");
    signInButton.setAttribute('class', "btn btn-success")
    signInButton.innerHTML = "Sign Out";

    callApiButton.classList.remove("d-none");
}

function updateUI(data, endpoint) {
    console.log('Graph API responded at: ' + new Date().toString());

    if (endpoint === graphConfig.graphMeEndpoint) {
        profileDiv.innerHTML = ''
        const title = document.createElement('p');
        title.innerHTML = "<strong>Title: </strong>" + data.jobTitle;
        const email = document.createElement('p');
        email.innerHTML = "<strong>Mail: </strong>" + data.mail;
        const phone = document.createElement('p');
        phone.innerHTML = "<strong>Phone: </strong>" + data.businessPhones[0];
        const address = document.createElement('p');
        address.innerHTML = "<strong>Location: </strong>" + data.officeLocation;
        profileDiv.appendChild(title);
        profileDiv.appendChild(email);
        profileDiv.appendChild(phone);
        profileDiv.appendChild(address);
    }
}
