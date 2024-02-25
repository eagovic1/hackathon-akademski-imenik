const request = require('supertest');
const app = require("../search.js");

describe('GET /search', () => {
    test('responds with 200 status and correct message on valid query', async () => {

        const query = 'How computer functions on low level';
        const response = await request(app)
            .get(`/search?prompt=${query}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        const everyItemHasRequiredProperties = response.body.every(item =>
            item.hasOwnProperty('paperId') && item.hasOwnProperty('title')
        );
    });

    test('responds with 200 status and correct message on valid query', async () => {
        const query = 'Please explain how car engine and braking system works';
        const response = await request(app)
            .get(`/search?prompt=${query}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        const everyItemHasRequiredProperties = response.body.every(item =>
            item.hasOwnProperty('paperId') && item.hasOwnProperty('title')
        );
    });

    test('responds with 200 status and error message with query of keywords', async () => {
        const query = '"Computer architecture", "Microarchitecture", "Hardware design"';
        const response = await request(app)
            .get(`/search?prompt=${query}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        const everyItemHasRequiredProperties = response.body.every(item =>
            item.hasOwnProperty('paperId') && item.hasOwnProperty('title')
        );
    });

    test('responds with 400 status and error message with number query', async () => {
        const query = '12345';
        const response = await request(app)
            .get(`/search?prompt=${query}`);
        expect(response.status).toBe(400);
        expect(typeof response.body).toBe('object');
        expect(Array.isArray(response.body)).toBe(false);
        expect(response.body).toHaveProperty('error');
    });

    test('responds with 400 status and error message with query too short', async () => {
        const query = 'as';
        const response = await request(app)
            .get(`/search?prompt=${query}`);
        expect(response.status).toBe(400);
        expect(typeof response.body).toBe('object');
        expect(Array.isArray(response.body)).toBe(false);
        expect(response.body).toHaveProperty('error');
    });

    test('responds with 400 status and error message with query random characters', async () => {
        const query = 'adfgdnfgjdgdngis';
        const response = await request(app)
            .get(`/search?prompt=${query}`);
        expect(response.status).toBe(400);
        expect(typeof response.body).toBe('object');
        expect(Array.isArray(response.body)).toBe(false);
        expect(response.body).toHaveProperty('error');
    });

    

});