const InvalidCpf = require("../Exception/Elector/InvalidCpf");
const InvalidAge = require("../Exception/Elector/InvalidAge");
const ApiSearchCpf = require("./ApiSearchCpf");
const crypto = require("crypto");

class Elector extends ApiSearchCpf {

	async vote(payload) {		
        const cpf = payload.cpf;
        const birthDate = payload.birthDate;
        const numberOfCandidate = payload.numberOfCandidate;

		const birthDateObject = this.getBirthDateObject(birthDate);

        const cpfIsValid = this.cpfIsValid(cpf);
        if (!cpfIsValid) {
            throw new InvalidCpf();
        }

        const ageIsValid = this.ageIsValid(birthDateObject);
        if (!ageIsValid) {
            throw new InvalidAge();
        }
		
		await this.validatesIfElectorIsReal(cpf, birthDateObject);        
		
		const cpfHash = this.encryptCpf(cpf);
		//TODO: SmartContract connection
		return {cpf, numberOfCandidate};        
    }

	getBirthDateObject(birthDate) {
		const dateArray = birthDate.split("-");
		
		const birthDateObject = {
			year: dateArray[0],
			month: dateArray[1],
			day: dateArray[2] 
		};		

		return birthDateObject;
	}

    cpfIsValid(cpf) {
		var sum;
		var mod;
		sum = 0;

		if (cpf == "00000000000") {
			return false;
		}

		for (let i = 1; i <= 9; i++) {
			sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
		}

		mod = (sum * 10) % 11;
		if ((mod == 10) || (mod == 11)) {
			mod = 0;
		}

		if (mod != parseInt(cpf.substring(9, 10))) {
			return false;
		}

		sum = 0;
		for (let i = 1; i <= 10; i++) {
			sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
		}

		mod = (sum * 10) % 11;
		if ((mod == 10) || (mod == 11)) {
			mod = 0;
		}

		if (mod != parseInt(cpf.substring(10, 11))) {
			return false;
		}

		return true;
	}

    ageIsValid(birthDateObject) {
        const MINIMUM_AGE = 16;

		const year = new Date().getFullYear();
		const month = new Date().getMonth();
		const day = new Date().getDay();
		
		const toDay = new Date(`${year}-${month}-${day}`);
		const birthDate = new Date(`${birthDateObject.year}-${birthDateObject.month}-${birthDateObject.day}`);

		const age =  (toDay.getFullYear() - birthDate.getFullYear());		

        if (age >= MINIMUM_AGE) {
            return true
        }

        return false;
	}	

	encryptCpf(cpf) {
		const hash = crypto.createHash("sha256");
		const cpfHashing  = hash.update(cpf, "utf-8");
		
		return cpfHashing.digest("hex")
	}

	async searchElector(payload) {
		const yearElection = payload.yearElection;
		const monthElection = payload.monthElection;
		const cpf = payload.cpf;

		this.cpfIsValid(cpf);
		if (!cpfIsValid) {
            throw new InvalidCpf();
        }

		const cpfHash = this.encryptCpf(cpf);

		//Chama contrato
	}

	async searchElectionResearchLikeElector(payload) {
		const year = payload.year;
		const month = payload.month;

		//Chamar contrato
	}
}

module.exports = Elector;