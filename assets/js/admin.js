$(document).ready(()=>{
    $(".logout").click(()=>{
        delete localStorage.user;
        window.location.href = "index.html";
    });
    showUser();
});

function showUser(){
    let user = JSON.parse(localStorage.user);
    $(".user-display-name").text(user.nome);
}