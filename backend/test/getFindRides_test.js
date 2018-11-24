var assert = require('assert');
var nock = require('nock');
var expect = require('chai').expect;
var rideFinder = require('../src/getFindRides.js');


describe('getFindRides.js', function() {
  describe('findRides() error for from address', function() {
    beforeEach(function() {
      var responseBing = {resourceSets: [
          { estimatedTotal: 2,
            resources: {}
          }
        ]
      };

      nock('https://dev.virtualearth.net')
        .get('/REST/v1/Locations/US/Empire%20State%20Building?o=json&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .reply(500, responseBing);
    });

    it('500 response code from bing', async function() {
      sAddressFrom = "Empire State Building";
      sAddressTo = "Empire State Building_2";
      expectedResponse = {error: 'An error occured by processing the from address'}
      let responseBack = await rideFinder.findRides(sAddressFrom, sAddressTo);
      assert.deepEqual(responseBack, expectedResponse);
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

  describe('findRides() cannot find from address', function() {
    beforeEach(function() {
      var responseBing = {resourceSets: [
          { estimatedTotal: 2,
            resources: []
          }
        ]
      };

      nock('https://dev.virtualearth.net')
        .get('/REST/v1/Locations/US/Empire%20State%20Building?o=json&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .reply(200, responseBing);

    });

    it('empty response from bing', async function() {
      sAddressFrom = "Empire State Building";
      sAddressTo = "Empire State Building_2";
      expectedResponse = {error: 'From address was not found!' }
      let responseBack = await rideFinder.findRides(sAddressFrom, sAddressTo);
      assert.deepEqual(responseBack, expectedResponse);
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

  describe('findRides() error for to address', function() {
    beforeEach(function() {
      var responseBing = {resourceSets: [
        { estimatedTotal: 2,
          resources: [{
            name: 'Empire State Building, NY',
            address: {
              adminDistrict: 'NY',
              countryRegion: 'United States',
              formattedAddress: 'Empire State Building, NY',
              locality: 'New York' },
            confidence: 'High',
            entityType: 'LandmarkBuilding',
            geocodePoints: [
              {type: 'Point',
                coordinates: [40.7484359741211, -73.9858093261719 ],
                calculationMethod: 'Rooftop'
              }],
          }]
        }
      ]
      };

      var responseBing_2 = {resourceSets: [
          { estimatedTotal: 2,
            resources: {}
          }
        ]
      };

      nock('https://dev.virtualearth.net')
        .get('/REST/v1/Locations/US/Empire%20State%20Building?o=json&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .reply(200, responseBing);

      nock('https://dev.virtualearth.net')
        .get('/REST/v1/Locations/US/Empire%20State%20Building_2?o=json&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .reply(500, responseBing_2);
    });

    it('500 response code from bing', async function() {
      sAddressFrom = "Empire State Building";
      sAddressTo = "Empire State Building_2";
      expectedResponse = {error: 'An error occured by processing the to address'}
      let responseBack = await rideFinder.findRides(sAddressFrom, sAddressTo);
      assert.deepEqual(responseBack, expectedResponse);
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

  describe('findRides() cannot find to address', function() {
    beforeEach(function() {
      var responseBing = {resourceSets: [
          { estimatedTotal: 2,
            resources: [{
              name: 'Empire State Building, NY',
              address: {
                adminDistrict: 'NY',
                countryRegion: 'United States',
                formattedAddress: 'Empire State Building, NY',
                locality: 'New York' },
              confidence: 'High',
              entityType: 'LandmarkBuilding',
              geocodePoints: [
                {type: 'Point',
                  coordinates: [40.7484359741211, -73.9858093261719 ],
                  calculationMethod: 'Rooftop'
                }],
            }]
          }
        ]
      };

      var responseBing_2 = {resourceSets: [
          { estimatedTotal: 2,
            resources: []
          }
        ]
      };

      nock('https://dev.virtualearth.net')
        .get('/REST/v1/Locations/US/Empire%20State%20Building?o=json&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .reply(200, responseBing);

      nock('https://dev.virtualearth.net')
        .get('/REST/v1/Locations/US/Empire%20State%20Building_2?o=json&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .reply(200, responseBing_2);
    });

    it('empty response to bing', async function() {
      sAddressFrom = "Empire State Building";
      sAddressTo = "Empire State Building_2";
      expectedResponse = {error: 'To address was not found!' }
      let responseBack = await rideFinder.findRides(sAddressFrom, sAddressTo);
      assert.deepEqual(responseBack, expectedResponse);
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

  describe('findRides() - standard sucess', function() {
    beforeEach(function() {
      var responseBing = {resourceSets: [
          { estimatedTotal: 2,
            resources: [{
              name: 'Empire State Building, NY',
              address: {
                adminDistrict: 'NY',
                countryRegion: 'United States',
                formattedAddress: 'Empire State Building, NY',
                locality: 'New York' },
              confidence: 'High',
              entityType: 'LandmarkBuilding',
              geocodePoints: [
                {type: 'Point',
                  coordinates: [40.7484359741211, -73.9858093261719],
                  calculationMethod: 'Rooftop'
                }],
            }]
          }
        ]
      };

      var uberResponse = {
        prices: [{display_name: 'Black SUV',
          distance: 6.88,
          high_estimate: 76,
          low_estimate: 61,
          duration: 1920},
          {display_name: 'Black SUV 2',
            distance: 10,
            high_estimate: 80,
            low_estimate: 70,
            duration: 2000}
        ],
      };

      var lyftResponse = {
        cost_estimates:[{display_name: 'Lyft Service',
          estimated_distance_miles: 6.88,
          estimated_cost_cents_max: 7600,
          estimated_cost_cents_min: 6100,
          estimated_duration_seconds: 1920},
          {display_name: 'Lyft Service 2',
            estimated_distance_miles: 10,
            estimated_cost_cents_max: 10000,
            estimated_cost_cents_min: 8000,
            estimated_duration_seconds: 2000},
        ],
      };

      nock('https://dev.virtualearth.net')
        .get('/REST/v1/Locations/US/Empire%20State%20Building?o=json&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .reply(200, responseBing);

      nock('https://dev.virtualearth.net')
        .get('/REST/v1/Locations/US/Empire%20State%20Building_2?o=json&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .reply(200, responseBing);

      // Mock the TMDB configuration request response
      nock('https://api.uber.com')
        .get('/v1.2/estimates/price?start_latitude=40.7484359741211&start_longitude=-73.9858093261719&end_latitude=40.7484359741211&end_longitude=-73.9858093261719')
        .reply(200, uberResponse);

      // Mock the TMDB configuration request response
      nock('https://api.lyft.com')
        .get('/v1/cost?start_lat=40.7484359741211&start_lng=-73.9858093261719&end_lat=40.7484359741211&end_lng=-73.9858093261719')
        .reply(200, lyftResponse);
    });

    it('find lyft and uber', async function() {
      sAddressFrom = "Empire State Building";
      sAddressTo = "Empire State Building_2";
      expectedResponse = {
        fromName: 'Empire State Building, NY',
        toName: 'Empire State Building, NY',
        res: [{ ride_hailing_service: 'uber',
        display_name: 'Black SUV',
        estimated_duration_seconds: 1920,
        estimated_distance_miles: 6.88,
        estimated_cost_cents_min: 61,
        estimated_cost_cents_max: 76 },
        { ride_hailing_service: 'uber',
          display_name: 'Black SUV 2',
          estimated_duration_seconds: 2000,
          estimated_distance_miles: 10,
          estimated_cost_cents_min: 70,
          estimated_cost_cents_max: 80 },
        { ride_hailing_service: 'lyft',
          display_name: 'Lyft Service',
          estimated_duration_seconds: 1920,
          estimated_distance_miles: 6.88,
          estimated_cost_cents_min: 61,
          estimated_cost_cents_max: 76 },
        { ride_hailing_service: 'lyft',
          display_name: 'Lyft Service 2',
          estimated_duration_seconds: 2000,
          estimated_distance_miles: 10,
          estimated_cost_cents_min: 80,
          estimated_cost_cents_max: 100 } ]
        }
      let responseBack = await rideFinder.findRides(sAddressFrom, sAddressTo);
      console.log(responseBack);
      assert.deepEqual(responseBack, expectedResponse);
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

});

