
const api = axios.create({
    baseURL: 'https://rickandmortyapi.com/api'
});

const espacoCardsRow = document.getElementById('espaco-cards')
const botaoPrev = document.getElementById('botao-prev')
const botaoAtual = document.getElementById('botao-atual')
const botaoNext = document.getElementById('botao-next')
const qtdPersonagensSpan = document.getElementById('qtd-personagens')
const qtdEpisodiosSpan = document.getElementById('qtd-episodios')
const qtdLocalizacoesSpan = document.getElementById('qtd-localizacoes')

let paginaAtual = 1
let totalPaginas = 0

document.addEventListener('DOMContentLoaded', async () => {
    const dadosRetornados = await buscarPersonagens(paginaAtual);
    const episodios = await buscarNumeroEpisodios();
    const localizacoes = await buscarLocalizacoes()

    qtdPersonagensSpan.innerText = dadosRetornados.totalPersonagens
    qtdEpisodiosSpan.innerText = episodios.data.info.count;
    qtdLocalizacoesSpan.innerText = localizacoes.data.info.count;

    montarColunasCards(dadosRetornados.personagens)
    mudarBotoes(dadosRetornados.paginaAnterior, dadosRetornados.proximaPagina)
    
});

botaoNext.addEventListener('click', proximaPagina)
botaoPrev.addEventListener('click', paginaAnterior)


function montarColunasCards(listaPersonagens) {
    espacoCardsRow.innerHTML = ""

    listaPersonagens.forEach(async(personagem) => {
       
        const divCol = document.createElement('div')
        divCol.setAttribute('class', 'col-12 col-md-6 col-lg-4 espaco-card')
        divCol.onclick = () => detalhesPersonagem(personagem.id);

        const divCard = document.createElement('div')
        divCard.setAttribute('class', 'card w-100 rounded-4 shadow')

        const imgCard = document.createElement('img')
        imgCard.setAttribute('src', `${personagem.image}`)
        imgCard.setAttribute('class', 'card-img-top rounded-top-4')
        imgCard.setAttribute('alt', `${personagem.name}`)

        const divCardBody = document.createElement('div')
        divCardBody.setAttribute('class', 'card-body px-4')

        const tituloCard = document.createElement('h5')
        tituloCard.setAttribute('class', 'card-title')
        tituloCard.innerText = personagem.name
        tituloCard.classList.add("character-name");

        const descricaoPersonagem = document.createElement('p')
        descricaoPersonagem.setAttribute('class', 'card-text')
 
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

        divCardBody.appendChild(tituloCard)
        divCardBody.appendChild(descricaoPersonagem)
        divCardBody.appendChild(detalhamentoPersonagem)

        divCard.appendChild(imgCard)
        divCard.appendChild(divCardBody)

        divCol.appendChild(divCard)

        espacoCardsRow.appendChild(divCol)

    })
}

function mudarBotoes(prev, next) {
    botaoAtual.children[0].innerText = paginaAtual

    if (!prev) {
        botaoPrev.classList.remove('cursor-pointer')
        botaoPrev.classList.add('disabled')
    } else {
        botaoPrev.classList.add('cursor-pointer')
        botaoPrev.classList.remove('disabled')
    }

    if (!next) {
        botaoNext.classList.remove('cursor-pointer')
        botaoNext.classList.add('disabled')
    } else {
        botaoNext.classList.add('cursor-pointer')
        botaoNext.classList.remove('disabled')
    }
}

async function buscarNumeroEpisodios() {
    try {
        const resposta = await api.get('/episode');
        const dadosEpisodios = resposta;
        
        return dadosEpisodios;

    } catch {
        alert("Deu algo errado na busca dos dados dos episódios.")
    }
}

async function buscarLocalizacoes() {
    try {
        const resposta = await api.get('/location');

        const dadosLocalizacao = resposta;
        
        return dadosLocalizacao

    } catch {
        alert("Deu algo errado na busca do número dos dados de localização.")
    }
}


async function buscarPersonagens(pagina) {
    try {
        const resposta = await api.get('/character', {
            params: {
                page: pagina,
            }
        });

        const dadosApi = {
            totalPaginas: resposta.data.info.pages,
            totalPersonagens: resposta.data.info.count,
            personagens: resposta.data.results,
            proximaPagina: resposta.data.info.next,
            paginaAnterior: resposta.data.info.prev
        }
       
        return dadosApi
       

    } catch (erro) {
        alert('Erro na busca de personagens.')
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
        alert("Deu algo errado na busca do episódio")
    }
}

function detalhesPersonagem(personagemId) {
    console.log(personagemId)
    localStorage.setItem('personagemId', personagemId)
    document.location.href = './personagens.html'
}

async function proximaPagina() {
    
    if (!botaoNext.classList.contains('disabled')) {
        
        ++paginaAtual

        const dadosAPI = await buscarPersonagens(paginaAtual)


        montarColunasCards(dadosAPI.personagens)
        mudarBotoes(dadosAPI.paginaAnterior, dadosAPI.proximaPagina)
    }
}

async function paginaAnterior() {
    
    if (!botaoPrev.classList.contains('disabled')) {
       
        --paginaAtual

        const dadosAPI = await buscarPersonagens(paginaAtual)


        montarColunasCards(dadosAPI.personagens)
        mudarBotoes(dadosAPI.paginaAnterior, dadosAPI.proximaPagina)
    }
}

