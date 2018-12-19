var assert = require('assert');
var nock = require('nock');
var chai = require('chai');
var expect = require('chai').expect;
var suggestion = require('../src/getSuggestion.js');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe('getSuggestion.js', function() {
  describe('requestSuggestion() success', function() {
    beforeEach(function() {
      var suggestionResponse = {resourceSets: []};

      // Mock the TMDB configuration request response
      nock('http://dev.virtualearth.net')
        .get('/REST/v1/Autosuggest?query=Columbia%20University&includeEntityTypes=Business,Address,Place&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .reply(200, suggestionResponse);
    });


    it('200 response code', async function() {
      let sAddress = 'Columbia University';
      let responseBack = await suggestion.requestSuggestion(sAddress);
      expect(responseBack.hasOwnProperty("resourceSets")).to.equal(true);
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

  describe('requestSuggestion() error', function() {
    beforeEach(function() {
      var suggestionResponse = {resourceSets: []};

      // Mock the TMDB configuration request response
      nock('http://dev.virtualearth.net')
        .get('/REST/v1/Autosuggest?query=Columbia%20University&includeEntityTypes=Business,Address,Place&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .reply(500, suggestionResponse);
    });


    it('500 response code', async function() {
      let sAddress = 'Columbia University';
      expect(suggestion.requestSuggestion(sAddress)).to.be.rejectedWith(500);
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

  describe('requestSuggestion() success delayed', function() {
    beforeEach(function() {
      var suggestionResponse = {resourceSets: []};

      // Mock the TMDB configuration request response
      nock('http://dev.virtualearth.net')
        .get('/REST/v1/Autosuggest?query=Columbia%20University&includeEntityTypes=Business,Address,Place&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .socketDelay(2499)
        .reply(200, suggestionResponse);
    });


    it('200 response code', async function() {
      let sAddress = 'Columbia University';
      let responseBack = await suggestion.requestSuggestion(sAddress);
      expect(responseBack.hasOwnProperty("resourceSets")).to.equal(true);
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

  describe('requestSuggestion() success timeout', function() {
    beforeEach(function() {
      var suggestionResponse = {resourceSets: []};

      // Mock the TMDB configuration request response
      nock('http://dev.virtualearth.net')
        .get('/REST/v1/Autosuggest?query=Columbia%20University&includeEntityTypes=Business,Address,Place&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .socketDelay(2501)
        .reply(200, suggestionResponse);
    });


    it('200 response code', async function() {
      res = {};
      let sAddress = 'Columbia University';
      let responseBack = await suggestion.requestSuggestion(sAddress).catch((err) => {
        res['error'] = err;
      });
      expect(res['error'].code, 'ESOCKETTIMEDOUT');
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

  describe('processBingSuggestionResponse()', function() {
    it('success', async function() {
      let expectedResponse = {};
      let input = {
        resourceSets: [{resources: [
          {value: [{
            __type: 'LocalBusiness',
            address: { countryRegion: 'United States',
            locality: 'New York',
            adminDistrict: 'NY',
            countryRegionIso2: 'US',
            postalCode: '10027',
            addressLine: '535 W 114th St',
            formattedAddress: '535 W 114th St, New York, NY 10027' },
            name: 'Columbia University Libraries'
          }]
        }
        ]}]
      };

      expectedResponse['response'] = [{
            __type: 'LocalBusiness',
            address: { countryRegion: 'United States',
            locality: 'New York',
            adminDistrict: 'NY',
            countryRegionIso2: 'US',
            postalCode: '10027',
            addressLine: '535 W 114th St',
            formattedAddress: '535 W 114th St, New York, NY 10027' },
            name: 'Columbia University Libraries'
          }];

      let responseBack = await suggestion.processBingSuggestionResponse(input);
      assert.deepEqual(responseBack, expectedResponse);
    });

    it('success - empty results', async function() {
      let expectedResponse = {};
      let input = {
        resourceSets: [{resources: [
          {value: []
        }
        ]}]
      };

      expectedResponse['response'] = [];

      let responseBack = await suggestion.processBingSuggestionResponse(input);
      assert.deepEqual(responseBack, expectedResponse);
    });

    it('error - no resource', async function() {
      let expectedResponse = {};
      let input = {
        resourceSets: [{missing: 'missing'}]
      };

      let responseBack = await suggestion.processBingSuggestionResponse(input);
      expect(responseBack.hasOwnProperty("error")).to.equal(true);
    });

    it('error - no resourceset', async function() {
      let expectedResponse = {};
      let input = {
        resourceSets: [{missing: 'missing'}]
      };

      let responseBack = await suggestion.processBingSuggestionResponse(input);
      expect(responseBack.hasOwnProperty("error")).to.equal(true);
    });
  });
});
