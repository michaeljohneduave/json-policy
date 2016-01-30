var should = require("chai").should();
var JSONPolicy = require("../index");

describe("json-policies", function() {
	var jsonPolicy = new JSONPolicy();

	it("simple boolean", function() {
		jsonPolicy.evaluate({"not" : false}).should.equal(true);	
	});

	it("complex boolean", function() {
		jsonPolicy.evaluate({ 
			"and" : [
				{"not" : {"eq" : [5, 1]}},
				{"neq" : [5, 1]},
				{"eq" : [1, 1]}
		]}).should.equal(true);	
	});

	it("simple comparisons", function() {
		jsonPolicy.evaluate({ 
			"neq" : [0, 1]
		}).should.equal(true);	

		jsonPolicy.evaluate({ 
			"lt" : [0, 1]
		}).should.equal(true);	

		jsonPolicy.evaluate({ 
			"lte" : [0, 1]
		}).should.equal(true);	

		jsonPolicy.evaluate({ 
			"lte" : [1, 1]
		}).should.equal(true);	

		jsonPolicy.evaluate({ 
			"eq" : [1, 1]
		}).should.equal(true);	

		jsonPolicy.evaluate({ 
			"gte" : [1, 1]
		}).should.equal(true);	

		jsonPolicy.evaluate({ 
			"gte" : [1, 0]
		}).should.equal(true);	

		jsonPolicy.evaluate({ 
			"gt" : [1, 0]
		}).should.equal(true);	
	});

	it("literals", function() {
		jsonPolicy.evaluate(true).should.equal(true);	
		jsonPolicy.evaluate(false).should.equal(false);	
		jsonPolicy.evaluate([true]).should.equal(true);	
		jsonPolicy.evaluate([false]).should.equal(false);	
	});

	it("if then else", function() {
		jsonPolicy.evaluate({"ifelse" : [{"neq" : ["this", "that"]}, true, false]}).should.equal(true);
	});

	it("misc functions", function() {
		jsonPolicy.evaluate({"print" : "Hello, world!"}).should.equal(true);
	});

	it("property access", function() {
		jsonPolicy.evaluate({"gt" : [25, "$a"]}, { a : 18}).should.equal(true);	
		jsonPolicy.evaluate({"gt" : [25, "$user.age"]}, { user : { age : 18}}).should.equal(true);	

		jsonPolicy.evaluate({
			"and" : [ 
				{"eq" : ["$resource.sensitivity", "classified"]},
				{"or" : [
					{"eq" : ["$user.clearance", "topsecret"]},
					{"eq" : ["$user.clearance", "secret"]},
					{"eq" : ["$user.clearance", "classified"]},
				]}
			]
		}, { 
			resource : {
				sensitivity : "classified"
			},
			user : {
				clearance : "topsecret"
			}
		}).should.equal(true);	

		jsonPolicy.evaluate({
			"and" : [ 
				{"eq" : ["$resource.sensitivity", "classified"]},
				{"mor" : ["$user.clearance", "eq", "topsecret", "secret", "classified"]},
			]
		}, { 
			resource : {
				sensitivity : "classified"
			},
			user : {
				clearance : "secret"
			}
		}).should.equal(true);	

		jsonPolicy.evaluate({
			"and" : [ 
				{"eq" : ["$resource.sensitivity", "classified"]},
				{"any" : ["$user.clearance", "topsecret", "secret", "classified"]},
			]
		}, { 
			resource : {
				sensitivity : "classified"
			},
			user : {
				clearance : "secret"
			}
		}).should.equal(true);	

	});



});