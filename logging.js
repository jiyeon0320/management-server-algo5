const winston = require('winston');
require('winston-daily-rotate-file');
require('date-utils');

const logging = winston.createLogger({
    level: 'debug', 

    transports: [
        new winston.transports.DailyRotateFile({
            filename : 'log/system.log',
            zippedArchive: true,
            format: winston.format.printf(
                info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${info.level.toUpperCase()}] - ${info.message}`)
        }),
        new winston.transports.Console({
            format: winston.format.printf(
                info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${info.level.toUpperCase()}] - ${info.message}`
            )
        })
    ]
})
module.exports = logging;