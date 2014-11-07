#!/usr/bin/env node

const path = require('path')
    , fs   = require('fs')
    , os = require('os');


const NPMRC_STORE = process.env.NPMRC_STORE || path.join(process.env.HOME || process.env.USERPROFILE, '.npmrcs')
    , NPMRC       = process.env.NPMRC || path.join(process.env.HOME || process.env.USERPROFILE, '.npmrc')
    , registries    = {
        au: 'http://registry.npmjs.org.au/'
      , eu: 'http://registry.npmjs.eu/'
      , cn: 'http://r.cnpmjs.org/'
      , defaultReg: 'https://registry.npmjs.org/'
    }
    , USAGE       = 'Usage:\n'
                  + '  npmrc                 list all profiles\n'
                  + '  npmrc [name]          change npmrc profile (uses fuzzy matching)\n'
                  + '  npmrc -c [name]       create a new npmrc profile called name\n'
                  + '  npmrc -r [registry]   use an npm mirror\n\n'
                  + 'Available mirrors for npmrc -r:\n'
                  + '  au      - Australian registry mirror\n'
                  + '  eu      - European registry mirror\n'
                  + '  cn      - Chinese registry mirror\n'
                  + '  default - Default registry\n'

var opts
  , name

function printUsage () {
  console.error(USAGE)
  process.exit(1)
}


function printHelp () {
  process.stdout.write(
      'npmrc\n'
    + '\n'
    + '  Switch between different .npmrc files with ease and grace.\n\n'
    + USAGE
    + '\n'
    + 'Example:\n\n'
    + '  # Creating and activating a new .npmrc called "work":\n'
    + '  $ npmrc -c work\n\n'
    + '  # Switch betwen "work" and "default"\n'
    + '  $ npmrc work\n'
    + '  $ npmrc default\n'
    + '  # Use the European npm mirror'
    + '  $ npmrc -r eu\n'
  )
  process.exit(1)
}


function printNpmrcs () {
  console.log('Available npmrcs:\n')
  fs.readlink(NPMRC, function (err, link) {
    link = link && path.basename(link)
    fs.readdirSync(NPMRC_STORE).forEach(function (npmrc) {
      if (npmrc[0] !== '.') {
        console.log(' %s %s', link == npmrc ? '*' : ' ', npmrc)
      }
    })
  })
}


// safety check so we don't go overwriting accidentally
function checkSymlink (stat) {
  if (!stat.isSymbolicLink()) {
    console.log('Current .npmrc (%s) is not a symlink. You may want to copy it into %s.', NPMRC, NPMRC_STORE)
    process.exit(1)
  }
}

// make the symlink
function link (name) {
  var ln = path.join(NPMRC_STORE, name || '')
    , stat

  if (ln == NPMRC_STORE || !fs.existsSync(ln)) {
    console.error('Couldn\'t find npmrc file "%s".', name)
    return process.exit(1)
  }

  try {
    stat = fs.lstatSync(NPMRC)
    checkSymlink(stat)
  } catch (e) {}

  if (stat) {
    console.log('Removing old .npmrc (%s)', path.basename(fs.readlinkSync(NPMRC)))
    fs.unlinkSync(NPMRC)
  }

  console.log('Activating .npmrc "%s"', path.basename(ln))
  fs.symlinkSync(ln, NPMRC, 'file')
}

// partial match npmrc names
function partialMatch(match, files) {
  files.sort() // own the sort order

  // try exact match
  var exactMatch = files.filter(function(file) {
    return file === match
  }).shift()
  if (exactMatch) return exactMatch

  // try starts with match
  var matchesStart = files.filter(function(file) {
    return file.indexOf(match) === 0
  }).shift()
  if (matchesStart) return matchesStart

  // try whatever match
  var matchesAnything = files.filter(function(file) {
    return file.match(new RegExp(match))
  }).shift()
  if (matchesAnything) return matchesAnything
}

