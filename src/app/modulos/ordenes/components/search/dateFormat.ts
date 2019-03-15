import { IMyDpOptions, IMyOptions, IMyDate } from 'mydatepicker';


export class DateFormat {

    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        showTodayBtn: true,
        markCurrentDay: true,
        sunHighlight: true,
        markCurrentMonth: true,
        todayBtnTxt: 'hoy',
        showClearDateBtn: false,
        dayLabels: {
            su: 'D', mo: 'L', tu: 'M', we: 'M', th: 'J', fr: 'V', sa: 'S'
       },
       monthLabels: {
         1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril', 5: 'Mayo', 6: 'Junio',
         7: 'Julio', 8: 'Agosto', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic'
       },
       openSelectorOnInputClick: true
    };
}
