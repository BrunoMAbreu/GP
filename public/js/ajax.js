

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