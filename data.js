// ===============================
// PASSENGER MANAGEMENT SYSTEM
// LOCAL STORAGE DATABASE
// ===============================


// ---------- LOGIN USER ----------

const loginUser = {

    userId: "travel123",

    password: "Travel@123"

};


// Save login user only first time

if (!localStorage.getItem("loginUser")) {

    localStorage.setItem(

        "loginUser",

        JSON.stringify(loginUser)

    );

}



// ---------- DEMO PASSENGERS ----------

const demoPassengers = [

    {

        pnr: "PNR1001",

        name: "Surya",

        age: 22,

        gender: "Male",

        origin: "Madurai",

        destination: "Chennai",

        train: "TN01",

        price: 650

    },



    {

        pnr: "PNR1002",

        name: "Arun",

        age: 25,

        gender: "Male",

        origin: "Coimbatore",

        destination: "Salem",

        train: "TN02",

        price: 500

    },



    {

        pnr: "PNR1003",

        name: "Priya",

        age: 24,

        gender: "Female",

        origin: "Trichy",

        destination: "Chennai",

        train: "TN03",

        price: 720

    },



    {

        pnr: "PNR1004",

        name: "Anitha",

        age: 28,

        gender: "Female",

        origin: "Erode",

        destination: "Madurai",

        train: "TN04",

        price: 450

    }

];



// Save demo data only first time

if (!localStorage.getItem("passengers")) {

    localStorage.setItem(

        "passengers",

        JSON.stringify(demoPassengers)

    );

}



// ==============================
// GET ALL PASSENGERS
// ==============================

function getPassengers() {

    return JSON.parse(

        localStorage.getItem("passengers")

    ) || [];

}




// ==============================
// SAVE ALL PASSENGERS
// ==============================

function savePassengers(passengers) {

    localStorage.setItem(

        "passengers",

        JSON.stringify(passengers)

    );

}




// ==============================
// ADD PASSENGER
// ==============================

function addPassenger(passenger) {

    let passengers = getPassengers();



    passengers.push(passenger);



    savePassengers(passengers);

}




// ==============================
// FIND PASSENGER BY PNR
// ==============================

function findPassenger(pnr) {

    let passengers = getPassengers();



    return passengers.find(

        passenger =>

        passenger.pnr.toUpperCase()

        ===

        pnr.toUpperCase()

    );

}




// ==============================
// CHECK DUPLICATE PNR
// ==============================

function isDuplicatePNR(pnr) {

    let passengers = getPassengers();



    return passengers.some(

        passenger =>

        passenger.pnr.toUpperCase()

        ===

        pnr.toUpperCase()

    );

}




// ==============================
// UPDATE PASSENGER
// ==============================

function updatePassengerData(

    pnr,

    updatedPassenger

) {

    let passengers = getPassengers();



    passengers = passengers.map(

        passenger =>

        passenger.pnr === pnr

        ?

        updatedPassenger

        :

        passenger

    );



    savePassengers(passengers);

}




// ==============================
// DELETE PASSENGER
// ==============================

function deletePassengerData(pnr) {

    let passengers = getPassengers();



    passengers = passengers.filter(

        passenger =>

        passenger.pnr !== pnr

    );



    savePassengers(passengers);

}




// ==============================
// SEARCH PASSENGER
// ==============================

function searchPassenger(pnr) {

    let passengers = getPassengers();



    return passengers.filter(

        passenger =>

        passenger.pnr

        .toLowerCase()

        .includes(

            pnr.toLowerCase()

        )

    );

}




// ==============================
// TOTAL PASSENGERS
// ==============================

function totalPassengers() {

    return getPassengers().length;

}




// ==============================
// MALE COUNT
// ==============================

function totalMale() {

    return getPassengers()

    .filter(

        p => p.gender === "Male"

    )

    .length;

}




// ==============================
// FEMALE COUNT
// ==============================

function totalFemale() {

    return getPassengers()

    .filter(

        p => p.gender === "Female"

    )

    .length;

}




// ==============================
// TOTAL REVENUE
// ==============================

function totalRevenue() {

    let passengers = getPassengers();



    let total = 0;



    passengers.forEach(

        passenger =>

        total += Number(

            passenger.price

        )

    );



    return total;

}




// ==============================
// LOGIN VALIDATION
// ==============================

function validateLogin(

    userId,

    password

) {

    let user = JSON.parse(

        localStorage.getItem(

            "loginUser"

        )

    );



    return (

        userId === user.userId

        &&

        password === user.password

    );

}




// ==============================
// SESSION
// ==============================

function loginSession() {

    localStorage.setItem(

        "loggedIn",

        "true"

    );

}




function logoutSession() {

    localStorage.removeItem(

        "loggedIn"

    );

}




function isLoggedIn() {

    return localStorage.getItem(

        "loggedIn"

    ) === "true";

}




// ==============================
// RESET DATABASE
// ==============================

function resetDatabase() {

    localStorage.removeItem(

        "passengers"

    );



    localStorage.setItem(

        "passengers",

        JSON.stringify(

            demoPassengers

        )

    );



    alert(

        "Database Reset Successfully"

    );

}




console.log(

"Passenger Management System Database Loaded Successfully"

);

console.log(

getPassengers()

);