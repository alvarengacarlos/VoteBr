const {describe, beforeEach, it} = require("mocha");
const chai = require("chai");
const sinon = require("sinon");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;
chai.should();

const { Context } = require("fabric-contract-api");
const { ChaincodeStub } = require("fabric-shim");

const ElectionResearchWithoutStartingExist = require("../../../lib/Exceptions/Admin/ElectionResearch/ElectionResearchWithoutStartingExist");
const ElectionResearchInProgress = require("../../../lib/Exceptions/Admin/ElectionResearch/ElectionResearchInProgress");
const ElectionResearchNotFound = require("../../../lib/Exceptions/Admin/ElectionResearch/ElectionResearchNotFound");

const ElectionResearch = require("../../../lib/Classes/Admin/ElectionResearch");
const Candidate = require("../../../lib/Classes/Admin/Candidate");

const AdminService = require("../../../lib/Services/AdminService");
const AdminRepository = require("../../../lib/Repository/AdminRepository");


describe("AdminService", () => {
    
	let transactionContext, chaincodeStub;
	let adminRepository;
	
	beforeEach(() => {
		transactionContext = new Context();
        
		chaincodeStub = sinon.createStubInstance(ChaincodeStub);
		transactionContext.setChaincodeStub(chaincodeStub);

		chaincodeStub.putState.callsFake((key, value) => {
			if (!chaincodeStub.states) {
				chaincodeStub.states = {};
			}
			chaincodeStub.states[key] = value;
		});

		chaincodeStub.getState.callsFake(async (key) => {
			let ret;
			if (chaincodeStub.states) {
				ret = chaincodeStub.states[key];
			}
			return Promise.resolve(ret);
		});

		adminRepository = sinon.createStubInstance(AdminRepository);

	});

	describe("#createElectionResearch", () => {

		it("Must throw exception to ElectionResearchWithoutStartingExist", async () => {			
			const electionResearch = ElectionResearch.makeElectionResearch("2000", "01");

			adminRepository.retrieveElectionResearchWithoutStarting.withArgs(transactionContext).callsFake(() => [electionResearch]);
			
			const adminService = new AdminService();
			adminService.adminRepository = adminRepository;

			await adminService.createElectionResearch(transactionContext, "2000", "01").should.be.rejectedWith(ElectionResearchWithoutStartingExist);
		});

		it("Must throw exception to ElectionResearchInProgress", async () => {			
			const electionResearch = ElectionResearch.makeElectionResearch("2000", "01");
			electionResearch.insertCandidate(Candidate.makeCandidate("Fulano", "01"));
			electionResearch.beginCollectingVotes();			
			
			adminRepository.retrieveElectionResearchWithoutStarting.withArgs(transactionContext).callsFake(() => []);
			adminRepository.retrieveElectionResearchInProgress.withArgs(transactionContext).callsFake(() => [electionResearch]);

			const adminService = new AdminService();
			adminService.adminRepository = adminRepository;

			await adminService.createElectionResearch(transactionContext, "2000", "01").should.be.rejectedWith(ElectionResearchInProgress);
		});
		
		it("Must successfully execute the createElectionResearch method", async () => {
			adminRepository.retrieveElectionResearchWithoutStarting.withArgs(transactionContext).callsFake(() => []);			
			adminRepository.retrieveElectionResearchInProgress.withArgs(transactionContext).callsFake(() => []);

			const electionResearch = ElectionResearch.makeElectionResearch("2000", "01");
			adminRepository.createElectionResearch.callsFake(async () => await chaincodeStub.putState(electionResearch.getId(), electionResearch.serializerInBuffer()));
			
			const adminService = new AdminService();
			adminService.adminRepository = adminRepository;
			
			await adminService.createElectionResearch(transactionContext, "2000", "01");

			const electionResearchBuffer = await chaincodeStub.getState("2000-01");			
			const electionResearchObject = JSON.parse(electionResearchBuffer.toString());

			expect(electionResearchObject).to.eql(electionResearch);
		});		
	});

	describe("#insertCandidateInTheElectionResearch", () => {
		
		it("Must throw exception to ElectionResearchNotFound", async () => {
			const electionResearch = ElectionResearch.makeElectionResearch("2000", "01");
			electionResearch.insertCandidate(Candidate.makeCandidate("Fulano", "01"));
			electionResearch.beginCollectingVotes();			
			
			adminRepository.retrieveElectionResearchWithoutStarting.withArgs(transactionContext).callsFake(() => []);

			const adminService = new AdminService();
			adminService.adminRepository = adminRepository;

			await adminService.insertCandidateInTheElectionResearch(transactionContext, "Fulano", "01").should.be.rejectedWith(ElectionResearchNotFound);
		});

		it("Must successfully execute the insertCandidateInTheElectionResearch method", async () => {
			
			const electionResearch = ElectionResearch.makeElectionResearch("2000", "01");			

			adminRepository.retrieveElectionResearchInProgress.withArgs(transactionContext).callsFake(() => []);			
			adminRepository.retrieveElectionResearchWithoutStarting.withArgs(transactionContext).callsFake(() => [electionResearch]);
			
			adminRepository.updateElectionResearch.callsFake(async () => {				
				await chaincodeStub.putState(electionResearch.getId(), electionResearch.serializerInBuffer());
			});
			
			const adminService = new AdminService();
			adminService.adminRepository = adminRepository;

			await adminService.insertCandidateInTheElectionResearch(transactionContext, "Fulano", "01");
			
			const electionResearchBuffer = await chaincodeStub.getState(electionResearch.getId());
			const electionResearchObject = JSON.parse(electionResearchBuffer.toString());
			
			expect(electionResearchObject.candidatesList.length).to.eql(1);
		});
	});

	describe("#removeCandidateOfElectionResearch", () => {

		it("Must throw exception to ElectionResearchNotFound", async () => {
			const electionResearch = ElectionResearch.makeElectionResearch("2000", "01");
			electionResearch.insertCandidate(Candidate.makeCandidate("Fulano", "01"));
			electionResearch.beginCollectingVotes();			
			
			adminRepository.retrieveElectionResearchWithoutStarting.withArgs(transactionContext).callsFake(() => []);

			const adminService = new AdminService();
			adminService.adminRepository = adminRepository;

			await adminService.removeCandidateOfElectionResearch(transactionContext, "01").should.be.rejectedWith(ElectionResearchNotFound);
		});

		it("Must successfully execute the removeCandidateOfElectionResearch method", async () => {
			
			const electionResearch = ElectionResearch.makeElectionResearch("2000", "01");			
			const candidate = Candidate.makeCandidate("Fulano", "01");
			electionResearch.insertCandidate(candidate);

			adminRepository.retrieveElectionResearchInProgress.withArgs(transactionContext).callsFake(() => []);			
			adminRepository.retrieveElectionResearchWithoutStarting.withArgs(transactionContext).callsFake(() => [electionResearch]);
			
			adminRepository.updateElectionResearch.callsFake(async () => {				
				await chaincodeStub.putState(electionResearch.getId(), electionResearch.serializerInBuffer());
			});
			
			const adminService = new AdminService();
			adminService.adminRepository = adminRepository;

			await adminService.removeCandidateOfElectionResearch(transactionContext, "01");
			
			const electionResearchBuffer = await chaincodeStub.getState(electionResearch.getId());
			const electionResearchObject = JSON.parse(electionResearchBuffer.toString());
			
			expect(electionResearchObject.candidatesList.length).to.eql(0);
		});
	});

	describe("#beginCollectingVotes", () => {

		it("Must throw exception to ElectionResearchNotFound", async () => {			
			adminRepository.retrieveElectionResearchWithoutStarting.withArgs(transactionContext).callsFake(() => []);
			
			const adminService = new AdminService();
			adminService.adminRepository = adminRepository;

			await adminService.beginCollectingVotes(transactionContext)
				.should.be.rejectedWith(ElectionResearchNotFound);			
		});

		it("Must successfully execute beginCollectingVotes", async () => {			
			const electionResearch = ElectionResearch.makeElectionResearch("2000", "01");	
			
			const candidate = Candidate.makeCandidate("Fulano", "01");
			
			electionResearch.insertCandidate(candidate);

			adminRepository.retrieveElectionResearchWithoutStarting.withArgs(transactionContext).callsFake(() => [electionResearch]);
			adminRepository.updateElectionResearch.callsFake(async () => {
				electionResearch.beginCollectingVotes();
				await chaincodeStub.putState(electionResearch.getId(), electionResearch.serializerInBuffer());
			});

			const adminService = new AdminService();
			adminService.adminRepository = adminRepository;
			
			await adminService.beginCollectingVotes(transactionContext);

			const electionResearchBuffer = await chaincodeStub.getState(electionResearch.getId());
			const electionResearchObject = JSON.parse(electionResearchBuffer.toString());

			expect(electionResearchObject.isStart).to.eql(true);
			expect(electionResearchObject.totalOfVotes).to.eql(0);
			expect(electionResearchObject.isClose).to.eql(false);
		});

	});

	describe("#finishElectionResearch", () => {
		
		it("Must throw exception for ElectionResearchNotFound", async () => {
			adminRepository.retrieveElectionResearchInProgress.withArgs(transactionContext).callsFake(() => []);
			
			const adminService = new AdminService();
			adminService.adminRepository = adminRepository;

			await adminService.finishElectionResearch(transactionContext).should.be.rejectedWith(ElectionResearchNotFound);
		});

		it("Must successfully execute finishElectionResearch", async () => {			
			const electionResearch = ElectionResearch.makeElectionResearch("2000", "01");

			const candidate = Candidate.makeCandidate("Fulano", "01");
			
			electionResearch.insertCandidate(candidate);
			electionResearch.beginCollectingVotes();

			adminRepository.retrieveElectionResearchInProgress.withArgs(transactionContext).callsFake(() => [electionResearch]);
			adminRepository.updateElectionResearch.callsFake(async () => {
				electionResearch.finishElectionResearch();
				await chaincodeStub.putState(electionResearch.getId(), electionResearch.serializerInBuffer());
			});

			const adminService = new AdminService();
			adminService.adminRepository = adminRepository;

			await adminService.finishElectionResearch(transactionContext);

			const electionResearchBuffer = await chaincodeStub.getState(electionResearch.getId());
			const electionResearchObject = JSON.parse(electionResearchBuffer.toString());

			expect(electionResearchObject.isStart).to.eql(true);
			expect(electionResearchObject.totalOfVotes).to.eql(0);
			expect(electionResearchObject.isClose).to.eql(true);			
		});

	});

	describe("#searchElectionResearch", () => {

		it("Must return an election research", async () => {
			const electionResearch = ElectionResearch.makeElectionResearch("2000", "01");
                        
			await chaincodeStub.putState(electionResearch.getId(), electionResearch.serializerInBuffer());

			adminRepository.retrieveElectionResearch.callsFake(async () => {
				return await chaincodeStub.getState(electionResearch.getId());
			});

			const adminService = new AdminService();                        
			adminService.adminRepository = adminRepository;

			const electionResearchObject = await adminService.searchElectionResearch(transactionContext, "2000", "01");

			expect(electionResearchObject).to.eql(electionResearch);
		});

	});

	describe("#searchElectionResearchWithoutStarting", () => {

		it("Must return election research list without starting", async () => {
			const electionResearch = ElectionResearch.makeElectionResearch("2000", "01");
            
			adminRepository.retrieveElectionResearchWithoutStarting.callsFake(async () => {
				return [electionResearch];
			});

			const adminService = new AdminService();
			adminService.VOTE_LIMIT = 10;                                    
			adminService.adminRepository = adminRepository;

			const electionList = await adminService.searchElectionResearchWithoutStarting(transactionContext);

			expect(electionList[0]).to.eql(electionResearch);
		});

	});

	describe("#searchElectionResearchInProgress", () => {

		it("Must return an election research in progress", async () => {
			const electionResearch = ElectionResearch.makeElectionResearch("2000", "01");
            const candidate = Candidate.makeCandidate("Fulano", "01");
			electionResearch.insertCandidate(candidate);
			electionResearch.beginCollectingVotes();

			adminRepository.retrieveElectionResearchInProgress.callsFake(async () => {
				return [electionResearch];
			});

			const adminService = new AdminService();
			adminService.VOTE_LIMIT = 10;                                    
			adminService.adminRepository = adminRepository;

			const electionList = await adminService.searchElectionResearchInProgress(transactionContext);

			expect(electionList[0]).to.eql(electionResearch);
		});

	});


	describe("#searchElectionResearchClosed", () => {

		it("Must return an election research closed", async () => {
			const electionResearch = ElectionResearch.makeElectionResearch("2000", "01");
            const candidate = Candidate.makeCandidate("Fulano", "01");
			electionResearch.insertCandidate(candidate);
			electionResearch.beginCollectingVotes();
			electionResearch.finishElectionResearch();
			
			adminRepository.retrieveElectionResearchClosed.callsFake(async () => {
				return [electionResearch];
			});

			const adminService = new AdminService();
			adminService.VOTE_LIMIT = 10;                                    
			adminService.adminRepository = adminRepository;

			const electionList = await adminService.searchElectionResearchClosed(transactionContext);

			expect(electionList[0]).to.eql(electionResearch);
		});

	});

});
