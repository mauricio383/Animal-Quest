// Importa o arquivo modal.js
import Modal from "./Modal.js";

// Classe que será exportada
export default class Busca {
    // Construtor da classe.
    constructor (seletorLista, seletorModal) {
        // Seleciona a lista de perguntas.
        this.listaPerguntas = document.querySelector(seletorLista);
        // Guardar o valor do modal.
        this.nomeModal = seletorModal;
        // Instância o modal.
        this.Modal = new Modal(`[data-modalContainer="${seletorModal}"]`, `[data-modal="${seletorModal}"]`).iniciar();
    }

    // Método para buscar os pratos do servidor.
    async buscarDados() {
        // Fetch que buscar os dados no banco de dados.
        const req = await fetch ('http://localhost:3001/pesquisa');
        // Convertando a resposta da requisição ao servidor em json.
        const dados = await req.json();
        // Retornando os dados buscados.
        return dados;
    }

    preencherModal(titulo, dados) {
        const modal = document.querySelector(`[data-modal="${this.nomeModal}"]`);

        if (modal) {
            document.querySelector(".resposta-modal").reset();
            const msg = document.querySelector(".msg-resposta");
            msg.className = "msg-resposta";

            const h1 = modal.querySelector("h1");
            h1.innerText = titulo;

            const p = modal.querySelector("p");
            p.innerText = dados.pergunta;

            const alternativas = modal.querySelectorAll("[data-alternativa]");
            alternativas.forEach((item) => {
                item.innerText = dados[[`alternativa_${item.dataset.alternativa}`]];
            });

            const responder = modal.querySelector("#responder");
            const respostas = modal.querySelectorAll("[name='res']");

            responder.addEventListener("click", (e) => {
                e.preventDefault();
                const textoCorreto = document.querySelector(`[data-alternativa="${dados.correta}"]`).innerText;

                respostas.forEach((item) => {
                    if (item.checked) {
                        msg.className = "msg-resposta";
                        const classe = (item.value === dados.correta) ? "correta" : "errada";
                        msg.classList.add(classe);
                    }
                });

                msg.innerText = `Reposta correta: ${textoCorreto}`;
            });
        }
    }

    // Método para criar os cards com os dados.
    async criarPerguntas() {
        // Chama o método "buscarDados" para buscar os dados. (linha 7)
        const dados = await this.buscarDados();

        // Percorre a lista de dados criando os elementos.
        dados.forEach((item, index) => {
            // Cria li.
            const li = document.createElement("li");

            // Cira span.
            const span = document.createElement("span");
            // Define texto do span.
            const titulo = `Pergunta ${index + 1}`;
            span.innerText = titulo;
            // Adiciona o span ao li.
            li.appendChild(span);

            // Cria img para ícone da setinha.
            const img = document.createElement("img");
            // Define atributo "src" da img.
            img.setAttribute("src", "img/setinha.svg");
            // Define atributo "alt" da img.
            img.setAttribute("alt", "Clique para abrir modal");
            // Adiciona o img ao li.
            li.appendChild(img);

            // Define atributos data ao elemento li.
            li.dataset.btn = this.nomeModal;
            li.dataset.pergunta = item.enunciado;
            li.dataset.alternativa_a = item.a;
            li.dataset.alternativa_b = item.b;
            li.dataset.alternativa_c = item.c;
            li.dataset.alternativa_d = item.d;
            li.dataset.correta = item.correta;

            li.addEventListener("click", () => {
                this.Modal.ativarModal();
                this.preencherModal(titulo, li.dataset);
            });

            this.listaPerguntas.appendChild(li);
        });
    }

    iniciar() {
        if (this.listaPerguntas) {
            this.criarPerguntas();
        }

        return this;
    }
}
