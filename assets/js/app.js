var user;
var blog=``;
var dataBlog = {};
var openDB = IndexedDBService.createDB();
if (localStorage.hasOwnProperty("user")) {
    showUserHome();
    $(".nav-admin").fadeIn();
    $(".nav-perfil").fadeIn();
    $(".nav-logout").fadeIn();
}else{
    $(".nav-login").fadeIn();
    $(".nav-cadastro").fadeIn();
}
    // Inicia o banco
$(document).ready(() => {
    $(".open-cadastro").click(() => {
        $("#modalCadastro").modal("show");
    });
    $(".open-login").click(() => {
        $("#modalLogin").modal("show");
    });

    $("#btnCadastrar").click((e) => {
        e.preventDefault();
        actions().cadastroUser();
    });
    $("#btnLogin").click((e)=>{
        e.preventDefault();
        let user = $("#emailLogin").val();
        let pass =  $("#senhaLogin").val();

        IndexedDBService.checkLogin(user, pass);
    });
    $(".logout").click(()=>{
        delete localStorage.user;
        window.location.href = "index.html";
    });
    showBlog();
   
});

function showBlog(){
    var semImagem = "../img/sem-imagem.jpg";
    openDB.then((e)=>{
        IndexedDBService.blogData().then((data)=>{
            dataBlog = data;
            for(let i in data){
                let val = data[i];
                if(val.imagem == ""){
                    val.imagem = semImagem;
                }
                blog+=`<div class="col-sm-4"><div class="card" style="width: 18rem;">
                <img class="card-img-top img-thumbnail" src="`+val.imagem+`" alt="Card image cap">
                <div class="card-body">
                  <h5 class="card-title">`+ val.titulo +`</h5>
                </div>
                <ul class="list-group list-group-flush">
                 
                </ul>
                <div class="card-body">
                  <a href="#" class="card-link open-post" data-id="`+ val.id +`">Ler Mais</a>
                </div>
              </div></div>`;
            }
            $(".blog-grid").html(blog);

            $(".open-post").click(function(){
                let idPost = $(this).attr("data-id");
                $("#modalBlog").modal("show");
                $(".img-post").attr("src", dataBlog[idPost].imagem);
                $(".post-title").html(dataBlog[idPost].titulo);
                $(".conteudo-blog").html(dataBlog[idPost].texto);
            });
        });
       
    });
   
}
function cadastrar(user){
    insertUser(user);
}
function showUserHome(){
    let user = JSON.parse(localStorage.user);
    $(".user-display-name").text("Olá "+  user.tipo  + ", " +  user.nome); 
}

var actions = () => {

    var cadastroUser = () => {
        let nome = $("#nomeCadastro").val();
        let sobrenome = $("#sobrenomeCadastro").val();
        let email = $("#emailCadastro").val();
        let senha = $("#senhaCadastro").val();
        var tipo = "";
        let userType = db.transaction("user", "readwrite").objectStore("user").getAll();
        userType.onsuccess = (evt) => {
            if (evt.target.result.length == 0) {
                tipo = "Administrador"
            }
            else {
                tipo = "Visitante"
            };

            let user = { nome: nome, sobrenome: sobrenome, email: email, senha: senha, tipo: tipo };
            IndexedDBService.saveUser(user);
        };
    };

    var postar = () => {
        let user = JSON.parse(localStorage.getItem('user')); 
        let  imagem = $('#featuredImgNewPost').attr("src");
        var
            titulo = $('#newTitlePost').val(),
            texto = $('#summernote').summernote('code'),
            situacao = 'v',
            idAutor = user.id, 
            nrCurtida = 0,
            autor = user.nome;
            nrComentario = 0;

            if (!!idAutor) {
                var data = {
                    situacao: situacao,
                    idAutor: idAutor,
                    autor: autor,
                    nrCurtida: nrCurtida,
                    nrComentario: nrComentario,
                    titulo: titulo,
                    imagem: imagem,
                    texto: texto
                };
                
                //window.appData.postagens.push(data);
                
                IndexedDBService.saveDB('blog', data);
            }
           
    };


    var comentarPostagem = (evt) => {
        var idUsuario = localStorage.getItem('userId'),
            idPostagem = $(evt.currentTarget).children('.id-postagem').val(),
            texto = $(evt.currentTarget).children('.text-postagem').val();

        if (!texto.trim()) {
            $('#modalTexto').html('Seu comentário está vazio !');
            $('#modalErro').modal();
        }
        else {
            IndexedDBService.findDB('blog', 'idAutor', idUsuario, (response) => {
                var postagem = response;
                postagem.nrComentario++;
                IndexedDBService.saveDB('blog', postagem);

                var comentario = {
                    idPostagem: idPostagem,
                    idUsuario: idUsuario,
                    texto: texto
                };

                IndexedDBService.saveDB('comentario', comentario);
            });
        }
    };

    var curtirPostagem = () => {
        var idPostagem,
            idUsuario;

        //  Somar na postagm o nrCurtidas
        IndexedDBService.findDB('blog', 'idPostagem', idUsuario, (response) => {
            var postagem = response;
            postagem.nrCurtidas++;
            IndexedDBService.saveDB('postagem', postagem);

            var curtida = {
                idPostagem: idPostagem,
                idUsuario: idUsuario
            };

            IndexedDBService.findDB('postagem', 'idPostagem', idUsuario, (response) => {
                // if() {
                IndexedDBService.saveDB('curtidas', curtida);
                // }
            });
            //  Deletar ou Adicionar curtida
        });


    };

    return {
        postar: postar,
        curtirPostagem: curtirPostagem,
        comentarPostagem: comentarPostagem,
        cadastroUser: cadastroUser
    };
};

function carregaImagem(evt) {
    return new Promise((resolve, reject)=>{
        var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            resolve(fr.result);
        }
        fr.readAsDataURL(files[0]);
    }

    // Not supported
    else {
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }
    });
    
}