const cluster = require('cluster');
const os = require('os');
const http = require('http');

if (cluster.isMaster) {
    console.log(`Master process ${process.pid} is running`);

    // Fork workers equal to the number of CPU cores
    const numCPUs = os.cpus().length;
    console.log(`Forking ${numCPUs} CPUs`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Restart a worker if it crashes
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Starting a new one...`);
        cluster.fork();
    });

} else {
    // Worker process creates a server
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Handled by worker: ${process.pid}\n`);
    });

    server.listen(3000, () => {
        console.log(`Worker ${process.pid} started`);
    });
}
