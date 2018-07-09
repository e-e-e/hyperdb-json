var test = require('tape')
var hyperdb = require('hyperdb')
var ram = require('random-access-memory')
var HyperJson = require('./index')

var ramStore = () => ram()

test('simple set', (t) => {
  var db = hyperdb(ramStore)
  var indexer = HyperJson(db)
  db.on('ready', () => {
    var x = [3]
    indexer.set('x', x, (err) => {
      t.error(err)
      db.get('x[]/0', (err, nodes) => {
        t.error(err)
        t.same(nodes[0].value.toString(), '3')
        t.end()
      })
    })
  })
})

test('set and get', (t) => {
  var db = hyperdb(ramStore)
  var indexer = HyperJson(db)
  db.on('ready', () => {
    var x = {
      x: [3, { a: 1 }],
      y: {
        b: ['not', 'good'],
        c: 'ok'
      }
    }
    indexer.set('content', x, (err) => {
      t.error(err)
      indexer.get('content', (err, data) => {
        t.error(err)
        t.same(data, x)
        t.end()
      })
    })
  })
})
