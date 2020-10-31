// Importa o arquivo modal.js
import Modal from "./modules/Modal.js";
// Importa a classe para login.
import Login from "./modules/Login.js";
// Importa a classe para fazer logout.
import Logout from "./modules/Logout.js";
// Importa a classe para fazer cadastro de usuarios.
import Cadastro from "./modules/Cadastro.js";
// Importa a classe para fazer a busca das perguntas.
import Buscar from "./modules/Buscar.js";
// Importa a classe para fazer a Adição das perguntas.
import Adicionar from "./modules/Adicionar.js";

// Instância a classe Buscar e inicia seus métodos.
new Buscar(".perguntas ul", "pergunta").iniciar();

// Puxa o token da session storage do navegador.
const token = sessionStorage.getItem("token");

// Testa se o token existe.
if (token) {
    // Case exista, adiciona a classe "logado" no body.
    document.body.classList.add("logado");

    // Instância a classe Logout e inicia seus métodos.
    new Logout(".opcoes").iniciar();
    // Instância a classe Adicionar e inicia seus métodos.
    new Adicionar(".adicionar-pergunta").iniciar();
} else {
    // Caso não exista, remove a classe de logado do body.
    document.body.classList.remove("logado");
    
    // Instância a classe Login e inicia seus métodos.
    new Login("#login").iniciar();
    // Instância a classe Cadastro e inicia seus métodos.
    new Cadastro("#cadastro").iniciar();
}

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
