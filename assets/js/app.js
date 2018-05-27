// Inicia o banco
openDB();
var user;
$(document).ready(() => {
    $(".open-cadastro").click(() => {
        $("#modalCadastro").modal("show");
    });
    $(".open-login").click(() => {
        $("#modalLogin").modal("show");
    });

    $("#btnCadastrar").click((e) => {
        e.preventDefault();
        let nome = $("#nomeCadastro").val();
        let email = $("#emailCadastro").val();
        let senha = $("#senhaCadastro").val();

        let user = {
            nome:nome, 
            email:email, 
            senha:senha }

        cadastrar(user);

    });
    $("#btnLogin").click((e)=>{
        e.preventDefault();
        let user = $("#emailLogin").val();
        let pass =  $("#senhaLogin").val();
        checkLogin(user, pass);
        
    });


});
function cadastrar(user){
    insertUser(user);
}