// simplistic cmdline parser, sets "name" as the first non-'-' arg
// and sets "opts" as '-'-stripped characters (first char only)
;(function processCmdline () {
  opts = process.argv.slice(2).map(function (a) {
    return a[0] == '-' && a.replace(/^-+/, '')[0]
  }).filter(Boolean)

  name = process.argv.slice(2).filter(function (a) {
    return a[0] != '-'
  })[0] // first non '-' arg

  opts.filter(function (o) {
    if (o == 'c' || o == 'h' || o == 'r' || o === 'registry') // other known opts go here
      return false

    console.error('Unknown option: -' + o)
    return true
  }).length && printUsage()

  if (opts.indexOf('h') > -1)
    printHelp()
}())


// set up .npmrcs if it doesn't exist
;(function makeStore () {
  function make () {
    var def = path.join(NPMRC_STORE, 'default')

    console.log('Initialising npmrc...')
    console.log('Creating %s', NPMRC_STORE)

    fs.mkdirSync(NPMRC_STORE)

    if (fs.existsSync(NPMRC)) {
      console.log('Making %s the default npmrc file', NPMRC)
      fs.renameSync(NPMRC, def)
    } else {
      fs.writeFileSync(def, '')
    }

    link('default')
    process.exit(0)
  }

  try {
    var stat = fs.statSync(NPMRC_STORE)
    if (!stat.isDirectory()) {
      console.error('Error: %s is not a directory', NPMRC_STORE)
      process.exit(1)
    }
  } catch (e) {
    make()
  }
}())


// no name and no args
if (!name && !opts.length)
  return printNpmrcs()


;(function handleOPtions() {
  if (~opts.indexOf('c'))
    createNew()
  else if (~opts.indexOf('r') || ~opts.indexOf('registry'))
    replaceRegistry()
}())

// handle -r <name>
function replaceRegistry() {
  if (!name) {
    console.error('Specify the registry you want to use')
    return printUsage()
  }

  var registry = registries[(name === 'slow' || name === 'default') ? 'defaultReg' : name]
    , fileContents

  try {
    fs.existsSync(NPMRC)
  } catch (e) {
    console.warn('Make sure a .npmrc file exits at %s.', NPMRC)
    process.exit(1)
  }

  if (!registry) {
    console.error('%s value is not a valid registry name', name)
    printUsage()
  }

  fileContents = fs.readFileSync(NPMRC, 'utf8').split(os.EOL)

  for (var i = 0, l = fileContents.length; i <  l; i++) {
    if (~fileContents[i].indexOf('registry')) {
      fileContents[i] = 'registry = ' + registry
      break;
    }
  }

  if (i === l)
    fileContents.unshift('registry = ' + registry)
  fs.writeFileSync(NPMRC, fileContents.join(os.EOL))

  console.log('Using %s registry.', registry)
  process.exit(0)
}

// handle -c <name>
function createNew () {
  if (!name) {
    console.error('What do you want to call your new npm configuration?')
    return printUsage()
  }

  var c = path.join(NPMRC_STORE, name)
  if (fs.existsSync(c)) {
    console.log('npmrc file "%s", already exists (%s/%s)', name, NPMRC_STORE, name)
    return process.exit(1)
  }

  fs.writeFileSync(c, '')
}


if (name) name = partialMatch(name, fs.readdirSync(NPMRC_STORE)) || name

// sanity/safety check, also check if they want to switch
// to the already active one
;(function checkExisting () {
  var stat
  try {
    stat = fs.lstatSync(NPMRC)
    checkSymlink(stat)
  } catch (e) {
    // ignore
  }

  if (name && stat && fs.readlinkSync(NPMRC) == path.join(NPMRC_STORE, name)) {
    console.log('Current .npmrc (%s) is already "%s" (%s/%s)', NPMRC, name, NPMRC_STORE, name)
    return process.exit(0)
  }
}())

// if we got here, then we're ready to switch
link(name)
