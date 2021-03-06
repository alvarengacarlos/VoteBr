const process = require("dotenv").config();

const VOTE_LIMIT = Number(process.parsed.VOTE_LIMIT);

const TotalVotesAchieved = require("../Exceptions/Elector/TotalVotesAchieved");
const ElectionResearchNotFound = require("../Exceptions/Admin/ElectionResearch/ElectionResearchNotFound");

const Elector = require("../Classes/Elector/Elector");
const ElectionResearch = require("../Classes/Admin/ElectionResearch");
const AdminRepository = require("../Repository/AdminRepository");
const ElectorRepository = require("../Repository/ElectorRepository");

class ElectorService {
	
	constructor() {
		this.VOTE_LIMIT = VOTE_LIMIT;
		this.adminRepository = new AdminRepository();
		this.electorRepository = new ElectorRepository();	
	}

	async vote(ctx, cpf, numberOfCandidate, secretPhrase) {
		const electionResearchInProgressList = await this.adminRepository.retrieveElectionResearchInProgress(ctx);
		if (electionResearchInProgressList.length == 0) {
			throw new ElectionResearchNotFound();
		}
		
		const electionResearch = ElectionResearch.mountsElectionResearchObjectRetrievedFromTheBlockchain(electionResearchInProgressList[0]);
		
		if (electionResearch.getTotalOfVotes() > this.VOTE_LIMIT) {
			throw new TotalVotesAchieved();
		}

		const candidate = electionResearch.getCandidateByNumber(numberOfCandidate);
		candidate.addOneVote();
		electionResearch.addOneVote();
		electionResearch.updateCandidate(candidate);

		await this.adminRepository.updateElectionResearch(ctx, electionResearch);
		
		const elector = Elector.makeElector(cpf, electionResearch.getId(), candidate, secretPhrase);
			
		await this.electorRepository.registerElector(ctx, elector);
	}	

	async searchElector(ctx, yearElectionResearch, monthElectionResearch, cpf, secretPhrase) {
		const electionResearch = ElectionResearch.makeElectionResearch(yearElectionResearch, monthElectionResearch);
		
		const elector = Elector.makeElector(cpf, electionResearch.getId());
		
		const electorBuffer = await this.electorRepository.retrieveElector(ctx, elector);
		
		const el = Elector.mountsElectorObjectRetrievedFromTheBlockchain(JSON.parse(electorBuffer.toString()));
		el.compareSecretPhraseAndThrowException(secretPhrase);

		return el;
	}

	async searchElectionResearchInProgress(ctx) {
		const electionResearchInProgressList = await this.adminRepository.retrieveElectionResearchInProgress(ctx);

		return electionResearchInProgressList;
	}

	async searchElectionResearchClosed(ctx) {
		const electionResearchClosedList = await this.adminRepository.retrieveElectionResearchClosed(ctx);

		return electionResearchClosedList;
	}

}

module.exports = ElectorService;