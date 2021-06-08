import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex("users").del();

	// Inserts seed entries
	return await knex("users").insert([{
		"id": "8d1e9ad5-0a9b-4fc7-b10c-418be801a3ac",
		"email": "tforri0@google.com",
		"password": "$2b$12$b1rl.PBsRMZfpY0aZPwW8.CPUICQDalL48Vhj0l1N/ANT2v5SfV7q",
		"fname": "Tess",
		"lname": "Forri",
		"gender": "FEMALE"
	}, {
		"id": "a4942a61-bec0-4e4f-961e-5dee75899121",
		"email": "eselvey1@ocn.ne.jp",
		"password": "$2b$12$rnMPSpalDJn7FoRy/CtNR.xapd/ZB44gt1pmkkrx3RLzS50YLco5K",
		"fname": "Ebony",
		"lname": "Selvey",
		"gender": "FEMALE"
	}, {
		"id": "94ae2331-228b-49ee-a9b5-b60a19c1ac2d",
		"email": "astieger2@fema.gov",
		"password": "$2b$12$q5k8sf2J52sAamGOTN3EsuRl0jwmmIPDnexAnsO/2s.ugkEmRyGkC",
		"fname": "Arabelle",
		"lname": "Stieger",
		"gender": "MALE"
	}]);
};

/*
	"email": "tforri0@google.com", "password": "adtvsycBl1!"
 	"email": "eselvey1@ocn.ne.jp", "password": "zkSQY67PhwV1!"
	"email": "astieger2@fema.gov", "password": "t2iYoBssj01!"
 */




		