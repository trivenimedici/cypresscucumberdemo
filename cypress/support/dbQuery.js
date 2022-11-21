'use strict'

export default class dbQuerys {


    directProduct(number) {
        cy.task('getData', {
            dbName: 'domain-api',
            collection: 'Summary',
            filter: { Number: Number, directEligible: true, productStatus: '1' },
            output: 'test',
        })

        cy.fixture('test').then(function (data) {
            globalThis.product = data
        })
    }

    customerDirectEligible() {
        cy.task('getData', {
            dbName: 'domain-api',
            collection: 'test',
            filter: { directEligible: true, Number: { $in: [4343453453, 543533] } },
            output: 'test/Eligible',
        })
        cy.fixture('test/Eligible').then(function (data) {
            globalThis.test = data
        })

    }



}