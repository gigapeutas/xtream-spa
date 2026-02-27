const fetch = require('node-fetch');

exports.handler = async (event) => {
    // Pega os dados que o seu site enviou (usuário, senha, etc)
    const { username, password, action } = event.queryStringParameters;
    const serverUrl = "http://playtvstreaming.shop/player_api.php";

    try {
        // Monta a URL final para o seu fornecedor
        const targetUrl = `${serverUrl}?username=${username}&password=${password}${action ? `&action=${action}` : ''}`;
        
        const response = await fetch(targetUrl);
        const data = await response.json();

        // RETORNO OBRIGATÓRIO PARA O NETLIFY
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Libera o acesso para o seu site
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro na conexão com o servidor de TV" })
        };
    }
};
