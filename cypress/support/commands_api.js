
// Header data


Cypress.Commands.add("getAuthToken", () => {
	cy.request({
		method: "POST", url: `${Cypress.config('baseApi')}/auth-api/v1/oauth/token`,
		headers: {
			'Connection': 'keep-alive',
			'consumer-id': 'testet',
			'correlation-id': '42342'
		},
		body: {
			"username": "test",
			"password": "password",
			"grantType": "password",
			"platform": "DESKTOP",
			"authContext": null
		}
	}).as('getAuthToken')
})



Cypress.Commands.add("gettests", (response) => {
	cy.request({
		method: "GET", url: `${Cypress.config("baseApi")}/v1/tests?username=test`,
		headers: {
			"accept": `application/json, text/plain, */*`,
			"accept-encoding": `gzip, deflate, br`,
			"accept-language": `en-US,en;q=0.9`,
			"Authorization": `Bearer ${response.body.accessToken}`,
			"consumer-id": gettestData.consumer_id,
			"correlation-id": gettestData.correlation_id,
			"if-none-match": `W/"test`,
			"origin": `https://wordpress.com`,
			"referer": `https://wordpress.com`,
			"sec-ch-ua": `" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"`,
			"sec-ch-ua-mobile": `?0`,
			"sec-ch-ua-platform": `"macOS"`,
			"sec-fetch-dest": `empty`,
			"sec-fetch-mode": `cors`,
			"sec-fetch-site": `same-site`,
			"syncflag": `Y`,
			"transaction-id": gettestData.transaction_id,
		}
	}).as('getdataforuser')
});

Cypress.Commands.add('checkStatusCode', (alias, statusCode) => {
	cy.get(alias).then((response) => {
		expect(response).property('status').to.equal(Number(statusCode));
	})
})


