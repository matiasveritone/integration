# integration
veritone integration


Just download de repo, run `npm install` then run `node app.js`


I had a configuration error which it's supposed to be caused by my ubuntu version 22.xx
It was fixed by running `export OPENSSL_CONF=/dev/null` before node run.

Such error was:
`ERROR: Error: error:25066067:DSO support routines:dlfcn_load:could not load the shared library
`



CONSIDER
Need to review if the `createJob` query is the one we need or we should be running a `createSingleJob` one