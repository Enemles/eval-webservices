const {getPackage, getConfig} = require("../utils/grpc.utils");
const {closePool, getPool} = require("../utils/db.utils");
const axios = require("axios")

// Modifier ici pour utiliser 'api' au lieu de 'notification'
const grpcPackage = getPackage('api');
const { Readable } = require('stream');
const configGrpc = getConfig();
const csv = require('csv-parser');
const exportService = new grpcPackage.ExportService(configGrpc.url, configGrpc.insecure);

let roomId = '', userId = '', reservationId = '';

// ... le reste du code 