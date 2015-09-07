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
	foo: {
		bar:3
	},
	context: {
		handler: function() {
			this.ctx.bar = 456
		}
	},
	handler: function*() {
		array.push(this.ctx.foo)
		array.push(this.ctx.bar)
		array.push(this.ctx.baz)
	}
})

service.ext.context(function*(){
	this.ctx.baz = 789
})


describe('mserv-context', function(){

	beforeEach(function(done){
		array = []
		done()
	})

	it('array should contain a three values', function(done){
		service.script(function*(){
			try {
				yield this.invoke('check')
				array.should.eql([123,456,789])
				done()
			}
			catch(err) {
				done(err)
			}
		})
	})
})