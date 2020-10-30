// Importa a classe Utilitarios.
import Util from "./Util.js"; 

// Classe que será exportada.
export default class Login {
    // Construtor da classe.
    constructor(seletor) {
        // Seleciona o formulário de onde sairá os dados.
        this.form = document.querySelector(seletor);
        // Seleciona o botão que envia o formulário.
        this.btn = document.querySelector(`${seletor} button`);
        // Cria uma instãncia da classe Util.
        this.util = new Util();

        // Define a referência do "this" da função addEvento como sendo a própria classe. (linha 35)
        this.addEvento = this.addEvento.bind(this);
    }

    // Método para fazer a requisição ao servidor e busca o token.
    async cadastrarUsuario() {
        // Fetch que faz a requisição ao servidor.
        const req = await fetch('http://localhost:3001/cadastro',{
            method: "POST",
            // Coleta os dados do formulário com o método "coletarDados". (Arquivo Utilitarios.js | linha 4)
            // Converte os dados coletados em string para enviar ao servidor.
            body: JSON.stringify(this.util.coletarDados(this.form)),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        });

        // Recarrega a página para mostrar os formulário.
        window.location.reload();
    }

    // Método que adiciona o evento da requisição.
    addEvento() {
        // Adiciona o evento de click ao botão do formulário.
        this.btn.addEventListener("click", (e) => {
            // Previne o evento padrão.
            e.preventDefault();

            // Testa se os campos do formulários foram preenchido chamando...
            // ... o método "validarCampos". (Arquivo Utilitarios.js | Linha 22)
            if(this.util.validarCampos(this.form)){
                // Caso os campos estejam preenchidos, executa o método "cadastrarUsuario". (linha 20)
                this.cadastrarUsuario();
            }

        });
    }

    // Método para inicar a classe.
    iniciar() {
        // Testa se o formulário e o botão que foram passado existem.
        if (this.form && this.btn) {
            // Caso exista ele chama o método "addEvento". (linha 35)
            this.addEvento();
        }

        // Retorna a própria instância da classe.
        return this;
    }
}