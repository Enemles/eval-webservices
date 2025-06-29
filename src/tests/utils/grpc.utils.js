const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Configuration par défaut pour PROTO_PATH - chemin relatif depuis la racine
const PROTO_PATH = process.env.PROTO_PATH || './libs/shared/src/proto/service.proto';
// Trouver la racine du projet (là où se trouve package.json)
const findProjectRoot = () => {
  let currentDir = __dirname;
  while (!require('fs').existsSync(path.join(currentDir, 'package.json'))) {
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      throw new Error('Could not find project root (package.json not found)');
    }
    currentDir = parentDir;
  }
  return currentDir;
};
const projectRoot = findProjectRoot();
const protoPath = path.resolve(projectRoot, PROTO_PATH);

// Configuration par défaut pour PROTO_URL  
const PROTO_URL = process.env.PROTO_URL || 'localhost:50051';

const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

module.exports = {
    protoDescriptor,
    getPackage(name) {
        return protoDescriptor[name];
    },
    getConfig() {
        return {
            url: process.env.PROTO_URL || 'localhost:50051', insecure: grpc.credentials.createInsecure()
        }
    }
}