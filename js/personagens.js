const api = axios.create({
    baseURL: 'https://rickandmortyapi.com/api'
});

// CAPTURAR OS ELEMENTOS DA DOM QUE SERÃO MODIFICADOS PELO JS
const espacoCardsRow = document.getElementById('espaco-cards')
const qtdPersonagensSpan = document.getElementById('qtd-personagens')

// 1 BUSCA DEVE OCORRER QUANDO A PAGINA CARREGA
document.addEventListener('DOMContentLoaded', async () => {

    const personagemId = localStorage.getItem('personagemId');

    const dadosRetornados = await buscarPersonagens(personagemId);

    console.log(dadosRetornados);

    qtdPersonagensSpan.innerText = dadosRetornados.totalPersonagens
   
    montarColunasCards(dadosRetornados)

});

function montarColunasCards(personagem) {
    espacoCardsRow.innerHTML = ""
        /*
            <div class="col-12 col-md-6 col-lg-4">
                    <div class="card w-100">
                        <img src="https://rickandmortyapi.com/api/character/avatar/1.jpeg" class="card-img-top"
                            alt="Avatar">
                        <div class="card-body px-4">
                            <h5 class="card-title">
                                Nome Personagem
                            </h5>

                            <p class="card-text">
                                <span class="text-danger">
                                    <i class="bi bi-caret-right-fill"></i>
                                </span>
                                Vivo - Humano
                            </p>

                            <dl>
                                <dt>Última localização conhecida:</dt>
                                <dd>Planeta XPTO</dd>

                                <dt>Visto a última vez em:</dt>
                                <dd>Nome do Capitulo</dd>
                            </dl>

                        </div>
                    </div>
                </div>
        */

        // CRIA COLUNA
        const divCol = document.createElement('div')
        divCol.setAttribute('class', 'col-12 col-md-6 col-lg-4 espaco-card')

        // CRIA CARD
        const divCard = document.createElement('div')
        divCard.setAttribute('class', 'card w-100 rounded-4 shadow')

        // CRIA IMAGEM
        const imgCard = document.createElement('img')
        imgCard.setAttribute('src', `${personagem.image}`)
        imgCard.setAttribute('class', 'card-img-top rounded-top-4')
        imgCard.setAttribute('alt', `${personagem.name}`)

        // CRIA CARD BODY
        const divCardBody = document.createElement('div')
        divCardBody.setAttribute('class', 'card-body px-4')

        // CRIA TITULO CARD
        const tituloCard = document.createElement('h5')
        tituloCard.setAttribute('class', 'card-title')
        tituloCard.innerText = personagem.name

        // CRIA PARAGRAFO
        /*const descricaoPersonagem = document.createElement('p')
        descricaoPersonagem.setAttribute('class', 'card-text')
        descricaoPersonagem.innerHTML = `
            <span class="${personagem.status === 'Alive' ? 'text-success' : personagem.status === 'Dead' ? 'text-danger' : 'text-secondary'}">
                <i class="bi bi-caret-right-fill"></i>
            </span>
            Vivo - Humano
        `

        // CRIA DL
        const detalhamentoPersonagem = document.createElement('dl');
        detalhamentoPersonagem.innerHTML = `
            <dt>Última localização conhecida:</dt>
            <dd>Planeta XPTO</dd>

            <dt>Visto a última vez em:</dt>
            <dd>Nome do Capitulo</dd>
        `*/

         // CRIA PARAGRAFO
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
 
 
         // CRIA DL
         const dadosEpisodio = buscarDadosEpisodio(personagem.episode[personagem.episode.length - 1])
 
         const detalhamentoPersonagem = document.createElement('dl');
         detalhamentoPersonagem.innerHTML = `
             <dt>Última localização conhecida:</dt>
             <dd>${personagem.location.name}</dd>
 
             <dt>Visto a última vez em:</dt>
             <dd>${dadosEpisodio.nomeEpisodio}</dd>
 
             <dt>Foi ao ar em:</dt>
             <dd>${dadosEpisodio.dataLancamento}</dd>
         `

        // APPENDS - criar os filhos dentros dos respectivos elementos pais
        divCardBody.appendChild(tituloCard)
        divCardBody.appendChild(descricaoPersonagem)
        divCardBody.appendChild(detalhamentoPersonagem)

        divCard.appendChild(imgCard)
        divCard.appendChild(divCardBody)

        divCol.appendChild(divCard)

        espacoCardsRow.appendChild(divCol)

}

async function buscarPersonagens(personagemId) {
    try {
        const resposta = await api.get(`/character/${personagemId}`);
        console.log(resposta);

        const dadosApi = resposta.data;
        
        return dadosApi
       

    } catch (erro) {
        console.log(erro) // debug (erros de requisicao e erros de sintaxe - 400, 401, 500 ...
        alert('Erro na busca de personagens.')
        // aqui é momento de mostrar uma mensagem se der erro na requisicao
    }
}

async function buscarDadosEpisodio(url) {
    try {
        const resposta = await axios.get(url)

        // resposta.data
        return {
            id: resposta.data.id,
            nomeEpisodio: resposta.data.name,
            dataLancamento: resposta.data.air_date
        }
    } catch {
        alert("Deu algo errado na busca do episódio")
    }
}



