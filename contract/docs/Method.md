# __Documentação dos Métodos__
Pode-se interagir com o contrato inteligente com dois tipos de identidade: Admin e Elector. Os métodos expostos são os relacionados abaixo:

# Métodos do Admin
## _createElectionResearch(ctx, year, month)_
Este método cria uma nova pesquisa eleitoral. Os dois parâmetros são necessários pois os mesmos identificam uma pesquisa eleitoral.

## _insertCandidateInTheElectionResearch(ctx, name, numberOfCandidate)_
Este método insere um novo candidato a pesquisa eleitoral. Os dois parâmetros são necessários pois os mesmos identificam um candidato.

## _removeCandidateOfElectionResearch(ctx, numberOfCandidate)_
Este método remove um candidato da pesquisa eleitoral. O parâmetro é necessário pois é o identificador do candidato.

## _beginCollectingVotes(ctx)_
Este método inicia a coleta de votos para que os eletores possam votar. Não há necessidade de passar qualquer parâmetro.

## _finishElectionResearch(ctx)_
Este método finaliza uma pesquisa eleitoral não recebendo mais votos dos eleitores. Não há necessidade de passar qualquer parâmetro.

## _searchElectionResearchLikeAdmin(ctx, year, month)_
Este método busca uma pesquisa eleitoral. Os dois parâmetros são necessários pois os mesmos identificam uma pesquisa eleitoral.

# Métodos do Elector
## _vote(ctx, cpf, numberOfCandidate)_
Este método grava um voto para um eleitor. Os dois parâmetros são necessários pois o primeiro identifica o eleitor e o segundo o candidato a quem o eleitor vota.

## _searchElector(ctx, yearElectionResearch, monthElectionResearch, cpf)_
Este método busca o eleitor e as informações gravadas depois do voto. Os três parâmetros são necessários pois os dois primeiros identificam a pesquisa eleitoral e o terceiro o eleitor.

## _searchElectionResearchLikeElector(ctx, year, month)_
Este método busca uma pesquisa eleitoral. Os dois parâmetros são necessários pois os mesmos identificam uma pesquisa eleitoral.