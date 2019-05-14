'use strict';

const StatusMessages = {
    '1': { // Informational
        '00': 'Continue',
        '01': 'Switching Protocols',
        '02': 'Processing',
        '03': 'Early Hints'
    },
    '2': { // Successful
        '00': 'OK',
        '01': 'Created',
        '02': 'Accepted',
        '03': 'Non-Authoritative Information',
        '04': 'No Content',
        '05': 'Reset Content',
        '06': 'Partial Content',
        '07': 'Multi-Status',
        '08': 'Already Reported',
        '26': 'IM Used'
    },
    '3': { // Redirect
        '00': 'Multiple Choices',
        '01': 'Moved Permanently',
        '02': 'Found',
        '03': 'See Other',
        '04': 'Not Modified',
        '05': 'Use Proxy',
        '06': 'Switch Proxy',
        '07': 'Temporary Redirect',
        '08': 'Permanent Redirect'
    },
    '4': { // Client Error
        '00': 'Bad Request',
        '01': 'Unauthorized',
        '02': 'Payment Required',
        '03': 'Forbidden',
        '04': 'Not Found',
        '05': 'Method Not Allowed',
        '06': 'Not Acceptable',
        '07': 'Proxy Authentication Required',
        '08': 'Request Timeout',
        '09': 'Conflict',
        '10': 'Gone',
        '11': 'Length Required',
        '12': 'Precondition Failed',
        '13': 'Payload Too Large',
        '14': 'URI Too Large',
        '15': 'Unsupported Media Type',
        '16': 'Range Not Satisfiable',
        '17': 'Expectation Failed',
        '18': 'I\'m a teapot',
        '21': 'Misdirected Request',
        '22': 'Unprocessable Entity',
        '23': 'Locked',
        '24': 'Failed Dependency',
        '26': 'Upgrade Required',
        '28': 'Precondition Required',
        '29': 'Too Many Requests',
        '31': 'Request Header Fields Too Large',
        '51': 'Unavailable For Legal Reasons'
    },
    '5': { // Server Error
        '00': 'Internal Server Error',
        '01': 'Not Implemented',
        '02': 'Bad Gateway',
        '03': 'Service Unavaliable',
        '04': 'Gateway Timeout',
        '05': 'HTTP Version Not Supported',
        '06': 'Variant Also Negotiates',
        '07': 'Insufficient Storage',
        '08': 'Loop Detected',
        '10': 'Not Extended',
        '11': 'Network Authentication Required',
    }
};

class Status {
    constructor(code) {
        this.code    = code.toString();
        this.message = StatusMessages[this.code.substring(0, 1)][this.code.substring(1)];
    }
}

module.exports = Status;
