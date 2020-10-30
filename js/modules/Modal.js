export default class Modal {
    // Constróio o objeto.
    constructor(modalContainer, modal) {
        // Seleciona o container do modal.
        this.modalContainer = document.querySelector(modalContainer);
        // Seleciona o modal.
        this.modal = document.querySelector(modal);

        // Ativa o método bind (linha 42).
        this.bindMetodos();
    }

    // Ativa o modal.
    ativarModal() {
        // Adicionar a classe ativo.
        this.modalContainer.classList.add('ativo');
    }

    // Fecha o modal
    fecharModal() {
        // Remove a classe ativo.
        this.modalContainer.classList.remove('ativo');
    }

    // Adiciona eventos dentro do modal
    addEventosModal() {
        // Seleciona o botão de fechar do modal.
        const btnFechar = this.modal.querySelector(".btn-fechar");

        // Adiciona o evento de click no botão.
        // Evento executa o método fecharModal (linha 20).
        btnFechar.addEventListener("click", this.fecharModal);

        // Adiciona o evento de click no container do modal.
        // Evento executa uma função que precisa do Event (e).
        this.modalContainer.addEventListener("click", (e) => {
            // Seleciona o alvo do evento
            const alvo = e.target;

            // Testa se o alvo do evento, onde foi clicado, é...
            // ... igual ao elemento que recebe o evento, no caso modalContainer.
            if (alvo === e.currentTarget) {
                // Executa o método fecharModal (linha 20).
                this.fecharModal();
            }
        })
    }

    // Faz os métodos sempre refênciarem a classe no (this).
    bindMetodos() {
        // Muda o this da função para a classe
        this.ativarModal = this.ativarModal.bind(this);
        // Muda o this da função para a classe
        this.fecharModal = this.fecharModal.bind(this);
        // Muda o this da função para a classe
        this.addEventosModal = this.addEventosModal.bind(this);
    }

    // Inicia o modal
    iniciar() {
        // Confere se o container e o modal existem
        if(this.modalContainer && this.modal) {
            // Executa o método que adicionar os eventos dentro do modal (linha 26)
            this.addEventosModal();
        }

        // Retorna a própria classe
        return this;
    }
}
