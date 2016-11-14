#!/usr/bin/env node
const cluster = require('cluster');
const chalk   = require('chalk');

//
// http://nodejs.org/api/cluster.html
// http://rowanmanning.com/posts/node-cluster-and-express/
//
// TODO: Look into Domains to handle errors
// http://nodejs.org/api/domain.html#domain_warning_don_t_ignore_errors
//
if (cluster.isMaster) {
    const os    = require('os');
    const http  = require('http');
    const https = require('https');
    // http://glynnbird.tumblr.com/post/53280292271/node-js-increasing-the-size-of-the-socket-pool
    // http://bocoup.com/weblog/node-stress-test-analysis/
    http.globalAgent.maxSockets = Infinity;
    https.globalAgent.maxSockets = Infinity;

    // Count the machine's CPUs
    const cpuCount = os.cpus().length;

    // Create 4 worker for each CPU
    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', (worker) => {
        // Replace the dead worker,
        // we're not sentimental
        console.log(chalk.red('Worker ' + worker.id + ' died :('));
        cluster.fork();
    });

} else {

    // Load Express
    const app  = require('../index');

    // Sets the port
    app.set('port', process.env.PORT || 3000);

    const server = app.listen(app.get('port'), () => {
        console.log('[Env %s] [Port %s] [Worker %s]', chalk.blue(app.settings.env), chalk.blue(app.get('port')), chalk.blue(cluster.worker.id));
    });

}
