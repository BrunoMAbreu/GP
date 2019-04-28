'use strict';

Object.prototype.insertAfter = function (newNode) {
    this.parentNode.insertBefore(newNode, this.nextSibling);
}

let registerForm = {
    submitButton: null,
    buttonColor: null,
    passwordElement: null,
    confirmedPasswordElement: null
}
window.addEventListener("load", setRegisterForm);

function setRegisterForm() {

    const metaTagsArray = document.getElementsByTagName('meta');
    for (let item of metaTagsArray) {
        if (item.content === "Register") {
            registerForm.submitButton = document.getElementById("submit").getElementsByTagName("BUTTON")[0];
            registerForm.buttonColor = registerForm.submitButton.style.backgroundColor;
            registerForm.passwordElement = document.getElementById("input_pw");

            let imageEyePw1 = document.createElement("IMG");
            imageEyePw1.style = "position: relative; top: -22px; right:-504px; text-align: right; height: 18px; width: 18px";
            imageEyePw1.src = "./images/eye_cl.png";
            let imageEyePw2 = imageEyePw1.cloneNode(true);
            document.getElementById("span_pw").insertAfter(imageEyePw1);
            document.getElementById("span_conf_pw").insertAfter(imageEyePw2);

            registerForm.confirmedPasswordElement = document.getElementById("input_conf_pw");
            registerForm.confirmedPasswordElement.onblur = pwComparison;
            registerForm.passwordElement.onblur = pwComparison;
        }
    }
}

// Checks if password and password confirmation are identical
const pwComparison = function () {
    if (registerForm.passwordElement.value !== "" && registerForm.confirmedPasswordElement.value !== "") {
        if (registerForm.passwordElement !== null && registerForm.confirmedPasswordElement !== null
            && (registerForm.passwordElement.value !== registerForm.confirmedPasswordElement.value)) {
            registerForm.passwordElement.style = "color: red";
            registerForm.confirmedPasswordElement.style = "color: red"
            registerForm.submitButton.disabled = true;
            registerForm.submitButton.style = "background-color: #AAA"
        } else {
            registerForm.passwordElement.style = "color: black";
            registerForm.confirmedPasswordElement.style = "color: black";
            registerForm.submitButton.disabled = false;
            registerForm.submitButton.style = "background-color: " + registerForm.buttonColor;
        }
    }
}


/*
function login() {
    const formElement = document.getElementById("loginForm");
    const data = "email=" + formElement.email.value + "&password=" + formElement.password.value;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/login", true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "text";
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4){
            if(xhr.responseText === "false"){
                alert("Login inválido");
            }

            console.log("xhr.responseText: " + xhr.responseText);
            console.log("xhr.responseURL: " + xhr.responseURL); */
            //if (xhr.responseText == "redirect") {
                //redirecting to main page from here.
                //window.location.replace(xhr.responseURL);
              //}

/*
else if (xhr.status === 200){
    console.log("aaaaaa");
    //onSuccess(xhr.responseText, xhr.responseType);
}*/
/*
else{
    console.log(xhr.status);
}
*/
/*       }
   }
   xhr.send(data);
}*/