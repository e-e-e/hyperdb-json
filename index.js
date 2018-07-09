function HyperJson (db) {
  if (!(this instanceof HyperJson)) return new HyperJson(db)
  this.db = db
}

HyperJson.prototype.set = function (prefix, obj, cb) {
  // TODO: handle overwriting previous object - clean up diff
  let pending = 0
  if (typeof obj === 'number') return this.db.put(prefix, obj.toString(), cb)
  if (typeof obj === 'string') return this.db.put(prefix, `"${obj}"`, cb)
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      pending++
      this.set(`${prefix}[]/${i}`, v, maybeDone)
    })
    return
  }
  Object.keys(obj).forEach((key) => {
    pending++
    this.set(`${prefix}/${key}`, obj[key], maybeDone)
  })
  if (!pending) cb()
  function maybeDone () {
    if (--pending) return
    cb()
  }
}

function pathIsArray (path) {
  const match = path.match(/(.+)\[\]$/)
  return !!match
}
function sanitizePath (path) {
  const match = path.match(/(.+)\[\]$/)
  if (!match) return path
  return match[1]
}

function decodeValue (value) {
  return JSON.parse(value.toString())
}

HyperJson.prototype.get = function (prefix, cb) {
  // TODO: handle conflicts
  let obj = null
  const stream = this.db.createReadStream(prefix, { gt: true })
  stream.on('data', (data) => {
    if (!obj) obj = {}
    const path = data[0].key.split('/')
    path.reduce((o, p, i) => {
      if (i === 0) return o
      const name = sanitizePath(p)
      if (i === path.length - 1) {
        o[name] = decodeValue(data[0].value)
        return
      }
      if (!o[name]) {
        o[name] = pathIsArray(p) ? [] : {}
      }
      return o[name]
    }, obj)
  })
  stream.on('error', cb)
  stream.on('end', () => {
    cb(null, obj)
  })
}

module.exports = HyperJson
