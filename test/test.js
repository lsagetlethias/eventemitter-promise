'use strict';

const   EventEmitter = require('../dist_node/EventEmitter').EventEmitter,
        mocha = require('mocha'),
        should = require('should');

console.log(EventEmitter);

describe('EventEmitter', () => {
    describe('on/emit event => event', () => {
        it('should emit and listen on event', done => {
            class Test extends EventEmitter {

            }

            let test = new Test();
            test.on('event').then(anything => {
                anything.should.be.eql('test');
                done();
            });

            test.emit('event', 'test');
        });

        it('should emit on event and listen on event.test', done => {
            class Test extends EventEmitter {

            }

            let test = new Test();
            test.on('event.test').then(anything => {
                anything.should.be.eql('test');
                done();
            });

            test.emit('event', 'test');
        });

        it('should emit on event.test and listen on event', done => {
            class Test extends EventEmitter {

            }

            let test = new Test();
            test.on('event').then(anything => {
                anything.should.be.eql('test');
                done();
            });

            test.emit('event.test', 'test');
        });


        it('should emit on "tneve" and listen on event without receiving', done => {
            class Test extends EventEmitter {

            }

            let test = new Test();
            test.on('event').then(anything => {
                anything.should.not.be.eql('test');
                done(new Error('Should not be here.'));
            });

            test.emit('tneve', 'test');
            done();
        });
    });

    describe('on/emit event.* => event.*', () => {
        it('should emit and listen on event', done => {
            class Test extends EventEmitter {

            }

            let test = new Test();
            test.on('event.test').then(anything => {
                anything.should.be.eql('test');
                done();
            });

            test.emit('event.test', 'test');
        });

        it('should emit on event and listen on event.test', done => {
            class Test extends EventEmitter {

            }

            let test = new Test();
            test.on('event.test').then(anything => {
                anything.should.be.eql('test');
                done();
            });

            test.emit('event', 'test');
        });

        it('should emit on event.test and listen on event', done => {
            class Test extends EventEmitter {

            }

            let test = new Test();
            test.on('event').then(anything => {
                anything.should.be.eql('test');
                done();
            });

            test.emit('event.test', 'test');
        });


        it('should emit on "tneve" and listen on event without receiving', done => {
            class Test extends EventEmitter {

            }

            let test = new Test();
            test.on('event').then(anything => {
                anything.should.not.be.eql('test');
                done(new Error('Should not be here.'));
            });

            test.emit('tneve', 'test');
            done();
        });
    });

});
