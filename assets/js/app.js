$(document).ready(() => {
    
    $("#btnCadastrarOption").click(() => {
        $("#modalCadastro").modal("show");
    });
    $("#btnLoginOption").click(() => {
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
    $("#btnLogin").click((e) => {
        e.preventDefault();
        let email = $("#emailLogin").val();
        let senha = $("#senhaLogin").val();

    });


});
function cadastrar(user){
    if(!db_app){
        openDB();
    }else{
        insertUser(user);
    }
}
function login(){
    if(!db_app){
        openDB();
    }else{
        insert()
    }
    

}