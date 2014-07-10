npmrc
=====

Switch between different .npmrc files with ease and grace.

Overview
--------

If you use a private npm registry, you know the pain of switching between a
bunch of different .npmrc files and manually managing symlinks. Let that be a
problem no more! `npmrc` is here to save the day, by making it dead simple to
switch out your .npmrc with a specific named version. It also tries to protect
you from your own stupid self by making sure you don't accidentally overwrite an
.npmrc that you actually want to keep.


Installation
------------

``` sh
npm install -g npmrc
```

Usage
-----

```
➜  ~  npmrc --help

npmrc

  Switch between different .npmrc files with ease and grace.

Usage:
  npmrc                 list all profiles
  npmrc [name]          change npmrc profile (uses fuzzy matching)
  npmrc -c [name]       create a new npmrc profile called name
  npmrc -r [registry]   use an npm mirror

Available mirrors for npmrc -r:
  au      - Australian registry mirror
  eu      - European registry mirror
  cn      - Chinese registry mirror
  default - Default registry
```

#### Initialisation

Calling `npmrc` without arguments creates an `~/.npmrcs/` directory if it doesn't exist,
and copies your current `~/.npmrc` as the 'default' .npmrc profile.

```
➜  ~  npmrc
Creating /Users/conrad/.npmrcs
Making /Users/conrad/.npmrc the default npmrc file
Activating .npmrc 'default'
```

#### Create a new .npmrc profile

```
➜  ~  npmrc -c newprofile
Removing old .npmrc (/home/rvagg/.npmrcs/default)
Activating .npmrc 'newprofile'
```

A blank profile will be created. To point your profile to a non-default registry:

```
➜  ~  npm config set registry http://npm.nodejs.org.au:5984/registry/_design/app/_rewrite
```

Then use `npm adduser` or `npm login` to authenticate with the new profile.


#### List available .npmrc profiles

```
➜  ~  npmrc 
Available npmrcs:
    
* default
  work
```

#### Switch to a specific .npmrc 

```
➜  ~  npmrc work
Removing old .npmrc (/Users/conrad/.npmrcs/default)
Activating .npmrc 'work'
```

You can also pass only the first few characters of a profile and `npmrc` will
autocomplete the profile's name.

```
➜  ~  npmrc def
Removing old .npmrc (/Users/conrad/.npmrcs/work)
Activating .npmrc 'default'
```

`npmrc <name>` will also go to some lengths to make sure you don't overwrite
anything you might care about:

```
➜  ~  npmrc default
Removing old .npmrc (/Users/conrad/.npmrcs/work)
Activating .npmrc 'default'
➜  ~  npmrc default  
Current .npmrc (/Users/conrad/.npmrc) is already 'default' (/Users/conrad/.npmrcs/default)
➜  ~  rm ~/.npmrc
➜  ~  touch ~/.npmrc
➜  ~  npmrc default
Current .npmrc (/Users/conrad/.npmrc) is not a regular file, not removing it
➜  ~  rm ~/.npmrc
➜  ~  npmrc default
Activating .npmrc 'default'
```

Note For Windows Users
----------------------

You may have to run npmrc in a shell (cmd, PowerShell, Git Bash, etc) with
elevated (Administrative) privileges to get it to run.

Environment Variables
---------------------

* `NPMRC_STORE` - Path to directory of profiles. Default: `~/.npmrcs/`
* `NPMRC` - Path to the npmrc file used by npm. Default: `~/.npmrc`

Known npm registry Mirrors
---------------------

For your convenience, you can change registries easily using the `-r`
flag. Currently we provide aliases for:

* [Australia](http://registry.npmjs.org.au/): `npmrc -r au`
* [Europe](http://registry.npmjs.eu/): `npmrc -r eu`
* [China](http://r.cnpmjs.org): `npmrc -r cn`

#### Switching registry example

```
➜  ~  npm -r eu
Using eu registry
➜  ~  npm info npmrc
npm http GET http://registry.npmjs.eu/npmrc
^C
➜  ~  npm -r default
Using default registry
➜  ~  npm info npmrc
npm http GET https://registry.npmjs.org/npmrc
^C
```

License
-------

3-clause BSD. A copy is included with the source.

Contact
-------

* GitHub ([deoxxa](http://github.com/deoxxa))
* Twitter ([@deoxxa](http://twitter.com/deoxxa))
* Email ([deoxxa@fknsrs.biz](mailto:deoxxa@fknsrs.biz))

Awesome People
--------------

* Jaime "the binary wizard" Pillora ([github](https://github.com/jpillora))
* Tim "two hands" Oxley ([github](https://github.com/timoxley))
* Jakob "fastest blur in the west" Krigovsky ([github](https://github.com/SonicHedgehog))
* Rod "the destroyer" Vagg ([github](https://github.com/rvagg))
* Eugene "ludicrous gibs" Asiedu ([github](https://github.com/ngenerio))
