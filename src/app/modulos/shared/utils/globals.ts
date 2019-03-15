import { Injectable } from '@angular/core';
import CONSTANTS from './constants';

@Injectable()
export class Globals {
    // private theme: string = 'paris';
    private config = [];
    private configOne = [];
    public MsjLoading = 'Por favor espere...';

    constructor() {
        this.config = localStorage.config ? JSON.parse(localStorage.config) : [];
    }

    setValue1(val) {
        this.themeApp(val);
    }

    setValue(name, val) {
//        this.deleteOne(name);
        if (name === 'theme') {
            this.themeApp(val);
            if (this.configOne.length > 0) {
                this.config.push(this.configOne[0]);
            }
        } else {
            if (this.config.length > 0) {
                this.config.push({val});
            }
        }

        localStorage.config = JSON.stringify(this.config);
    }

    getValue() {
        return this.config;
    }

    clean() {
       /* if (this.config.length > 1) {
            this.configOne = this.config[1];
        }
        this.config.pop();*/
        sessionStorage.removeItem('idProfile');
        sessionStorage.removeItem('flagRoute');
        sessionStorage.removeItem('username');
    }
/*
    deleteOne(msg: string) {
        if (this.config.length > 0) {
            const index: number = this.config.indexOf(msg);
            console.log('deleteOne size: ' + this.config.length);
            console.log('deleteOne msg: ' + msg + ' - ' + index);
            if (index !== -1) {
                this.config.splice(index, 1);
            }
        }
    }
*/
    themeApp(data) {
        if ('johnson' === data) {
            this.config = [];
            // LOGO
            this.config.push({
                theme: data,
                chartColorOne: CONSTANTS.COLORS.JOHNSON.PRIMARY,
                chartColorTwo: CONSTANTS.COLORS.JOHNSON.PRIMARY_MEDIUM,
            });

            // set color
            // this.chartColorOne = CONSTANTS.COLORS.JOHNSON.PRIMARY;
            // this.chartColorTwo = CONSTANTS.COLORS.JOHNSON.PRIMARY_MEDIUM;

            document.documentElement.style.setProperty('--color-1', CONSTANTS.COLORS.JOHNSON.PRIMARY);
            document.documentElement.style.setProperty('--color-2', CONSTANTS.COLORS.JOHNSON.PRIMARY_MEDIUM);
            document.documentElement.style.setProperty('--color-3', CONSTANTS.COLORS.JOHNSON.PRIMARY_LIGHT);
            document.documentElement.style.setProperty('--color-4', CONSTANTS.COLORS.JOHNSON.GRAY);
            document.documentElement.style.setProperty('--color-5', CONSTANTS.COLORS.JOHNSON.GRAY_MEDIUM);
            document.documentElement.style.setProperty('--color-7', CONSTANTS.COLORS.JOHNSON.GRAY_LIGHT);
            document.documentElement.style.setProperty('--color-8', CONSTANTS.COLORS.JOHNSON.SECONDARY_ONE);
            document.documentElement.style.setProperty('--color-9', CONSTANTS.COLORS.JOHNSON.SECONDARY_TWO);
            document.documentElement.style.setProperty('--color-10', CONSTANTS.COLORS.JOHNSON.SECONDARY_THREE);
            document.documentElement.style.setProperty('--color-11', CONSTANTS.COLORS.JOHNSON.SECONDARY_FOUR);
            document.documentElement.style.setProperty('--color-12', CONSTANTS.COLORS.JOHNSON.SECONDARY_FIVE);
            document.documentElement.style.setProperty('--color-13', CONSTANTS.COLORS.JOHNSON.SECONDARY_SIX);
        }
        if ('paris' === data) {
            this.config = [];
            // LOGO
            this.config.push({
                theme: data,
                chartColorOne: CONSTANTS.COLORS.PARIS.PRIMARY,
                chartColorTwo: CONSTANTS.COLORS.PARIS.PRIMARY_MEDIUM,
            });

            document.documentElement.style.setProperty('--color-1', CONSTANTS.COLORS.PARIS.PRIMARY);
            document.documentElement.style.setProperty('--color-2', CONSTANTS.COLORS.PARIS.PRIMARY_MEDIUM);
            document.documentElement.style.setProperty('--color-3', CONSTANTS.COLORS.PARIS.PRIMARY_LIGHT);
            document.documentElement.style.setProperty('--color-4', CONSTANTS.COLORS.PARIS.GRAY);
            document.documentElement.style.setProperty('--color-5', CONSTANTS.COLORS.PARIS.GRAY_MEDIUM);
            document.documentElement.style.setProperty('--color-7', CONSTANTS.COLORS.PARIS.GRAY_LIGHT);
            document.documentElement.style.setProperty('--color-8', CONSTANTS.COLORS.PARIS.SECONDARY_ONE);
            document.documentElement.style.setProperty('--color-9', CONSTANTS.COLORS.PARIS.SECONDARY_TWO);
            document.documentElement.style.setProperty('--color-10', CONSTANTS.COLORS.PARIS.SECONDARY_THREE);
            document.documentElement.style.setProperty('--color-11', CONSTANTS.COLORS.PARIS.SECONDARY_FOUR);
            document.documentElement.style.setProperty('--color-12', CONSTANTS.COLORS.PARIS.SECONDARY_FIVE);
            document.documentElement.style.setProperty('--color-13', CONSTANTS.COLORS.PARIS.SECONDARY_SIX);
        }
    }

// number_format(amount, decimals) {
//     let amount_parts: any;
//     let regexp: any;

//     amount += '';
//     amount = parseFloat(amount.replace(/[^0-9\.]/g, ''));

//     decimals = decimals || 0;

//     if (isNaN(amount) || amount === 0) {
//         return parseFloat('0').toFixed(decimals);
//     }

//     amount = '' + amount.toFixed(decimals);

//     amount_parts = amount.split('.'),
//     regexp = /(\d+)(\d{3})/;

//     while (regexp.test(amount_parts[0])) {
//         amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');
//     }

//     return amount_parts.join('.');
// }

}
