let str = "Hello World";

function reverseString(str) {
    return str.split("").reverse().join(""); 
}

console.log(reverseString(str)); // dlroW olleH

// function reverseString(str) {
//     return str.split(" ").reverse().join(""); 
// }

// console.log(reverseString(str)); // WorldHello

// function reverseString(str) {
//     return str.split(" ").reverse().join(" "); 
// }

// console.log(reverseString(str)); // World Hello
