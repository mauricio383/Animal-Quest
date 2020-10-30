// Importa o arquivo modal.js
import Modal from "./modules/modal.js";

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
