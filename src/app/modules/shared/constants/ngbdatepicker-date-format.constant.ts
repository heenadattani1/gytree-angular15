export const DATE_FORMAT_CONVERTER_ADD_DAYS = (datePipe: any, days: number = 0) => {
    let maxDate;
    maxDate = datePipe.transform(new Date().setDate(new Date().getDate() + days), 'dd/MM/yyyy');
    maxDate = maxDate.split('/');
    maxDate = {
        day: Number(maxDate[0]),
        month: Number(maxDate[1]),
        year: Number(maxDate[2]),
    }
    return maxDate;
}

export const DATE_FORMAT_CONVERTER = () => {
    let minDate;
    const current = new Date();
    minDate = {
        day: current.getDate(),
        month: current.getMonth() + 1,
        year: current.getFullYear(),
    }
    return minDate;
}

export interface DATE_SCHEMA {
    day: number
    month: number,
    year: number,
}


