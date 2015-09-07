'use strict'

module.exports = function(service, options) {

	let extname  = options.extension || 'context',
		handlers = []

	if (options && options.handler && typeof options.handler === 'function')
		handlers.push(options.handler)

	service.extend(extname, function(service, options){
		return function(genFunc) {
			handlers.push(genFunc)
		}
	})


	return function*(next, options) {

		// Make sure we have a context before yielding downstream
		this.ctx = this.ctx || {}

		// The handler list is handlers + action
		let handlerList   = handlers,
			actionHandler = options

		if (options && typeof options !== 'function')
			actionHandler = options.handler

		if (actionHandler && typeof actionHandler === 'function')
			handlerList = handlerList.concat([actionHandler])

		// Call the all handlers and let them add stuff to ctx
		for (let i in handlerList) {
			let handler = handlerList[i]
			if (isGeneratorFunction(handler))
				yield* handler.call(this)
			else
				handler.call(this)
		}
		
		// Yield to downstream middleware
		return yield next
	}
}


/**

  Extracted directly from the co library.

 */
function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}

function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}
