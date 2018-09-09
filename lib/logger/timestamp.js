'use strict';

const Months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
};

const Weekdays = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
};

function Timestamp() {
    this.date = new Date();
}

Timestamp.prototype.format = function(formatStr) {
    let str = '';

    for(let i = 0; i < formatStr.length; i++) {
        if(formatStr.charAt(i) === '%') {
            switch(formatStr.charAt(i + 1)) {
                case 'a': str += Weekdays[this.date.getDay()].substring(0, 3); break;
                case 'A': str += Weekdays[this.date.getDay()]; break;
                case 'b': str += Months[this.date.getMonth()].substring(0, 3); break;
                case 'B': str += Months[this.date.getMonth()]; break;
                case 'c': str += ''; break;
                case 'd': str += this.date.getDate().toString().padStart(2, '0'); break;
                case 'H': str += this.date.getHours().toString().padStart(2, '0'); break;
                case 'I': str += ''; break;
                case 'j': str += ''; break;
                case 'm': str += this.date.getMonth().toString().padStart(2, '0'); break;
                case 'M': str += this.date.getMinutes().toString().padStart(2, '0'); break;
                case 'p': str += ''; break;
                case 'S': str += this.date.getSeconds().toString().padStart(2, '0'); break;
                case 'U': str += ''; break;
                case 'w': str += ''; break;
                case 'W': str += ''; break;
                case 'x': str += ''; break;
                case 'X': str += ''; break;
                case 'y': str += this.date.getFullYear().toString().substring(2); break;
                case 'Y': str += this.date.getFullYear(); break;
                case 'z': str += (this.date.getTimezoneOffset() < 0 ? '+' : '-') +
                                 (Math.floor(this.date.getTimezoneOffset() / 60)).toString().padStart(2, '0') +
                                 (this.date.getTimezoneOffset() % 60).toString().padStart(2, '0'); break;
                case 'Z': str += ''; break;
                case '%': str += '%'; break;
            }

            i++;
        } else {
            str += formatStr.charAt(i);
        }
    }

    return str;
}

module.exports = Timestamp;
