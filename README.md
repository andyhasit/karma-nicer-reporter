A nicer reporter for [Karma](http://karma-runner.github.io/0.13/index.html).

#Why

Although [Karma](http://karma-runner.github.io/0.13/index.html) is awesome, it's default reporter  (__progress__) isn't that great.

So I made the __nicer__ reporter which:

  - Shows a nice color-coded summary with the number of tests passed | failed | skipped in each spec.
  - Shows more clearly where the error occured.
  - Reduces noise by only printing failed tests (+ the summary)
  - Has customisable colors.



#Screenshots

These two screenshots were run on the same test suite (included in this repo) using  ConEmu on Windows as console.

#####Karma's default __"progress"__ reporter:

![Karma's default output](screenshots/normal.jpg?raw=true "")

#####The __"nicer"__ reporter:

![Karma's default output](screenshots/nicer.jpg?raw=true "")


#Installation


Karma nicer reporter is available on __npm__ so just run:

    npm install karma-nicer-reporter --save-dev
    

#Usage

In your karma configuration file include __nicer__ as a (or the) reporter.

    ...
    reporters: ['nicer'],
    ...
    
#Configuration

Adding a __nicerReporter__ entry in your karma configuration file, you can override the default colors (which come from [chalk](https://github.com/chalk/chalk)).

    ...
    nicerReporter : {
      defaulColor: 'cyan',
      successColor: 'green',
      failColor: 'red',
      skipColor: 'yellow',
      errorLogColor: 'white'
    }
    ...


#Development

There is an example __karma.conf.js__ and some example specs you can run to see the output. These are best run using:

    gulp test
    
Which overwrites __index.js__ in the __node_modules__ folder before running __karma start__.

Pull requests welcome.

#Roadmap

One feature missing is times for individual tests, which isn't there because we don't print individual tests unless they fail. Perhaps it could be included as a second runner.

Also, this has only been tested with:

    autoWatch: false,
    singleRun: true,

And not in any CI enviroment.

#Licence

MIT

