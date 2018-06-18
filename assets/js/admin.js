$(document).ready(()=>{
    $('[data-toggle=offcanvas]').click(function() {
        $('.row-offcanvas').toggleClass('active');
        $('.collapse').toggleClass('in').toggleClass('hidden-xs').toggleClass('visible-xs');
    });
    
    $(".logout").click(()=>{
        delete localStorage.user;
        window.location.href = "index.html";
    });
    showUser();
    $(".add-post").click(()=>{
        $("#modalAddPost").modal("show");
        addPost();
    });
    $(".show-all-posts").click(()=>{
        $("#modalShowAllPosts").modal("show");
    });
    $(".show-all-comments").click(()=>{
        $("#modalShowAllComments").modal("show");
    });
    $("#newPostSave").click((e)=>{
        e.preventDefault();
        actions().postar();
        $("#modalAddPost").modal("hide");
        $("#modalSucesso").modal("show");
        $(".mensagem-sucesso").text("Post Adicionado com sucesso!");
        $("#modalSucesso").modal("show");
        
     });

    $("#picImageNewPost").on("change", (evt)=>{
        carregaImagem(evt).then((data)=>{
            $("#featuredImgNewPost").attr("src", data);
        })
        .catch(e => console.log(e));
    });
});

function showUser(){
    let user = JSON.parse(localStorage.user);
    $(".user-display-name").text("Olá "+  user.tipo  + ", " +  user.nome); 
}
function addPost(){
    $('#summernote').summernote({
        tabsize: 5,
        height: 300
    });
    
}
function showAllPosts(){

}

function showAllComments(){

}