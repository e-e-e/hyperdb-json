# hyperdb-json

A JSON-like interface for [hyperdb](https://github.com/mafintosh/hyperdb).

This is a simple wrapper which lets you `set` and `get` complex objects as key/value mapped prefixes in a hyperdb instance.

**TODO:**

- [ ] add support for conflicts
- [ ] overwrite old values on set
- [ ] add .delete()
- [ ] add .update()

## Installation

```bash
npm install hyperdb-json
```

### Usage

```js
var hyperdb = require('hyperdb')
var HyperJson = require('hyperdb-json')
var ram = require('random-access-memory')

var ramStore = () => ram()
var db = hyperdb(ramStore)
var json = HyperJson(db)

db.on('ready', () => {
  var bar = {
    x: [3, { a: 1 }],
    y: {
      b: ['it’s', 'good'],
      c: 'ok'
    }
  }
  hyperJson.set('foo', bar, (err) => {
    hyperJson.get('foo', (err, data) => {
      console.log(data)
    })
  })
})
```
