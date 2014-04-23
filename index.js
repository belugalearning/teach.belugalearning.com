var util = require('util')
  , fs = require('fs')
  , exec = require('child_process').exec
  , cons = require('consolidate')
  , swig = require('swig')
  , express = require('express')
  , RemoteServices = require('remote-services')
  , connect = require('connect')
  , _ = require('underscore')
;

var localise = !!~process.argv.indexOf('--localise')
var remoteServices = new RemoteServices();
var serviceRole

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
    root: __dirname + '/views',
    allowErrors: true // allows errors to be thrown and caught by express instead of suppressed by Swig
});
app.set('views', __dirname + '/views');


app.get('/', function(req, res) {

    var tools = [
        {
            title: 'Geoboard',
            image: 'preview_geoboard-tool.png',
            link: '/tools/geoboard/',
            tags: [
                'square',
                'rectangle',
                'triangle',
                'equal sides'
            ]
        },
        {
            title: 'Clock',
            image: 'preview_clock-tool.png',
            link: '/tools/clock/',
            tags: [
                'time',
                'digital clock',
                'analog clock'
            ]
        },
        {
            title: 'Sorting',
            image: 'preview_sorting-tool.png',
            link: '/tools/sorting/',
            tags: [
                'sorting',
                'bar charts',
                'matching',
                'venn diagram'
            ]
        },
        {
            title: 'Division',
            image: 'preview_long-division-tool.png',
            link: '/tools/division/',
            tags: [
                'division',
                'sharing'
            ]
        },
        {
            title: 'Pie Splitter',
            image: 'preview_pie-splitter-tool.png',
            link: '/tools/piesplitter/',
            tags: [
                'fractions',
                'splitting'
            ]
        },
        {
            title: 'Splash Programming',
            image: 'preview_splash-tool.png',
            link: '/tools/splash/',
            tags: [
                'coding',
                'logic',
                'angle'
            ]
        },
        {
            title: 'Distribution',
            image: 'preview_distribution-tool.png',
            link: '',
            tags: [
                'sharing',
                'division'
            ]
        },
        {
            title: 'Counting Timer',
            image: 'preview_counting-timer-tool.png',
            link: '',
            tags: [
                'counting up',
                'counting down',
                'counting on'
            ]
        },
        {
            title: 'Place Value',
            image: 'preview_place-value-tool.png',
            link: '',
            tags: [
                'place value',
                'tens',
                'hundreds',
                'decimals'
            ]
        },
        {
            title: 'Times Table',
            image: 'preview_times-table-tool.png',
            link: '',
            tags: [
                'muliplication',
                'muliplicative relationships'
            ]
        },
        {
            title: 'Number Bonds',
            image: 'preview_number-bonds-tool.png',
            link: '',
            tags: [
                'addition',
                'repeated addition',
                'decimals',
                'place value'
            ]
        },
        {
            title: 'Number Line',
            image: 'preview_number-line-tool.png',
            link: '',
            tags: [
                'counting up',
                'counting down',
                'addition',
                'subraction',
                'repeated multiplication'
            ]
        },
        {
            title: 'Dot Grid',
            image: 'preview_dot-grid-tool.png',
            link: '',
            tags: [
                'shapes',
                'multiplication',
                'square',
                'rectangle'
            ]
        }
    ];

    res.render('index', {
        tools: tools
    });

});

app.get('/tools/:toolName/', function(req, res) {
    res.render('tool', {
        toolName: req.params.toolName
    });
});

var cache = {};
app.get('/web-client/host/src/resource.js', function(req, res) {
    var file = __dirname + '/tools-basis/web-client/host/src/resource.json';

    var cacheKey = req.query.prefixes.join('');
    var finalResources = cache[cacheKey] || {};

    if (Object.keys(finalResources).length === 0) {
        
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
         
            data = JSON.parse(data);

            _.each(req.query.prefixes, function (prefix) {
                _.each(data, function (v, k) {
                    if (k.match(prefix)) {
                        finalResources[k] = v;
                    }
                });
            });

            cache[cacheKey] = finalResources;
         
            res.send('window.bl = window.bl || {};\nwindow.bl._tool_resources = ' + JSON.stringify(finalResources))
        });
    } else {
        res.send('window.bl = window.bl || {};\nwindow.bl._tool_resources = ' + JSON.stringify(finalResources))
    }
});


app.use(express.static(__dirname))
app.use(connect.compress())
app.use('/expression-service', express.static(__dirname + '/tools-basis/expression-service'))
app.use('./content-service', express.static(__dirname + '/content-service'))
app.use('/web-client/', express.static(__dirname + '/tools-basis/web-client'))
app.use('/web-client/host', express.static(__dirname + '/tools-basis/web-client/host'))
app.use('/host-helpers/', express.static(__dirname + '/tools-basis/host-helpers'))
app.use('/shared-resources/', express.static(__dirname + '/tools-basis/shared-resources'))
app.use('/tools-tests', express.static(__dirname + '/tools-basis/tools-tests'))
app.use('/tools', express.static(__dirname + '/tools-basis/tools'))

// here's hacky way of setting the service role: find out what git branch we're on, set role to teach-[branch]
exec('git branch -a | grep "*"', { cwd: __dirname }, function(e, text) {
  var branch = text.match(/\* (\S+)/)[1]
  serviceRole = util.format('teach-%s', branch)
  console.log('serviceRole: %s', serviceRole)

  var port = app.listen(localise ? 3333 : 0).address().port;
  remoteServices.registerService(serviceRole, port);
  console.log('listening on http://127.0.0.1:%d', port)
})
