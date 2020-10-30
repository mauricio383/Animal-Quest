// Importa o arquivo modal.js
import Modal from "./modules/modal.js";
// Importa a classe para login.
import Login from "./modules/Login.js";

// Seleciona os botões que ativam o modal...
// ...e retorna uma nodeList com os elementos html.
const btns = document.querySelectorAll("[data-btn]");

// Percorre a nodeList e para cada item executa a função.
btns.forEach((btn) => {
    // Pega o valor do data-btn e passa na variável.
    const modalNome = btn.dataset.btn;
    
    // Instância o objeto Modal e inicia ele.
    const modal = new Modal(`[data-modalContainer="${modalNome}"]`, `[data-modal="${modalNome}"]`).iniciar();
    
    // Adiciona o evento de click no botão.
    // Executa o método ativarModal da classe Modal (Arquivo ./modules/modal.js Linha 14).
    btn.addEventListener("click", modal.ativarModal);
    
    if (modalNome == "sair") {
        btn.addEventListener("click", () => {
            const opcaoNao = document.querySelector(`[data-modal="${modalNome}"] #nao`);
            opcaoNao.addEventListener("click", modal.fecharModal);
        });
    }
});

// Método que inicia o login.
function login() {
    // Instância a classe modal e inicia seus métodos.
    new Modal("login").iniciar();
    // Instância a classe Login e inicia seus métodos.
    new Login("#login").iniciar(); 
}

// Puxa o token da session storage do navegador.
const token = sessionStorage.getItem("token");

// Testa se o token existe.
if (token) {
    // Case exista, adiciona a classe "logado" no body.
    document.body.classList.add("logado");
} else {
    // Caso não exista, remove a classe de logado do body.
    document.body.classList.remove("logado");
    
    // Chama o método "login". (linha 19)
    login();
}