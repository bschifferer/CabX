var assert = require('assert');
var nock = require('nock');
var chai = require('chai');
var expect = require('chai').expect;
var uber = require('../src/getUber.js');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe('getUber.js', function() {
  describe('getRelevantInformationFromUberResponse()', function() {
    it('success - standard case', function() {
      input = {display_name: 'Black SUV',
        distance: 6.88,
        high_estimate: 76,
        low_estimate: 61,
        duration: 1920};
      let expectedResponse = {};
      expectedResponse['response'] = {ride_hailing_service: 'uber',
        display_name: 'Black SUV',
        estimated_duration_seconds: 1920,
        estimated_distance_miles: 6.88,
        estimated_cost_cents_min: 61,
        estimated_cost_cents_max: 76};
      let output = uber.getRelevantInformationFromUberResponse(input)
      assert.deepEqual(output, expectedResponse);
      expect(output.hasOwnProperty("error")).to.equal(false);
    });

    it('error - missing display_name', function() {
      input = {
        distance: 6.88,
        high_estimate: 76,
        low_estimate: 61,
        duration: 1920};
      let output = uber.getRelevantInformationFromUberResponse(input)
      expect(output.hasOwnProperty("error")).to.equal(true);
    });

    it('error - missing distance', function() {
      input = {display_name: 'Black SUV',
        high_estimate: 76,
        low_estimate: 61,
        duration: 1920};
      let output = uber.getRelevantInformationFromUberResponse(input)
      expect(output.hasOwnProperty("error")).to.equal(true);
    });

    it('error - missing high_estimate', function() {
      input = {display_name: 'Black SUV',
        distance: 6.88,
        low_estimate: 61,
        duration: 1920};
      let output = uber.getRelevantInformationFromUberResponse(input)
      expect(output.hasOwnProperty("error")).to.equal(true);
    });

    it('error - missing low_estimate', function() {
      input = {display_name: 'Black SUV',
        distance: 6.88,
        high_estimate: 76,
        duration: 1920};
      let output = uber.getRelevantInformationFromUberResponse(input)
      expect(output.hasOwnProperty("error")).to.equal(true);
    });

    it('error - missing duration', function() {
      input = {display_name: 'Black SUV',
        distance: 6.88,
        high_estimate: 76,
        low_estimate: 61};
      let output = uber.getRelevantInformationFromUberResponse(input)
      expect(output.hasOwnProperty("error")).to.equal(true);
    });
  });

  describe('processUberResponseBody()', function() {
    it('success - standard case', function() {
      input = [{display_name: 'Black SUV',
        distance: 6.88,
        high_estimate: 76,
        low_estimate: 61,
        duration: 1920},
        {display_name: 'Black SUV 2',
          distance: 10,
          high_estimate: 80,
          low_estimate: 70,
          duration: 2000}
      ];
      let expectedResponse = {};
      expectedResponse = [{ride_hailing_service: 'uber',
        display_name: 'Black SUV',
        estimated_duration_seconds: 1920,
        estimated_distance_miles: 6.88,
        estimated_cost_cents_min: 61,
        estimated_cost_cents_max: 76},
        {ride_hailing_service: 'uber',
          display_name: 'Black SUV 2',
          estimated_duration_seconds: 2000,
          estimated_distance_miles: 10,
          estimated_cost_cents_min: 70,
          estimated_cost_cents_max: 80}
      ];
      let output = uber.processUberResponseBody(input)
      assert.deepEqual(output, expectedResponse);
    });

    it('success empty input', function() {
      input = [];
      let expectedResponse = {};
      expectedResponse = [];
      let output = uber.processUberResponseBody(input)
      assert.deepEqual(output, expectedResponse);
    });

    it('error one wrong, one correct', function() {
      input = [{
        distance: 6.88,
        high_estimate: 76,
        low_estimate: 61,
        duration: 1920},
        {display_name: 'Black SUV 2',
          distance: 10,
          high_estimate: 80,
          low_estimate: 70,
          duration: 2000}
      ];
      let expectedResponse = {};
      expectedResponse = [
        {ride_hailing_service: 'uber',
          display_name: 'Black SUV 2',
          estimated_duration_seconds: 2000,
          estimated_distance_miles: 10,
          estimated_cost_cents_min: 70,
          estimated_cost_cents_max: 80}
      ];
      let output = uber.processUberResponseBody(input)
      assert.deepEqual(output, expectedResponse);
    });

    it('error two wrong', function() {
      input = [{
        distance: 6.88,
        high_estimate: 76,
        low_estimate: 61,
        duration: 1920},
        {display_name: 'Black SUV 2',
          high_estimate: 80,
          low_estimate: 70,
          duration: 2000}
      ];
      let expectedResponse = {};
      expectedResponse = [];
      let output = uber.processUberResponseBody(input)
      assert.deepEqual(output, expectedResponse);
    });
  });

  describe('uberPrices() success', function() {
    beforeEach(function() {
      var uberResponse = {
        prices:[],
      };

      // Mock the TMDB configuration request response
      nock('https://api.uber.com')
        .get('/v1.2/estimates/price?start_latitude=40.8081588745117&start_longitude=-73.9636535644531&end_latitude=40.7483711242676&end_longitude=-73.9846420288086')
        .reply(200, uberResponse);
    });


    it('200 response code', async function() {
      fromLat = 40.8081588745117;
      fromLong = -73.9636535644531;
      toLat = 40.7483711242676;
      toLong = -73.9846420288086;
      let responseBack = await uber.uberPrices(fromLat, fromLong, toLat, toLong);
      expect(JSON.parse(responseBack).hasOwnProperty("prices")).to.equal(true);
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

  describe('uberPrices() error', function() {
    beforeEach(function() {
      var uberResponse = {};

      // Mock the TMDB configuration request response
      nock('https://api.uber.com')
        .get('/v1.2/estimates/price?start_latitude=40.8081588745117&start_longitude=-73.9636535644531&end_latitude=40.7483711242676&end_longitude=-73.9846420288086')
        .reply(500, uberResponse);
    });

    it('500 response code', async function() {
      fromLat = 40.8081588745117;
      fromLong = -73.9636535644531;
      toLat = 40.7483711242676;
      toLong = -73.9846420288086;
      expect(uber.uberPrices(fromLat, fromLong, toLat, toLong)).to.be.rejectedWith(500);
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

  describe('uberPrices() success delayed', function() {
    beforeEach(function() {
      var uberResponse = {
        prices:[],
      };

      // Mock the TMDB configuration request response
      nock('https://api.uber.com')
        .get('/v1.2/estimates/price?start_latitude=40.8081588745117&start_longitude=-73.9636535644531&end_latitude=40.7483711242676&end_longitude=-73.9846420288086')
        .socketDelay(1499)
        .reply(200, uberResponse);
    });


    it('200 response code', async function() {
      fromLat = 40.8081588745117;
      fromLong = -73.9636535644531;
      toLat = 40.7483711242676;
      toLong = -73.9846420288086;
      let responseBack = await uber.uberPrices(fromLat, fromLong, toLat, toLong);
      expect(JSON.parse(responseBack).hasOwnProperty("prices")).to.equal(true);
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

  describe('uberPrices() success timeout', function() {
    beforeEach(function() {
      var uberResponse = {
        prices:[],
      };

      // Mock the TMDB configuration request response
      nock('https://api.uber.com')
        .get('/v1.2/estimates/price?start_latitude=40.8081588745117&start_longitude=-73.9636535644531&end_latitude=40.7483711242676&end_longitude=-73.9846420288086')
        .socketDelay(1501)
        .reply(200, uberResponse);
    });


    it('200 response code', async function() {
      res = {};
      fromLat = 40.8081588745117;
      fromLong = -73.9636535644531;
      toLat = 40.7483711242676;
      toLong = -73.9846420288086;
      let responseBack = await uber.uberPrices(fromLat, fromLong, toLat, toLong).catch((err) => {
        res['error'] = err;
      });
      expect(res['error'].code, 'ESOCKETTIMEDOUT');
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });


});
