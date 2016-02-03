var chai   = require('chai'),
    sinon  = require('sinon'),
    rewire = require('rewire');

var expect = chai.expect;
var assert = chai.assert;


describe("Setup", function() {
    var observer,
        loggerMock,
        device = rewire("../index");

    beforeEach(function() {
        loggerMock = sinon.stub();
        loggerMock.log = sinon.stub();

        observer = new device();
    });

    it('should do something', function() {
        assert(clientMock.observe.calledWith('commands'));
    });
});

