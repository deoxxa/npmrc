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

Usage
-----

`npmrc` by default looks for profiles in `~/.npmrcs/`, but this can be
overridden with the `NPMRC_STORE` environment variable. It also, by default,
thinks that .npmrc is in `~/.npmrc`, but this can be overridden with the `NPMRC`
environment variable.

Use `npmrc` on its own to list your .npmrc profiles. It works like so:

```
➜  ~  npmrc 
Available npmrcs:
    
* public
  work
```

Use `npmrc <name>` to switch to a specific .npmrc file. It looks like this:

```
➜  ~  npmrc work
Removing old .npmrc (/Users/conrad/.npmrcs/public)
Activating .npmrc 'work'
```

`npmrc <name>` will also go to some lengths to make sure you don't overwrite
anything you might care about.

```
➜  ~  npmrc public
Removing old .npmrc (/Users/conrad/.npmrcs/work)
Activating .npmrc 'public'
➜  ~  npmrc public  
Current .npmrc (/Users/conrad/.npmrc) is already 'public' (/Users/conrad/.npmrcs/public)
➜  ~  rm ~/.npmrc
➜  ~  touch ~/.npmrc
➜  ~  npmrc public
Current .npmrc (/Users/conrad/.npmrc) is not a regular file, not removing it
➜  ~  rm ~/.npmrc
➜  ~  npmrc public
Activating .npmrc 'public'
```

License
-------

3-clause BSD. A copy is included with the source.

Contact
-------

* GitHub ([deoxxa](http://github.com/deoxxa))
* Twitter ([@deoxxa](http://twitter.com/deoxxa))
* ADN ([@deoxxa](https://alpha.app.net/deoxxa))
* Email ([deoxxa@fknsrs.biz](mailto:deoxxa@fknsrs.biz))
