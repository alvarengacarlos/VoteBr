@extends("admin.base")

@section("title", "Pesquisas eleitorais em progresso")

@section("content")
<div>
    <h4 class="text-center">Pesquisa eleitoral em progresso</h4>
    @if ($errors->any())            
        @foreach ($errors->all() as $error)
            <div class="alert alert-warning" role="alert">{{ $error }}</div>
        @endforeach        
    @endif 
    @forelse ($electionResearchArray as $electionResearch)    
    <div>
        <h4 class="mt-4">Pesquisa eleitoral: <b>{{ $electionResearch["id"] }}</b></h4>
        <p><b>Criado em:</b> {{ $electionResearch["createIn"] }}</p>
        <p><b>Total de votos recebidos:</b> {{ $electionResearch["totalOfVotes"] }}</p>
        <p><b>Candidatos:</b></p>
        @foreach ($electionResearch["candidatesList"] as $candidate)
            <div class="card mt-2" style="width: 18rem;">
                <img class="card-img-top" src="{{ asset($candidate['photoUrl']) }}" alt="foto do candidato {{ $candidate['name'] }}" width="300px">
                <div class="card-body">
                    <h5 class="card-title"><b>Nome:</b> {{ $candidate["name"] }}</h5>
                    <p class="card-text"><b>Número:</b> {{ $candidate["id"] }}</p>
                    <p class="card-text"><b>Total de votos do candidato:</b> {{ $candidate["totalOfVotes"] }}</p>
                    @if ($candidate['totalOfVotes'] == 0)                    
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                        </div>
                    @else                    
                        <div class="progress">
                            <div class="progress-bar p-1" role="progressbar" style="width: {{ $candidate['totalOfVotes'] * 100 / $electionResearch['totalOfVotes'] }}%;" aria-valuenow="{{ $candidate['totalOfVotes'] * 100 / $electionResearch['totalOfVotes'] }}" aria-valuemin="0" aria-valuemax="100">{{ $candidate['totalOfVotes'] * 100 / $electionResearch['totalOfVotes'] }}%</div>
                        </div>
                    @endif
                </div>
            </div>   
        @endforeach 
    </div> 
    @if ($electionResearch["isStart"])                    
        <form action="{{ route('admin.http-finish-election-research') }}" method="post">
            @csrf        
            <input class="btn btn-danger mt-2" type="submit" value="Finalizar pesquisa eleitoral">
        </form>                     
    @endif       
    @empty
        <div>
            <p>Não há pesquisa eleitoral em progresso</p>
        </div>
    @endforelse    
</div>
@endsection