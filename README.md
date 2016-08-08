> This repository is part of the [Pelias](https://github.com/pelias/pelias) project. Pelias is an open-source, open-data geocoder built by [Mapzen](https://www.mapzen.com/) that also powers [Mapzen Search](https://mapzen.com/projects/search). Our official user documentation is [here](https://mapzen.com/documentation/search/).

**Work In Progress**

# Polyline importer

![Travis CI Status](https://travis-ci.org/pelias/polylines.svg)
[![Gitter Chat](https://badges.gitter.im/pelias/pelias.svg)](https://gitter.im/pelias/pelias?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## Prerequisites

* NodeJS `0.12` or newer (the latest in the Node 4 series is currently recommended)
* Elasticsearch 2.3+ (support for version 1.x has been deprecated).

## Clone and Install dependencies

Since this module is just one part of our geocoder, we'd recommend starting with our [Vagrant image](https://github.com/pelias/vagrant) for quick setup, or our [full installation docs](https://github.com/pelias/pelias-doc/blob/master/installing.md) to use this module.

```bash
$ git clone https://github.com/pelias/polylines.git && cd polylines;
$ npm install
```

## Issues

If you have any issues getting set up or the documentation is missing something, please open an issue here: https://github.com/pelias/polylines/issues

## Contributing

Please fork and pull request against upstream master on a feature branch.

Pretty please; provide unit tests and script fixtures in the `test` directory.

## Code Linting

A `.jshintrc` file is provided which contains a linting config, usually your text editor will understand this config and give you inline hints on code style and readability.

These settings are strictly enforced when you do a `git commit`, you can execute `git commit` at any time to run the linter against your code.

### Running Unit Tests

```bash
$ npm test
```

### Continuous Integration

Travis tests every change against node version `0.10`, `0.12`, `4.x`, and `5.x`.
