// Classe que será exportada.
export default class Logout {
    // Construtor da classe.
    constructor(seletor) {
        // Seleciona o formulário de onde sairá os dados.
        this.form = document.querySelector(seletor);
        // Seleciona o botão que envia o formulário.
        this.btn = document.querySelector(`${seletor} button#sim`);

        // Define a referência do "this" da função addEvento como sendo a própria classe. (linha 26)
        this.addEvento = this.addEvento.bind(this);
    }

    // Método para fazer logout.
    async fazerLogout() {
        // Fetch que faz a requisição ao servidor.
        const req = await fetch('http://localhost:3001/logout',{
            method: "POST",
            headers: {"Content-type": "application/json; charset=UTF-8"}
        });

        // Limpa o token da sessionStorage
        sessionStorage.clear();
        // Recarrega a página para mostrar as opções de cadastro e login.
        window.location.reload();
    }

    // Método que adiciona o evento da requisição.
    addEvento() {
        // Adiciona o evento de click ao botão do formulário.
        this.btn.addEventListener("click", (e) => {
            // Previne o evento padrão.
            e.preventDefault();

            this.fazerLogout();
        });
    }

    // Método para inicar a classe.
    iniciar() {
        // Testa se o formulário e o botão que foram passado existem.
        if (this.form && this.btn) {
            // Caso exista ele chama o método "addEvento". (linha 26)
            this.addEvento();
        }

        // Retorna a própria instância da classe.
        return this;
    }
}