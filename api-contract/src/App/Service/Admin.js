const ConnectionChaincode = require("../../Infra/Chaincode/ConnectionChaincode");
const {buildWallet} = require("../../Infra/Chaincode/AppUtil");
const process = require("dotenv").config();
const CONTRACT_ADMIN_IDENTITY_USERNAME = process.parsed.CONTRACT_ADMIN_IDENTITY_USERNAME;

const GeneralContractException = require("../Exception/Chaincode/GeneralContractException");

class Admin {

    async createElectionResearchInBlockchain(payload) {
        const year = String(payload.yearElection);
        const month = String(payload.monthElection);
       
        const wallet = await buildWallet();

        const connection = new ConnectionChaincode();
        const chaincode = await connection.connect(wallet, CONTRACT_ADMIN_IDENTITY_USERNAME);

        try {
            await chaincode.submitTransaction("createElectionResearch", year, month);
        
        } catch (exception) {
            throw new GeneralContractException(exception);
        }
    }

    async insertCandidateInTheElectionResearchInBlockchain(payload) {
        const nameOfCandidate = String(payload.nameOfCandidate);
        const numberOfCandidate = String(payload.numberOfCandidate);

        //Chamar contrato
    }

    async removeCandidateOfElectionResearchInBlockchain(payload) {
        const numberOfCandidate = String(payload.numberOfCandidate);

        //Chamar contrato
    }

    async beginCollectingVotesInBlockchain() {
        //Chamar contrato
    }

    async finishElectionResearchInBlockchain() {
        //Chamar contrato
    }

    async searchElectionResearchLikeAdminInBlockchain(payload) {
        const year = String(payload.year);
        const month = String(payload.month);
        //Chamar contrato
    }

    async searchElectionResearchWithoutStartingLikeAdminInBlockchain() {
        //Chamar contrato                        
    }

    async searchElectionResearchInProgressLikeAdminInBlockchain() {
        //Chamar contrato        
    }

    async searchElectionResearchClosedLikeAdminInBlockchain() {
        //Chamar contrato       
    }
}

module.exports = Admin;