var throng = require("throng")
var path = require("path")

var WORKERS = process.env.WEB_CONCURRENCY || 1
var PORT = process.env.PORT || 3000
var CACHE_FOR = 3600
var PUBLIC = path.join(__dirname, "public")

function worker(id) {
  var http = require("http")
  var static = require("node-static")
  var file = new static.Server(PUBLIC, { cache: CACHE_FOR })

  console.log("Booting server #" + id)

  http
    .createServer(function (request, response) {
      request
        .addListener("end", function () {
          file.serve(request, response)
        })
        .resume()
    })
    .listen(PORT)
}

throng(WORKERS, worker)
