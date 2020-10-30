// Classe que vai se exportada pelo arquivo.
export default class Util {
    // Método para gerar dados para requisições.
    coletarDados(form) {
        // Seleciona os campos de dentro do formulário.
        const campos = form.querySelectorAll("[name]");

        // Objeto inicial que será retornado da função.
        const dados = {};

        // Laço que percorre os campos selecionados.
        campos.forEach((campo) => {
            // Cria um dado dentro do objeto dados.
            dados[campo.getAttribute("name")] = campo.value;
        });

        // Retorno dos dados construídos.
        return dados;
    }

    // Método que válida os campos. ( Só validamos se o campo está vazio )
    validarCampos(form) {
        // Seleciona os campos dentro do formulário.
        const campos = form.querySelectorAll("[name]");
        // Inicia o retorno da função como verdadeiro.
        let isValido = true;

        // Laço que percorre a os campos selecionados.
        campos.forEach((campo)=>{
            // Testa se o valor do campo não foi preenchido.
            if (!campo.value) {
                // Caso não tenha sido preenchido atualiza o valor de retorno para falso.
                isValido = false;
            }
        });

        // Retorno do método.
        return isValido;
    }
}