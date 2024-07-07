let car  = {
    make: "Toyota",
    model: "Camry",
    year: 2022
}

car.startEngine = function(){
    console.log("Engine Started")
}

console.log(car)
console.log(car.startEngine)
console.log(car.startEngine())
