// Importa a classe Utilitarios.
import Util from "./Util.js";

// Classe que será exportada.
export default class Adicionar {
    // Construtor da classe.
    constructor(seletor) {
        // Seleciona o formulário de onde sairá os dados.
        this.form = document.querySelector(seletor);
        // Seleciona o botão que envia o formulário.
        this.btn = document.querySelector(`${seletor} [type="button"]`);
        // Cria uma instãncia da classe Util.
        this.util = new Util();

        // Define a referência do "this" da função addEvento como sendo a própria classe. (linha 32)
        this.addEvento = this.addEvento.bind(this);
    }

    // Método para fazer a requisição ao servidor e adicionar os dados no banco de dados.
    adicionarDados() {
        // Puxando o token do navegador.
        const token = sessionStorage.getItem("token");

        // Fetch que faz a requisição ao servidor.
        fetch('http://localhost:3001/pesquisa', {
            method: "POST",
            // Coleta os dados do formulário com o método "coletarDados". (Arquivo Utilitarios.js | linha 4)
            // Converte os dados coletados em string para enviar ao servidor.
            body: JSON.stringify(this.util.coletarDados(this.form)),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "x-access-token": token
            }
        });
    }

    // Método que adiciona o evento da requisição.
    addEvento(){
        // Adiciona o evento de click ao botão do formulário.
        this.btn.addEventListener("click", (e) => {
            // Previne o evento padrão.
            e.preventDefault();

            // Testa se os campos do formulários foram preenchido chamando...
            // ... o método "validarCampos". (Arquivo Utilitarios.js | Linha 22)
            if(this.util.validarCampos(this.form)) {
                // Caso os campos estejam preenchidos, executa o método "adicionarDados". (linha 20)
                this.adicionarDados();
                // Recarrega a página para mostrar os formulário.
                window.location.reload();
            }
        });
    }

    // Método para inicar a classe.
    iniciar() {
        // Testa se o formulário e o botão que foram passado existem.
        if (this.form && this.btn) {
            // Caso exista ele chama o método "addEvento". (linha 38)
            this.addEvento();
        }

        // Retorna a própria instância da classe.
        return this;
    }
}
