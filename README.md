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

Also it's written in posix sh, so it should work basically everywhere.

Installation
------------

``` sh
npm install -g npmrc
```

Usage
-----

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

Environment Variables
---------------------

* `NPMRC_STORE` - Path to directory of profiles. Default: `~/.npmrcs/`
* `NPMRC` - Path to the npmrc file used by npm. Default: `~/.npmrc`

License
-------

3-clause BSD. A copy is included with the source.

Contact
-------

* GitHub ([deoxxa](http://github.com/deoxxa))
* Twitter ([@deoxxa](http://twitter.com/deoxxa))
* Email ([deoxxa@fknsrs.biz](mailto:deoxxa@fknsrs.biz))
