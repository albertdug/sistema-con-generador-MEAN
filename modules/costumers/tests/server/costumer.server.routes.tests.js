'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Costumer = mongoose.model('Costumer'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, costumer;

/**
 * Costumer routes tests
 */
describe('Costumer CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Costumer
    user.save(function () {
      costumer = {
        name: 'Costumer name'
      };

      done();
    });
  });

  it('should be able to save a Costumer if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Costumer
        agent.post('/api/costumers')
          .send(costumer)
          .expect(200)
          .end(function (costumerSaveErr, costumerSaveRes) {
            // Handle Costumer save error
            if (costumerSaveErr) {
              return done(costumerSaveErr);
            }

            // Get a list of Costumers
            agent.get('/api/costumers')
              .end(function (costumersGetErr, costumersGetRes) {
                // Handle Costumer save error
                if (costumersGetErr) {
                  return done(costumersGetErr);
                }

                // Get Costumers list
                var costumers = costumersGetRes.body;

                // Set assertions
                (costumers[0].user._id).should.equal(userId);
                (costumers[0].name).should.match('Costumer name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Costumer if not logged in', function (done) {
    agent.post('/api/costumers')
      .send(costumer)
      .expect(403)
      .end(function (costumerSaveErr, costumerSaveRes) {
        // Call the assertion callback
        done(costumerSaveErr);
      });
  });

  it('should not be able to save an Costumer if no name is provided', function (done) {
    // Invalidate name field
    costumer.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Costumer
        agent.post('/api/costumers')
          .send(costumer)
          .expect(400)
          .end(function (costumerSaveErr, costumerSaveRes) {
            // Set message assertion
            (costumerSaveRes.body.message).should.match('Please fill Costumer name');

            // Handle Costumer save error
            done(costumerSaveErr);
          });
      });
  });

  it('should be able to update an Costumer if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Costumer
        agent.post('/api/costumers')
          .send(costumer)
          .expect(200)
          .end(function (costumerSaveErr, costumerSaveRes) {
            // Handle Costumer save error
            if (costumerSaveErr) {
              return done(costumerSaveErr);
            }

            // Update Costumer name
            costumer.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Costumer
            agent.put('/api/costumers/' + costumerSaveRes.body._id)
              .send(costumer)
              .expect(200)
              .end(function (costumerUpdateErr, costumerUpdateRes) {
                // Handle Costumer update error
                if (costumerUpdateErr) {
                  return done(costumerUpdateErr);
                }

                // Set assertions
                (costumerUpdateRes.body._id).should.equal(costumerSaveRes.body._id);
                (costumerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Costumers if not signed in', function (done) {
    // Create new Costumer model instance
    var costumerObj = new Costumer(costumer);

    // Save the costumer
    costumerObj.save(function () {
      // Request Costumers
      request(app).get('/api/costumers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Costumer if not signed in', function (done) {
    // Create new Costumer model instance
    var costumerObj = new Costumer(costumer);

    // Save the Costumer
    costumerObj.save(function () {
      request(app).get('/api/costumers/' + costumerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', costumer.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Costumer with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/costumers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Costumer is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Costumer which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Costumer
    request(app).get('/api/costumers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Costumer with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Costumer if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Costumer
        agent.post('/api/costumers')
          .send(costumer)
          .expect(200)
          .end(function (costumerSaveErr, costumerSaveRes) {
            // Handle Costumer save error
            if (costumerSaveErr) {
              return done(costumerSaveErr);
            }

            // Delete an existing Costumer
            agent.delete('/api/costumers/' + costumerSaveRes.body._id)
              .send(costumer)
              .expect(200)
              .end(function (costumerDeleteErr, costumerDeleteRes) {
                // Handle costumer error error
                if (costumerDeleteErr) {
                  return done(costumerDeleteErr);
                }

                // Set assertions
                (costumerDeleteRes.body._id).should.equal(costumerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Costumer if not signed in', function (done) {
    // Set Costumer user
    costumer.user = user;

    // Create new Costumer model instance
    var costumerObj = new Costumer(costumer);

    // Save the Costumer
    costumerObj.save(function () {
      // Try deleting Costumer
      request(app).delete('/api/costumers/' + costumerObj._id)
        .expect(403)
        .end(function (costumerDeleteErr, costumerDeleteRes) {
          // Set message assertion
          (costumerDeleteRes.body.message).should.match('User is not authorized');

          // Handle Costumer error error
          done(costumerDeleteErr);
        });

    });
  });

  it('should be able to get a single Costumer that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Costumer
          agent.post('/api/costumers')
            .send(costumer)
            .expect(200)
            .end(function (costumerSaveErr, costumerSaveRes) {
              // Handle Costumer save error
              if (costumerSaveErr) {
                return done(costumerSaveErr);
              }

              // Set assertions on new Costumer
              (costumerSaveRes.body.name).should.equal(costumer.name);
              should.exist(costumerSaveRes.body.user);
              should.equal(costumerSaveRes.body.user._id, orphanId);

              // force the Costumer to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Costumer
                    agent.get('/api/costumers/' + costumerSaveRes.body._id)
                      .expect(200)
                      .end(function (costumerInfoErr, costumerInfoRes) {
                        // Handle Costumer error
                        if (costumerInfoErr) {
                          return done(costumerInfoErr);
                        }

                        // Set assertions
                        (costumerInfoRes.body._id).should.equal(costumerSaveRes.body._id);
                        (costumerInfoRes.body.name).should.equal(costumer.name);
                        should.equal(costumerInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Costumer.remove().exec(done);
    });
  });
});
