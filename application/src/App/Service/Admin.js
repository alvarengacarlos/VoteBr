class Admin {

    async createElectionResearchInBlockchain(payload) {
        const year = String(payload.year);
        const month = String(payload.month);

        //Chamar contrato
    }

    async insertCandidateInTheElectionResearchInBlockchain(payload) {
        const nameOfCandidate = payload.nameOfCandidate;
        const numberOfCandidate = payload.numberOfCandidate;

        //Chamar contrato
    }

    async removeCandidateOfElectionResearchInBlockchain(payload) {
        const numberOfCandidate = payload.numberOfCandidate;

        //Chamar contrato
    }

    async beginCollectingVotesInBlockchain(payload) {
        //Chamar contrato
    }

    async finishElectionResearchInBlockchain(payload) {
        //Chamar contrato
    }

    async searchElectionResearchLikeAdminInBlockchain(payload) {
        const year = payload.year;
        const month = payload.month;
        //Chamar contrato
    }

    async searchElectionResearchWithoutStartingLikeAdminInBlockchain() {
        //Chamar contrato
        return [{name: "Sem iniciar"}];
    }

    async searchElectionResearchInProgressLikeAdminInBlockchain() {
        //Chamar contrato
        return [{name: "em progresso"}];
    }

    async searchElectionResearchClosedLikeAdminInBlockchain() {
        //Chamar contrato
        return [{name: "Fechada"}];
    }
}

module.exports = Admin;