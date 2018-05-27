///------------------------------------------
//  Este arquivo representa uma abstração do banco de dados para uma aplicação de exemplo
//  OBS: parte do código e ideias da estrutura foram extraídos dos sites 
//       https://www.w3.org/TR/IndexedDB
//       https://developer.mozilla.org/pt-BR/docs/IndexedDB/Usando_IndexedDB
//
//  Autor: Rommel Vieira Carneiro
///------------------------------------------

// variáveis que armazenam a conexão ao banco de dados
var db_app;
// Constantes para nomes do banco de dados e ObjectStores
const CONST_DB_APP = "dbSystem";
const CONST_TB_USER = "tb_user";

function initDBEngine() {
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

function getObjectStore(store_name, mode) {
    let tx = db_app.transaction(store_name, mode);
    return tx.objectStore(store_name);
}

function displayMessage(msg) {
    $('#msg').html('<div class="alert alert-warning">' + msg + '</div>');
}

function openDB() {
    return new Promise((resolve, reject) => {
        request = indexedDB.open(CONST_DB_APP);

        request.onerror = function (event) {
            alert("Você não habilitou minha web app para usar IndexedDB?!");
            reject(event);
        };
        request.onsuccess = function (event) {
            resolve(db_app = request.result);
        };
        request.onupgradeneeded = function (events) {
            let store = event.currentTarget.result.createObjectStore(
                CONST_TB_USER, { keyPath: 'id', autoIncrement: true });

            store.createIndex('nome', 'nome', { unique: true });
            store.createIndex('senha', 'senha', { unique: false });
            store.createIndex('tipo', 'tipo', { unique: true });

        };
    });
}

function insert(colection, dados) {
    let store = getObjectStore(colection, 'readwrite');
    let req;
    req = store.add(dados);
    req.onsuccess = function (evt) {
        console.log("Inserido");
    };
    req.onerror = function () {
        console.error("Erro", this.error);
    };
}
function insertUser(dados) {
    let store = getObjectStore(CONST_TB_USER, 'readwrite');
    let dadosSalvos = store.openCursor();
    dadosSalvos.onsuccess = function (evt) {
        let cursor = event.target.result;
        if (cursor) {
            dados.tipo = "visitante";
        } else {
            dados.tipo = "admin";
        }
        req = store.add(dados);
        req.onsuccess = function (evt) {
            console.log("Inserido");
        };
        req.onerror = function () {
            console.error("Erro", this.error);
        };
    }
}

function checkLogin(user, pass) {
        let store = getObjectStore(CONST_TB_USER, 'readonly');
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
                                nome: value.nome,
                                tipo: value.tipo
                            }
                            localStorage.user = JSON.stringify(user);
                            window.location.href = "admin.html";
                        }
                    } else {
                        cursor.continue();
                    }
                }
            } else {
                console.log("Login erro");
            }
        };
        req.onerror = function (event) {
            console.log(event.target.errorCode);
        };

}

function getAllUsers(callback) {
    let store = getObjectStore(CONST_TB_USER, 'readonly');
    let req = store.openCursor();
    req.onsuccess = function (event) {
        let cursor = event.target.result;

        if (cursor) {
            req = store.get(cursor.key);
            req.onsuccess = function (event) {
                let value = event.target.result;
                callback(value);
            }
            cursor.continue();
        }
    };
    req.onerror = function (event) {
        displayMessage("Erro ao obter contatos:", event.target.errorCode);
    };
}
function getAllContatos(callback) {
    let store = getObjectStore(CONST_OS_CONTATO, 'readonly');
    let req = store.openCursor();
    req.onsuccess = function (event) {
        let cursor = event.target.result;

        if (cursor) {
            req = store.get(cursor.key);
            req.onsuccess = function (event) {
                let value = event.target.result;
                callback(value);
            }
            cursor.continue();
        }
    };
    req.onerror = function (event) {
        displayMessage("Erro ao obter contatos:", event.target.errorCode);
    };
}

function getContato(id, callback) {
    let store = getObjectStore(CONST_OS_CONTATO, 'readwrite');
    if (typeof id == "string") { id = parseInt(id); }
    let req = store.get(id);
    req.onsuccess = function (event) {
        let record = req.result;
        callback(record);
    };
    req.onerror = function (event) {
        displayMessage("Contato não encontrado:", event.target.errorCode);
    };
}

function deleteContato(id) {
    let store = getObjectStore(CONST_OS_CONTATO, 'readwrite');
    if (typeof id == "string") { id = parseInt(id); }
    let req = store.delete(id);
    req.onsuccess = function (event) {
        displayMessage("Contato removido com sucesso");
    };
    req.onerror = function (event) {
        displayMessage("Contato não encontrado ou erro ao remover:", event.target.errorCode);
    };
}

function updateContato(id, contato) {
    let store = getObjectStore(CONST_OS_CONTATO, 'readwrite');
    if (typeof id == "string") { id = parseInt(id); }
    let req = store.get(id);
    req.onsuccess = function (event) {
        let record = req.result;
        record.nome = (contato.nome != "") ? contato.nome : record.nome;
        record.telefone = (contato.telefone != "") ? contato.telefone : record.telefone;
        record.email = (contato.email != "") ? contato.email : record.email;

        let reqUpdate = store.put(record);
        reqUpdate.onsuccess = function () {
            displayMessage("Contato alterado com sucesso");
        }
        reqUpdate.onerror = function (event) {
            displayMessage("Erro ao alterar contato:", event.target.errorCode);
        };
    };
    req.onerror = function (event) {
        displayMessage("Contato não encontrado ou erro ao alterar:", event.target.errorCode);
    };
}



