var chai    = require('chai'),
	should  = chai.should(),
	service = require('mserv')({amqp:false}),
    context = require('.'),
	array   = []

service.use('context', context, {
	handler: function() {
		this.ctx.foo = 123
	}
})

service.action({
	name: 'check',
	context: function() {
		this.ctx.bar = 456
	},
	handler: function*() {
		array.push(this.ctx.foo)
		array.push(this.ctx.bar)
	}
})


describe('mserv-context', function(){

	beforeEach(function(done){
		array = []
		done()
	})

	it('context should contain a foo value', function(done){
		service.script(function*(){
			try {
				yield this.invoke('check')
				array.should.eql([123,456])
				done()
			}
			catch(err) {
				done(err)
			}
		})
	})
})