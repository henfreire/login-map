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
});

function showUser(){
    let user = JSON.parse(localStorage.user);
    $(".user-display-name").text("Olá "+  user.tipo  + ", " +  user.nome); 
}
function addPost(){
    $('#summernote').summernote();

}
function showAllPosts(){

}

function showAllComments(){

}