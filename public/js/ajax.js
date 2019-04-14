

function login() {
    const formElement = document.getElementById("loginForm");
    const data = "email=" + formElement.email.value + "&password=" + formElement.password.value;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/processLogin", true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "text";
    xhr.onreadystatechange = function () { 
        if(xhr.readyState === 4){
            if(xhr.responseText === "false"){
                alert("Login inválido");
            }

            console.log("xhr.responseText: " + xhr.responseText);
            console.log("xhr.responseURL: " + xhr.responseURL);
            //if (xhr.responseText == "redirect") {
                //redirecting to main page from here.
                window.location.replace(xhr.responseURL);
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
        }
    }
    xhr.send(data);
}