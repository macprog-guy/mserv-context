# Introduction
mserv-context is [mserv](https://github.com/macprog-guy/mserv) middleware that an empty `ctx` property to the message handling context. It can then be populated with arbitrary data on a per-request basis.

# Installation

	$ npm i --save mserv-context

# Usage

```js

var context  = require('mserv-context'),
	service  = require('mserv')(),
	pg       = require('pg-promise'),
	postgres = pg()('postges://localhost/dev')

service.use('context', context, {
	handler: function*() {
		// Now the middleware and action handlers have access to postgres
		this.ctx.postgres = postgres
	}
})

```

# Global Context Handlers

With version `0.2.1`, it became possible to register additional global context handlers.
This can be useful if you want you own middleware to add global context or just to keep
code where it belongs as opposed to some large setup function.

```js

service.ext.context(function*(){
	this.ctx.foo = 789
})
```


# Action Specific Context

Actions can have their own context handlers that get executed after the global handler.
There are two ways to declare custom exception handlers. Either with a key whose value is
a function or an object with a `handler` key whose value is a function.

```js

service.action({
	name: 'foo',
	context: function*() {
		if (this.req.userId)
			this.ctx.user = yield this.invoke('user.fetch.byId', {id:this.req.userId})
	},
	handler: function*() {
		// ...
	}
})

```

