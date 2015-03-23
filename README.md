# Devkit Helper

Helper modules and functions for Game Closure devkit.

## Modules
* Model
* History
* i18n
* [Tutorial](https://medium.com/engineering-hashcube/tutorial-design-and-implementation-for-games-36cd919a000)
* Loading - Show loading screen and automatically hide it when view is ready.
* Timer - Wrapper around setInterval.
* Modelpool - Re-use model objects.
* Test - Expose private functions for unit testing.
* Storage - Wrapper around HTML5 localStorage.

## License
MIT

## Todo
- [ ] Better documentation, with HOWTOs
- [ ] Move loading view out of the module
- [ ] Make tutorial module completely independent

## running tests

`npm install mocha jsdom@^3.1.1` if you haven't installed globally

in devkit 2
`ln -s .. modules`(.. is path to modules folder with devkit-core)

then run

`mocha test`

To run test on a single file use

`mocha test/mocha-opts.js yourfile.js`
