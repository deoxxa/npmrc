const test    = require('tape')
    , path    = require('path')
    , fs      = require('fs')
    , rimraf  = require('rimraf')
    , mkdirp  = require('mkdirp')
    , tmpdir  = require('os').tmpDir()
    , exec    = require('child_process').exec
    , xtend   = require('xtend')

    , cmd     = '"' + process.execPath + '" '
                + path.join(__dirname, 'npmrc.js')
    , homedir = path.join(tmpdir, 'npmrcs_test.' + process.pid)
    , options = { env: xtend(process.env, { HOME: homedir }) }
    , npmrc   = path.join(homedir, '.npmrc')
    , npmrcs  = path.join(homedir, '.npmrcs')
    , def     = path.join(homedir, '.npmrcs/default')


function cleanup (t) {
  rimraf(homedir, t.end.bind(t))
}


test('blank slate', function (t) {
  mkdirp.sync(homedir)

  exec(cmd, options, function (err, stdout, stderr) {
    t.notOk(err, 'no error')
    t.equal(stderr, '', 'no stderr')
    t.ok(/Initialising/.test(stdout), 'got "initialising" msg')
    t.ok(/Creating .*\.npmrcs/.test(stdout), 'got "creating" msg')
    t.ok(/Activating .npmrc "default"/, 'got "activating" msg')
    t.end()
  })
})

test('cleanup', cleanup)


test('standard .npmrcs', function (t) {
  mkdirp.sync(homedir)
  fs.writeFileSync(npmrc, 'foobar', 'utf8')

  exec(cmd, options, function (err, stdout, stderr) {
    t.notOk(err, 'no error')
    t.equal(stderr, '', 'no stderr')
    t.ok(/Initialising/.test(stdout), 'got "initialising" msg')
    t.ok(/Creating .*\.npmrcs/.test(stdout), 'got "creating" msg')
    t.ok(/Activating .npmrc "default"/, 'got "activating" msg')
    t.ok(/Making .*\.npmrc the default/, 'got "making default" msg')
    t.equal(fs.readFileSync(npmrc, 'utf8'), 'foobar', 'got expected contents of .npmrc')
    t.equal(fs.readFileSync(def, 'utf8'), 'foobar', 'got expected contents of .npmrcs/default')
    t.ok(fs.lstatSync(npmrc).isSymbolicLink(), '.npmrc is symlink')
    t.equal(fs.readlinkSync(npmrc), def, '.npmrc points to "default"')
    t.deepEqual(fs.readdirSync(npmrcs), [ 'default' ], 'only "default" in .npmrcs')
    t.end()
  })
})


test('create noarg', function (t) {
  exec(cmd + ' -c', options, function (err, stdout, stderr) {
    t.ok(err, 'got error')
    t.equal(err.code, 1, 'got correct exit code')
    t.equal(stdout, '', 'no stdout')
    t.ok(/Usage/.test(stderr), 'got Usage')
    t.equal(fs.readFileSync(npmrc, 'utf8'), 'foobar', 'got expected contents of .npmrc')
    t.deepEqual(fs.readdirSync(npmrcs), [ 'default' ], 'only "default" in .npmrcs')
    t.end()
  })
})


test('create new config', function (t) {
  var foobar = path.join(npmrcs, 'foobar')
  exec(cmd + ' -c foobar', options, function (err, stdout, stderr) {
    t.notOk(err, 'no error')
    t.equal(stderr, '', 'no stderr')
    t.ok(/Removing old .+\Wdefault\W/.test(stdout), 'got "removing" msg')
    t.ok(/Activating .npmrc "foobar"/.test(stdout), 'got "activating" msg')
    t.equal(fs.readFileSync(npmrc, 'utf8'), '', 'got expected contents of .npmrc')
    t.equal(fs.readFileSync(def, 'utf8'), 'foobar', 'got expected contents of .npmrcs/default')
    t.equal(fs.readFileSync(foobar, 'utf8'), '', 'got expected contents of .npmrcs/foobar')
    t.ok(fs.lstatSync(npmrc).isSymbolicLink(), '.npmrc is symlink')
    t.equal(fs.readlinkSync(npmrc), foobar, '.npmrc points to "foobar"')
    t.deepEqual(fs.readdirSync(npmrcs), [ 'default', 'foobar' ], '"default" and "foobar" in .npmrcs')
    t.end()
  })
})


test('switch config', function (t) {
  var foobar = path.join(npmrcs, 'foobar')
  exec(cmd + ' default', options, function (err, stdout, stderr) {
    t.notOk(err, 'no error')
    t.equal(stderr, '', 'no stderr')
    t.ok(/Removing old .+\Wfoobar\W/.test(stdout), 'got "removing" msg')
    t.ok(/Activating .npmrc "default"/.test(stdout), 'got "activating" msg')
    t.equal(fs.readFileSync(npmrc, 'utf8'), 'foobar', 'got expected contents of .npmrc')
    t.equal(fs.readFileSync(def, 'utf8'), 'foobar', 'got expected contents of .npmrcs/default')
    t.equal(fs.readFileSync(foobar, 'utf8'), '', 'got expected contents of .npmrcs/foobar')
    t.ok(fs.lstatSync(npmrc).isSymbolicLink(), '.npmrc is symlink')
    t.equal(fs.readlinkSync(npmrc), def, '.npmrc points to "foobar"')
    t.deepEqual(fs.readdirSync(npmrcs), [ 'default', 'foobar' ], '"default" and "foobar" in .npmrcs')
    t.end()
  })
})


test('list config', function (t) {
  var foobar = path.join(npmrcs, 'foobar')
  exec(cmd, options, function (err, stdout, stderr) {
    t.notOk(err, 'no error')
    t.equal(stderr, '', 'no stderr')
    t.ok(/Available npmrcs/.test(stdout), 'got "available" msg')
    t.ok((/\* default$/m).test(stdout), 'listed "default"')
    t.ok((/  foobar$/m).test(stdout), 'listed "foobar"')
    t.end()
  })
})


test('switch to non-existent config', function (t) {
  var foobar = path.join(npmrcs, 'foobar')
  exec(cmd + ' doobar', options, function (err, stdout, stderr) {
    t.ok(err, 'got error')
    t.equal(err.code, 1, 'got correct exit code')
    t.equal(stdout, '', 'no stdout')
    t.ok(/Couldn't find npmrc file .+doobar/.test(stderr), 'got expected error message')
    t.end()
  })
})

test('cleanup', cleanup)
