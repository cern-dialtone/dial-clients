
# Dial Webapp

![Screenshot](screenshot.png)

Dial is a webapp built using React whose purpose is making and receive calls among other features.

## Status

[![Build Status](https://travis-ci.org/cern-phone-apps/desktop-phone-app.svg?branch=master)](https://travis-ci.org/cern-phone-apps/desktop-phone-app)
[![Dependency Status](https://david-dm.org/cern-phone-apps/desktop-phone-app.svg)](https://david-dm.org/cern-phone-apps/desktop-phone-app)
[![Maintainability](https://api.codeclimate.com/v1/badges/da59b244235bb64bfe28/maintainability)](https://codeclimate.com/github/cern-phone-apps/desktop-phone-app/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/da59b244235bb64bfe28/test_coverage)](https://codeclimate.com/github/cern-phone-apps/desktop-phone-app/test_coverage)
[![codecov](https://codecov.io/gh/cern-phone-apps/desktop-phone-app/branch/master/graph/badge.svg)](https://codecov.io/gh/cern-phone-apps/desktop-phone-app)


## Development

- [Requirements](#requirements)
- [Read the docs](#read-the-docs)
- [Install dependencies](#install-dependencies)
- [Creating the .env configuration files](#creating-the-env-configuration-files)
- [Setting up the mock server](#setting-up-the-mock-server)
    - [Mock Server methods](#mock-server-methods)
- [Adding your own API Client](#adding-your-own-api-client)
- [Run the application](#run-the-application)
- [Testing the application](#testing-the-application)
    - [Unit tests](#unit-tests)
    - [Integration tests](#integration-tests)

### Requirements

- node >= v11.10
- yarn >= 1.17.3

### 0. Read the docs

- [Contributing Guidelines](docs/CONTRIBUTING.md)
- [Git Basics](docs/git-basics.md)

### 1. Install dependencies

```bash
yarn install
```

## 2. Creating the config.js configuration file

This project gets the configuration from the `src/config.js` file.
There is a `config.sample.js` file that can be used as example.

This file includes several enviroments that must be set:

- prod
- next
- dev
- test

## Setting up the mock server

    ⚠️ TODO: Update the responses from the server

The mock server simulates the behaviour of a backend server by providing some sample responses.

Then run the server:

```bash
yarn run mock-server
```

More info about this server: https://github.com/smollweide/node-mock-server#readme

### Mock Server methods

* GET `/OAuth/Authorize`
* POST `/auth/v1/login/`
* DELETE `/auth/v1/logout/`
* GET `/api/v1/users/me/`
* GET `/api/v1/numbers/`
* GET `/api/v1/users/search/`
* GET `/api/v1/users/`

## Adding your own API Client

    ⚠️ TODO: Update this section

This application uses an API to connect to the telephony backend (Called TONE) but it can be
customize with your own library. To add it, you can use the `src/third-party` folder and
then reference it using the environment variable `REACT_APP_TONE_API_PATH` to set
a path to the file.

## Run the application

* `yarn electron-start`: Runs the application on development mode.

### Run the application in debug mode using Visual Studio Code

The project configuration is defined in the .vscode folder. In this folder we have configured the Visual Studio Code debugger with a launch.json file. To run it in debug mode just go to the "bug" icon in the Visual Studio code and click on the start server.

## Testing the application

Application can be tested in two different ways:

* Using [Jest](https://jestjs.io/) to run the tests.
* Using [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) for the unit testing.

### Unit tests

Tests are located in each component folder.

In order to run them:

```bash
yarn test
```

#### Coverage testing

To test the modified files:

```bash
yarn test --coverage
```

To test all the files:

```bash
yarn test --coverage --watchAll
```

## Continuous Integration

- The code is tested on every push and PR
- Code coverage using [CodeCov](https://codecov.io/) is also triggered and if the coverage decreases, the CI will fail.

## Packaging and Deployment

### Next

`electron-builder-next.json` file is used to pack the application in `NEXT` mode.

- `electron-pack-next`: Generates packages for Mac, Windows and Linux on the `dist` dir. Sets `REACT_APP_NEXT` to true.
- `publish-next`: Publish the current version of the app in Github releases, but enables the "beta" channel.

### Production

Create a `electorn-builder.env` file with the following values:

- `GH_TOKEN`: This token is required to deploy the application on Github. It can be generated here: https://github.com/settings/tokens/new and the scope must be repository.
- `WIN_CSC_LINK`: Path to the `.p12` code signing certificate.
- `WIN_CSC_KEY_PASSWORD`: Password for the `WIN_CSC_LINK` certificate.

Create a `.env` file with the following values:

- `APPLEID`: Apple ID email used in the Apple developer portal.
- `APPLEIDPASS`: Apple ID password.

These two values are used for notarizing the application:
    - More info in [this Blog](https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/) and in [the Apple Docs](https://developer.apple.com/documentation/security/notarizing_your_app_before_distribution)

#### Commands

- `yarn electron-pack`: Generates packages for Mac, Windows and Linux on the `dist` dir.
- `yarn publish-prod`: Publish the current version of the app in Github releases on the repository. It will be a `draft` and not visible to the users.

#### Release Channels

From electron-builder docs: https://www.electron.build/tutorials/release-using-channels

The following versions will be distributed to users depending on the channel defined:

- `Release` : users will get the latest release version
- `Prerelease`: users will get the latest prerelease version

##### How To Use It

Imagine that your application is stable and in version `1.0.1`.

If you want to release a beta for the new `1.1.0` version, you only need to publish a prerelease.

When your application is stable enough, you want to release it to all users. For that, you only need to publish it as release.

#### How to clean all the build releases

Run the following command on `webapp` folder (this one).
```
xattr -cr .
```

### Steps to generate the propper AppImage

We had some difficulties when we tried to install our AppImage in `Centos 7`.

By default the application was launched in a sandbox, which was making it crash. This is a kernel level configuration.

If you take a look at our `build` section in `package.json`, you will find this command : `afterAllArtifactBuild`

This command is launched right after the entire packaging step. It will call a function (docker/configure_appimage.js).

This function will generate a docker image (docker/dockerfile) if it doesn't exists yet.

This Docker Image has an entrypoint on a bash file that will add `--no-sandbox` option to the AppImage.

`A volume attached to ***dist/*** will be used to get and modify the AppImage.`

Then, once the docker image generated, the same function will get the docker image ID and launch it.

`It will use the latest file matching this : dist/cern-phone-app-*-x86-64-linux.AppImage`

You will see some logs during the packaging step related to this part.

Every steps related to this part are in `docker/`.

## Other Docs

- [Create React App Docs (Local)](docs/react.md)
