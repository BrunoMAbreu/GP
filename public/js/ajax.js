

function login() {
    const formElement = document.getElementById("loginForm");
    const data = "email=" + formElement.email.value + "&password=" + formElement.password.value;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/processLogin", true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "text";
    xhr.onreadystatechange = function () {
        const response = JSON.parse(xhr.responseText);
        if(response === "false"){

            /////
            console.log(">>>>>> " + response);
        }
        
        
        //if(response)


        if ((this.readyState === 4) && (this.status === 200)) {
            //let response = JSON.parse(xhr.responseText);
            
            // Mudar para se false
            alert("Login inválido");
            //createTable(response);
        }
    }
    xhr.send(data);
}