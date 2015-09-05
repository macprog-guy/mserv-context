'use strict'

module.exports = function(service, options) {

	let handler = options && options.handler

	return function*(next, options) {

		// Make sure we have a context before yielding downstream
		this.ctx = this.ctx || {}

		// Call the global handler and let it add stuff to ctx
		if (handler) {
			if (isGeneratorFunction(handler))
				yield* handler.call(this)
			else
				handler.call(this)
		}

		// Call the action level handler and let it add stuff to ctx
		let action = options.handler || options

		if (action && typeof action === 'function') {
			if (isGeneratorFunction(handler))
				yield* action.call(this)
			else
				action.call(this)
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
