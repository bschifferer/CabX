var assert = require('assert');
var nock = require('nock');
var expect = require('chai').expect;
var latLong = require('../src/getLatLongFromAddress.js');
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe('getLatLongFromAddress.js', function() {
  describe('requestLatLongFromAddress() success', function() {
    beforeEach(function() {
      var responseBing = {
        authenticationResultCode: "ValidCredentials",
        brandLogoUri: "http://dev.virtualearth.net/Branding/logo_powered_by.png",
        copyright: "Copyright © 2018",
        resourceSets: [
          { estimatedTotal: 2,
            resources: {
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
            }
          }
        ],
        statusCode: 200,
        statusDescription: "OK",
        traceId:
          "traceId"};

      nock('https://dev.virtualearth.net')
        .get('/REST/v1/Locations/US/Empire%20State%20Building?o=json&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .reply(200, responseBing);
    });

    it('200 response code', async function() {
      sAddress = "Empire State Building";
      let responseBack = await latLong.requestLatLongFromAddress(sAddress);
      expect(responseBack.hasOwnProperty("resourceSets")).to.equal(true);
      expect(responseBack.resourceSets[0].hasOwnProperty("resources")).to.equal(true);
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

  describe('requestLatLongFromAddress() success delayed', function() {
    beforeEach(function() {
      var responseBing = {
        authenticationResultCode: "ValidCredentials",
        brandLogoUri: "http://dev.virtualearth.net/Branding/logo_powered_by.png",
        copyright: "Copyright © 2018",
        resourceSets: [
          { estimatedTotal: 2,
            resources: {
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
            }
          }
        ],
        statusCode: 200,
        statusDescription: "OK",
        traceId:
          "traceId"};

      nock('https://dev.virtualearth.net')
        .get('/REST/v1/Locations/US/Empire%20State%20Building?o=json&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .socketDelay(2499)
        .reply(200, responseBing);
    });

    it('200 response code', async function() {
      sAddress = "Empire State Building";
      let responseBack = await latLong.requestLatLongFromAddress(sAddress);
      expect(responseBack.hasOwnProperty("resourceSets")).to.equal(true);
      expect(responseBack.resourceSets[0].hasOwnProperty("resources")).to.equal(true);
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

  describe('requestLatLongFromAddress() success timeout', function() {
    beforeEach(function() {
      var responseBing = {
        authenticationResultCode: "ValidCredentials",
        brandLogoUri: "http://dev.virtualearth.net/Branding/logo_powered_by.png",
        copyright: "Copyright © 2018",
        resourceSets: [
          { estimatedTotal: 2,
            resources: {
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
            }
          }
        ],
        statusCode: 200,
        statusDescription: "OK",
        traceId:
          "traceId"};

      nock('https://dev.virtualearth.net')
        .get('/REST/v1/Locations/US/Empire%20State%20Building?o=json&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .socketDelay(2501)
        .reply(200, responseBing);
    });

    it('200 response code', async function() {
      res = {};
      sAddress = "Empire State Building";
      let responseBack = await latLong.requestLatLongFromAddress(sAddress).catch((err) => {
        res['error'] = err;
      });
      expect(res['error'].code, 'ESOCKETTIMEDOUT');;
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

  describe('requestLatLongFromAddress() error', function() {
    beforeEach(function() {
      var responseBing = {};

      nock('https://dev.virtualearth.net')
        .get('/REST/v1/Locations/US/Empire%20State%20Building?o=json&key=AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f')
        .reply(500, responseBing);
    });

    it('500 response code', async function() {
      sAddress = "Empire State Building";
      expect(latLong.requestLatLongFromAddress(sAddress)).to.be.rejectedWith(500);
    });

    afterEach(function () {
      nock.cleanAll();
    });
  });

  describe('getRelevantInformationFromLatLongResponse()', function() {
    it('success', async function() {
     input = {
        name: 'Empire State Building',
        confidence: 'High',
        geocodePoints: [{
          coordinates: [40.7484359741211, -73.9858093261719 ],
        }],
        address: {
        adminDistrict: 'NY',
          countryRegion: 'United States',
          formattedAddress: 'Empire State Building, NY',
          locality: 'New York' }
      };
     expectedResponse = {response:
          { name: 'Empire State Building',
            confidence: 'High',
            lat: 40.7484359741211,
            long: -73.9858093261719,
            address:
              { adminDistrict: 'NY',
                countryRegion: 'United States',
                formattedAddress: 'Empire State Building, NY',
                locality: 'New York'
              }
          }
      };
      let responseBack = latLong.getRelevantInformationFromLatLongResponse(input);
      assert.deepEqual(responseBack, expectedResponse);
      expect(responseBack.hasOwnProperty("error")).to.equal(false);
    });

    it('missing name', async function() {
      input = {
        confidence: 'High',
        geocodePoints: [{
          coordinates: [40.7484359741211, -73.9858093261719 ],
        }],
        address: {
          adminDistrict: 'NY',
          countryRegion: 'United States',
          formattedAddress: 'Empire State Building, NY',
          locality: 'New York' }
      };
      expectedResponse = {response:
          { name: 'Empire State Building',
            confidence: 'High',
            lat: 40.7484359741211,
            long: -73.9858093261719,
            address:
              { adminDistrict: 'NY',
                countryRegion: 'United States',
                formattedAddress: 'Empire State Building, NY',
                locality: 'New York'
              }
          }
      };
      let responseBack = latLong.getRelevantInformationFromLatLongResponse(input);
      expect(responseBack.hasOwnProperty("error")).to.equal(true);
    });

    it('missing confidence', async function() {
      input = {
        name: 'Empire State Building',
        geocodePoints: [{
          coordinates: [40.7484359741211, -73.9858093261719 ],
        }],
        address: {
          adminDistrict: 'NY',
          countryRegion: 'United States',
          formattedAddress: 'Empire State Building, NY',
          locality: 'New York' }
      };
      expectedResponse = {response:
          { name: 'Empire State Building',
            confidence: 'High',
            lat: 40.7484359741211,
            long: -73.9858093261719,
            address:
              { adminDistrict: 'NY',
                countryRegion: 'United States',
                formattedAddress: 'Empire State Building, NY',
                locality: 'New York'
              }
          }
      };
      let responseBack = latLong.getRelevantInformationFromLatLongResponse(input);
      expect(responseBack.hasOwnProperty("error")).to.equal(true);
    });

    it('missing geocodePoints', async function() {
      input = {
        name: 'Empire State Building',
        confidence: 'High',
        address: {
          adminDistrict: 'NY',
          countryRegion: 'United States',
          formattedAddress: 'Empire State Building, NY',
          locality: 'New York' }
      };
      expectedResponse = {response:
          { name: 'Empire State Building',
            confidence: 'High',
            lat: 40.7484359741211,
            long: -73.9858093261719,
            address:
              { adminDistrict: 'NY',
                countryRegion: 'United States',
                formattedAddress: 'Empire State Building, NY',
                locality: 'New York'
              }
          }
      };
      let responseBack = latLong.getRelevantInformationFromLatLongResponse(input);
      expect(responseBack.hasOwnProperty("error")).to.equal(true);
    });

    it('missing address', async function() {
      input = {
        name: 'Empire State Building',
        confidence: 'High',
        geocodePoints: [{
          coordinates: [40.7484359741211, -73.9858093261719 ],
        }],
      };
      expectedResponse = {response:
          { name: 'Empire State Building',
            confidence: 'High',
            lat: 40.7484359741211,
            long: -73.9858093261719,
            address:
              { adminDistrict: 'NY',
                countryRegion: 'United States',
                formattedAddress: 'Empire State Building, NY',
                locality: 'New York'
              }
          }
      };
      let responseBack = latLong.getRelevantInformationFromLatLongResponse(input);
      expect(responseBack.hasOwnProperty("error")).to.equal(true);
    });

    it('missing coordinates', async function() {
      input = {
        name: 'Empire State Building',
        confidence: 'High',
        geocodePoints: [{}],
        address: {
          adminDistrict: 'NY',
          countryRegion: 'United States',
          formattedAddress: 'Empire State Building, NY',
          locality: 'New York' }
      };
      expectedResponse = {response:
          { name: 'Empire State Building',
            confidence: 'High',
            lat: 40.7484359741211,
            long: -73.9858093261719,
            address:
              { adminDistrict: 'NY',
                countryRegion: 'United States',
                formattedAddress: 'Empire State Building, NY',
                locality: 'New York'
              }
          }
      };
      let responseBack = latLong.getRelevantInformationFromLatLongResponse(input);
      expect(responseBack.hasOwnProperty("error")).to.equal(true);
    });

    it('only one coordinate', async function() {
      input = {
        name: 'Empire State Building',
        confidence: 'High',
        geocodePoints: [{
          coordinates: [-73.9858093261719],
        }],
        address: {
          adminDistrict: 'NY',
          countryRegion: 'United States',
          formattedAddress: 'Empire State Building, NY',
          locality: 'New York' }
      };
      expectedResponse = {response:
          { name: 'Empire State Building',
            confidence: 'High',
            lat: 40.7484359741211,
            long: -73.9858093261719,
            address:
              { adminDistrict: 'NY',
                countryRegion: 'United States',
                formattedAddress: 'Empire State Building, NY',
                locality: 'New York'
              }
          }
      };
      let responseBack = latLong.getRelevantInformationFromLatLongResponse(input);
      expect(responseBack.hasOwnProperty("error")).to.equal(true);
    });

  });

  describe('processBingResponseBody()', function() {
    it('success standard case - loop1', async function() {
      input = [{
        name: 'Empire State Building 1',
        confidence: 'High 1',
        geocodePoints: [{
          coordinates: [90.7484359741211, -90.9858093261719 ],
        }],
        address: {
          adminDistrict: 'NY 1',
          countryRegion: 'United States 1',
          formattedAddress: 'Empire State Building, NY 1',
          locality: 'New York 1' }
      },
      ];
      expectedResponse =
          [{
            name: 'Empire State Building 1',
            confidence: 'High 1',
            lat: 90.7484359741211,
            long: -90.9858093261719,
            address:
              {
                adminDistrict: 'NY 1',
                countryRegion: 'United States 1',
                formattedAddress: 'Empire State Building, NY 1',
                locality: 'New York 1'
              },
          },
          ];
      let responseBack = latLong.processBingResponseBody(input);
      assert.deepEqual(responseBack, expectedResponse);
    });

    it('success standard case - loop2', async function() {
      input = [{
        name: 'Empire State Building 1',
        confidence: 'High 1',
        geocodePoints: [{
          coordinates: [90.7484359741211, -90.9858093261719 ],
        }],
        address: {
          adminDistrict: 'NY 1',
          countryRegion: 'United States 1',
          formattedAddress: 'Empire State Building, NY 1',
          locality: 'New York 1' }
      },{
          name: 'Empire State Building 2',
          confidence: 'High 2',
          geocodePoints: [{
            coordinates: [40.7484359741211, -73.9858093261719 ],
          }],
          address: {
            adminDistrict: 'NY 2',
            countryRegion: 'United States 2',
            formattedAddress: 'Empire State Building, NY 2',
            locality: 'New York 2' }
            },
      ];
      expectedResponse =
          [{
            name: 'Empire State Building 1',
            confidence: 'High 1',
            lat: 90.7484359741211,
            long: -90.9858093261719,
            address:
              {
                adminDistrict: 'NY 1',
                countryRegion: 'United States 1',
                formattedAddress: 'Empire State Building, NY 1',
                locality: 'New York 1'
              },
          },
            {
              name: 'Empire State Building 2',
              confidence: 'High 2',
              lat: 40.7484359741211,
              long: -73.9858093261719,
              address:
                {
                  adminDistrict: 'NY 2',
                  countryRegion: 'United States 2',
                  formattedAddress: 'Empire State Building, NY 2',
                  locality: 'New York 2'
                },
            },
          ];
      let responseBack = latLong.processBingResponseBody(input);
      assert.deepEqual(responseBack, expectedResponse);
    });


      it('success standard case - loop2', async function() {
      input = [{
        name: 'Empire State Building 1',
        confidence: 'High 1',
        geocodePoints: [{
          coordinates: [90.7484359741211, -90.9858093261719 ],
        }],
        address: {
          adminDistrict: 'NY 1',
          countryRegion: 'United States 1',
          formattedAddress: 'Empire State Building, NY 1',
          locality: 'New York 1' }
      },{
          name: 'Empire State Building 2',
          confidence: 'High 2',
          geocodePoints: [{
            coordinates: [40.7484359741211, -73.9858093261719 ],
          }],
          address: {
            adminDistrict: 'NY 2',
            countryRegion: 'United States 2',
            formattedAddress: 'Empire State Building, NY 2',
            locality: 'New York 2' }
            },
        {
          name: 'Empire State Building 2',
          confidence: 'High 2',
          geocodePoints: [{
            coordinates: [40.7484359741211, -73.9858093261719 ],
          }],
          address: {
            adminDistrict: 'NY 2',
            countryRegion: 'United States 2',
            formattedAddress: 'Empire State Building, NY 2',
            locality: 'New York 2' }
            },
      ];
      expectedResponse =
          [{
            name: 'Empire State Building 1',
            confidence: 'High 1',
            lat: 90.7484359741211,
            long: -90.9858093261719,
            address:
              {
                adminDistrict: 'NY 1',
                countryRegion: 'United States 1',
                formattedAddress: 'Empire State Building, NY 1',
                locality: 'New York 1'
              },
          },
            {
              name: 'Empire State Building 2',
              confidence: 'High 2',
              lat: 40.7484359741211,
              long: -73.9858093261719,
              address:
                {
                  adminDistrict: 'NY 2',
                  countryRegion: 'United States 2',
                  formattedAddress: 'Empire State Building, NY 2',
                  locality: 'New York 2'
                },
            },
            {
              name: 'Empire State Building 2',
              confidence: 'High 2',
              lat: 40.7484359741211,
              long: -73.9858093261719,
              address:
                {
                  adminDistrict: 'NY 2',
                  countryRegion: 'United States 2',
                  formattedAddress: 'Empire State Building, NY 2',
                  locality: 'New York 2'
                },
            },
          ];
      let responseBack = latLong.processBingResponseBody(input);
      assert.deepEqual(responseBack, expectedResponse);
    });

    it('success empty input - loop0', async function() {
      input = [];
      expectedResponse = [];
      let responseBack = latLong.processBingResponseBody(input);
      assert.deepEqual(responseBack, expectedResponse);
    });

    it('error one wrong, one correct', async function() {
      input = [{
        confidence: 'High 1',
        geocodePoints: [{
          coordinates: [90.7484359741211, -90.9858093261719 ],
        }],
        address: {
          adminDistrict: 'NY 1',
          countryRegion: 'United States 1',
          formattedAddress: 'Empire State Building, NY 1',
          locality: 'New York 1' }
      },{
        name: 'Empire State Building 2',
        confidence: 'High 2',
        geocodePoints: [{
          coordinates: [40.7484359741211, -73.9858093261719 ],
        }],
        address: {
          adminDistrict: 'NY 2',
          countryRegion: 'United States 2',
          formattedAddress: 'Empire State Building, NY 2',
          locality: 'New York 2' }
      },
      ];
      expectedResponse =
        [{
            name: 'Empire State Building 2',
            confidence: 'High 2',
            lat: 40.7484359741211,
            long: -73.9858093261719,
            address:
              {
                adminDistrict: 'NY 2',
                countryRegion: 'United States 2',
                formattedAddress: 'Empire State Building, NY 2',
                locality: 'New York 2'
              },
          },
        ];
      let responseBack = latLong.processBingResponseBody(input);
      assert.deepEqual(responseBack, expectedResponse);
    });

    it('error two wrong', async function() {
      input = [{
        confidence: 'High 1',
        geocodePoints: [{
          coordinates: [90.7484359741211, -90.9858093261719 ],
        }],
        address: {
          adminDistrict: 'NY 1',
          countryRegion: 'United States 1',
          formattedAddress: 'Empire State Building, NY 1',
          locality: 'New York 1' }
      },{
        name: 'Empire State Building 2',
        confidence: 'High 2',
        address: {
          adminDistrict: 'NY 2',
          countryRegion: 'United States 2',
          formattedAddress: 'Empire State Building, NY 2',
          locality: 'New York 2' }
      },
      ];
      expectedResponse = [];
      let responseBack = latLong.processBingResponseBody(input);
      assert.deepEqual(responseBack, expectedResponse);
    });
  });

  describe('processBingLatLongResponse()', function() {
    it('success standard case', async function() {
      input = {
          authenticationResultCode: "ValidCredentials",
          brandLogoUri: "http://dev.virtualearth.net/Branding/logo_powered_by.png",
          copyright: "Copyright © 2018",
          resourceSets: [
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
          ],
          statusCode: 200,
          statusDescription: "OK",
          traceId:
            "traceId"
      };
      expectedResponse['jsonProcessedResponses'] =
        [{
            name: 'Empire State Building, NY',
            confidence: 'High',
            lat: 40.7484359741211,
            long: -73.9858093261719,
            address:
              {
                adminDistrict: 'NY',
                countryRegion: 'United States',
                formattedAddress: 'Empire State Building, NY',
                locality: 'New York'
              },
          },
        ];
      let responseBack = latLong.processBingLatLongResponse(input);
      assert.deepEqual(responseBack, expectedResponse);
    });

    it('error missing resourceSets', async function() {
      input = {
        authenticationResultCode: "ValidCredentials",
        brandLogoUri: "http://dev.virtualearth.net/Branding/logo_powered_by.png",
        copyright: "Copyright © 2018",
        statusCode: 200,
        statusDescription: "OK",
        traceId:
          "traceId"
      };

      let responseBack = latLong.processBingLatLongResponse(input);
      expect(responseBack.hasOwnProperty("error")).to.equal(true);
    });

    it('error missing resources', async function() {
      input = {
        authenticationResultCode: "ValidCredentials",
        brandLogoUri: "http://dev.virtualearth.net/Branding/logo_powered_by.png",
        copyright: "Copyright © 2018",
        resourceSets: [
          { estimatedTotal: 2}
        ],
        statusCode: 200,
        statusDescription: "OK",
        traceId:
          "traceId"
      };

      let responseBack = latLong.processBingLatLongResponse(input);
      expect(responseBack.hasOwnProperty("error")).to.equal(true);
    });


  });
});

