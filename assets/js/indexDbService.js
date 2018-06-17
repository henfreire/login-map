const CONST_DB_APP = "dbSystem";
const CONST_TB_USER = "user";
const CONST_TB_BLOG = "blog";
const CONST_TB_COMENTARIO = "comentario";
const CONST_TB_CURTIDAS = "curtidas";
var db;
var IndexedDBService = IndexedDBService();

function IndexedDBService() {

    var initDBEngine = function () {
        // Na linha abaixo, você deve incluir os prefixos do navegador que você vai testar.
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        // Não use "let indexedDB = ..." se você não está numa function.
        // Posteriormente, você pode precisar de referências de algum objeto window.IDB*:
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
        // (Mozilla nunca usou prefixo nesses objetos, então não precisamos window.mozIDB*)

        if (!window.indexedDB) {
            window.alert("Seu navegador não suporta uma versão estável do IndexedDB. Alguns recursos não estarão disponíveis.");
        }
    }

    var createDatabase = function () {
        return new Promise((resolve, reject) => {
            initDBEngine();
            var request = indexedDB.open(CONST_DB_APP);
            request.onsuccess = function (event) {
                db = request.result;
                resolve(db);
            };
            request.onupgradeneeded = function (event) {
                db = request.result;
                var user = db.createObjectStore(CONST_TB_USER, { keyPath: 'id', autoIncrement: true });
                user.createIndex("email", "email", { unique: true });
                user.createIndex("nome", "nome");
                user.createIndex("sobrenome", "sobrenome");
                user.createIndex("password", "password");
                user.createIndex("tipo", "tipo");

                var blog = db.createObjectStore(
                    CONST_TB_BLOG, { keyPath: 'id', autoIncrement: true });
                blog.createIndex('titulo', 'titulo', { unique: false });
                blog.createIndex('descricao', 'descricao', { unique: false });
                blog.createIndex('imagem', 'imagem', { unique: false });
                blog.createIndex('autor', 'autor', { unique: false });
                blog.createIndex('idAutor', 'idAutor', { unique: false });
                blog.createIndex('data', 'data', { unique: false });
                blog.createIndex('nCurtidas', 'nCurtidas', { unique: false });
                blog.createIndex('nComentarios', 'nComentarios', { unique: false });
                blog.createIndex('situacao', 'situacao', { unique: false });

                var comentario = db.createObjectStore(
                    CONST_TB_COMENTARIO, { keyPath: 'id', autoIncrement: true });
                comentario.createIndex('idUsuario', 'idUsuario', { unique: false });
                comentario.createIndex('idPost', 'idPost', { unique: false });
                comentario.createIndex('texto', 'texto', { unique: false });

                var curtidas = db.createObjectStore(
                    CONST_TB_CURTIDAS, { keyPath: 'id', autoIncrement: true });
                curtidas.createIndex('idUsuario', 'idUsuario', { unique: false });
                curtidas.createIndex('idPost', 'idPost', { unique: false });
            };

            return request;
        });

    };

    var getIndexedDBObj = function (tableName, mode = 'readwrite') {
        var tx = db.transaction(tableName, mode);
        return tx.objectStore(tableName);
    };

    var blogData = function () {
        return new Promise((resolve, reject) => {
            let store = getIndexedDBObj('blog', 'readonly');
            let req = store.openCursor();
            let data = {};
            req.onsuccess = function (event) {
                let cursor = event.target.result;

                if (cursor) {
                    let value = cursor.value;
                    data[value.id] = value;
                    cursor.continue();
                }else{
                    resolve(data);
                }
                
            };
        });

    }
    var saveUser = function (data) {
        var request = indexedDB.open(CONST_DB_APP);

        return request.onsuccess = function (event) {
            db = event.target.result;
            var store = getIndexedDBObj("user");
            var result = store.add(data);
            return result;
        };
    }

    var saveData = function (tableName, data) {
        var request = indexedDB.open(CONST_DB_APP);

        return request.onsuccess = function (event) {
            window.db = event.target.result;

            var store = getIndexedDBObj(tableName);
            var result = store.add(data);

            return result;
        };
    };

    var findData = function (tableName, columnName, filterData, onSuccessFunc) {
        var request = indexedDB.open(CONST_DB_APP);

        return request.onsuccess = function (event) {
            window.db = event.target.result;

            var store = getIndexedDBObj(tableName);
            var index = store.index(columnName);
            var result = index.get(filterData);

            result.onsuccess = onSuccessFunc;
        };
    };

    var closeDBConnection = function () {
        db.close();
    };

    var checkLogin = function (user, pass) {
        let store = getIndexedDBObj(CONST_TB_USER, 'readonly');
        let req = store.openCursor();
        req.onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                req = store.get(cursor.key);
                req.onsuccess = function (event) {
                    let value = event.target.result;
                    if (value.hasOwnProperty("email")) {
                        if (value.email == user && value.senha == pass) {
                            user = {
                                id: value.id,
                                nome: value.nome,
                                tipo: value.tipo,
                            }
                            localStorage.user = JSON.stringify(user);
                            window.location.href = "admin.html";
                        } else {
                            cursor.continue();
                        }
                    } else {
                        cursor.continue();
                    }

                }

            } else {
                $(".mensagem-erro").text("Usuário ou senha inválidos");
                $("#modalErro").modal("show");

                console.log("Login erro");
            }
        };
        req.onerror = function (event) {
            console.log(event.target.errorCode);
        };

    }


    return {
        createDB: createDatabase,
        findDB: findData,
        saveDB: saveData,
        closeDB: closeDBConnection,
        getObj: getIndexedDBObj,
        checkLogin: checkLogin,
        saveUser: saveUser,
        blogData: blogData
    };
}