let isLeapYear = (year) => {
    if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)){
        return true;
    }
    else {
        return false;
    }
}

console.log(isLeapYear(2024));
console.log(isLeapYear(1982));
console.log(isLeapYear(1900));
