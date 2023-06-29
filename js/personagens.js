const api = axios.create({
    baseURL: 'https://rickandmortyapi.com/api'
});

const espacoCardsRow = document.getElementById('espaco-cards')
const qtdPersonagensSpan = document.getElementById('qtd-personagens')
const qtdEpisodiosSpan = document.getElementById('qtd-episodios')
const qtdLocalizacoesSpan = document.getElementById('qtd-localizacoes')

document.addEventListener('DOMContentLoaded', async () => {

    const personagemId = localStorage.getItem('personagemId');

    const dadosRetornados = await buscarPersonagens(personagemId);
    const numeroPersonagens = await buscarNumeroPersonagens();
    const episodios = await buscarNumeroEpisodios();
    const localizacoes = await buscarLocalizacoes()

    console.log(dadosRetornados);

    qtdPersonagensSpan.innerText = numeroPersonagens.data.info.count;
    qtdEpisodiosSpan.innerText = episodios.data.info.count;
    qtdLocalizacoesSpan.innerText = localizacoes.data.info.count;
   
    montarColunasCards(dadosRetornados);

});

async function montarColunasCards(personagem) {
    espacoCardsRow.innerHTML = ""
       
        const divCol = document.createElement('div');
        divCol.setAttribute('class', 'col-12 col-md-6 col-lg-4 espaco-card');

        const divCard = document.createElement('div');
        divCard.setAttribute('class', 'card w-100 rounded-4 shadow');

        const imgCard = document.createElement('img');
        imgCard.setAttribute('src', `${personagem.image}`);
        imgCard.setAttribute('class', 'card-img-top rounded-top-4');
        imgCard.setAttribute('alt', `${personagem.name}`);

        const divCardBody = document.createElement('div');
        divCardBody.setAttribute('class', 'card-body px-4');

        const tituloCard = document.createElement('h5');
        tituloCard.setAttribute('class', 'card-title');
        tituloCard.innerText = personagem.name;
        tituloCard.classList.add("character-name");

        const descricaoPersonagem = document.createElement('p');
        descricaoPersonagem.setAttribute('class', 'card-text');
 
        switch (personagem.status) {
            case 'Alive':
                descricaoPersonagem.innerHTML = `
                    <span class="text-success">
                        <i class="bi bi-caret-right-fill"></i>
                    </span>
                    Vivo - ${personagem.species}
                `
                break;
 
            case 'Dead':
                descricaoPersonagem.innerHTML = `
                    <span class="text-danger">
                        <i class="bi bi-caret-right-fill"></i>
                    </span>
                    Morto - ${personagem.species}
                `
                break;
 
            default:
                descricaoPersonagem.innerHTML = `
                    <span class="text-secondary">
                        <i class="bi bi-caret-right-fill"></i>
                    </span>
                    Desconhecido - ${personagem.species}
                `
        }
 
        const dadosEpisodio = await buscarDadosEpisodio(personagem.episode[personagem.episode.length - 1])
 
        const detalhamentoPersonagem = document.createElement('dl');
        detalhamentoPersonagem.innerHTML = `
            <dt>Última localização conhecida:</dt>
            <dd>${personagem.location.name}</dd>
 
            <dt>Visto a última vez em:</dt>
            <dd>${dadosEpisodio.nomeEpisodio}</dd>
 
            <dt>Foi ao ar em:</dt>
            <dd>${dadosEpisodio.dataLancamento}</dd>
        `

        divCardBody.appendChild(tituloCard);
        divCardBody.appendChild(descricaoPersonagem);
        divCardBody.appendChild(detalhamentoPersonagem);

        divCard.appendChild(imgCard);
        divCard.appendChild(divCardBody);

        divCol.appendChild(divCard);

        espacoCardsRow.appendChild(divCol);

}

async function buscarPersonagens(personagemId) {
    try {
        const resposta = await api.get(`/character/${personagemId}`);
        console.log(resposta);

        const dadosApi = resposta.data;
        
        return dadosApi
       

    } catch (erro) {
        console.log(erro) 
        alert('Erro na busca de personagens.')
    }
}

async function buscarNumeroEpisodios() {
    try {
        const resposta = await api.get('/episode');
        const dadosEpisodios = resposta;
        
        return dadosEpisodios;

    } catch (erro) {
        console.log(erro) 
        alert("Deu algo errado na busca de dados dos episódios.")
    }
}

async function buscarLocalizacoes() {
    try {
        const resposta = await api.get('/location');

        const dadosLocalizacao = resposta;
        
        return dadosLocalizacao

    } catch(erro) {
        console.log(erro)
        alert("Deu algo errado na busca dos dados de localização.")
    }
}

async function buscarNumeroPersonagens() {
    try {
        const resposta = await api.get('/character');

        const InfoPersonagens = resposta;
       
        return InfoPersonagens;
       

    } catch (erro) {
        console.log(erro) 
        alert('"Deu algo errado na busca dos dados dos personagens."')
    }
}

async function buscarDadosEpisodio(url) {
    try {
        const resposta = await axios.get(url)

        return {
            id: resposta.data.id,
            nomeEpisodio: resposta.data.name,
            dataLancamento: resposta.data.air_date
        }
    } catch {
        alert("Deu algo errado na busca do episódio.")
    }
}



