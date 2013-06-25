var util = require('util')
  , fs = require('fs')
  , cons = require('consolidate')
  , swig = require('swig')
  , express = require('express')
  , seaport = require('seaport')
;

var localise = !!~process.argv.indexOf('--localise')

var seaportServiceName = 'teach-dev'

var app = express()
app.use(express.cookieParser())
app.use(express.session({
  key: 'beluga-teach-sid', 
  secret: 'bdae701ef257c3d7bc2cf2b2f1fbf16f842470b775308ac02d27e82a31c3ebafd22d24b90ea4cac7cd27389ea598629b',
  cookie: { maxAge: 1000 * 60 * 30 }
}))
app.use(express.bodyParser())

app.engine('.html', cons.swig);
app.set('view engine', 'html');

// NOTE: Swig requires some extra setup
// This helps it know where to look for includes and parent templates
swig.init({
    root: 'views/',
    allowErrors: true // allows errors to be thrown and caught by express instead of suppressed by Swig
});
app.set('views', 'views/');


app.use(express.static(__dirname))
app.use('/web-client/', express.static(__dirname + '/components/tools-basis/web-client'))
app.use('/web-client/host', express.static(__dirname + '/components/tools-basis/web-client/host'))
app.use('/host-helpers/', express.static(__dirname + '/components/tools-basis/host-helpers'))
app.use('/shared-resources/', express.static(__dirname + '/components/tools-basis/shared-resources'))
app.use('/tools-tests', express.static(__dirname + '/components/tools-basis/tools-tests'))

app.get('/', function(req, res) {
    res.render('index', {});
});

app.get('/tools/geoboard/', function(req, res) {
    res.render('geoboard', {});
});

var ports = seaport.connect('127.0.0.1', 9090)
var port = localise ? 3333 : ports.register(seaportServiceName)
app.listen(port)
console.log('listening on http://127.0.0.1:%d', port)
