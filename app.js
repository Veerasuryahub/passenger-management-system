// ===============================
// DEMO LOGIN
// ===============================

const DEMO_USER = {
    userid: "travel123",
    password: "Travel@123"
};


// ===============================
// DEMO PASSENGER DATA
// ===============================

if (!localStorage.getItem("passengers")) {

    const demoPassengers = [

        {
            pnr:"PNR1001",
            name:"Surya",
            age:22,
            gender:"Male",
            origin:"Madurai",
            destination:"Chennai",
            train:"TN01",
            price:650
        },

        {
            pnr:"PNR1002",
            name:"Arun",
            age:25,
            gender:"Male",
            origin:"Coimbatore",
            destination:"Salem",
            train:"TN02",
            price:500
        },

        {
            pnr:"PNR1003",
            name:"Priya",
            age:21,
            gender:"Female",
            origin:"Trichy",
            destination:"Chennai",
            train:"TN03",
            price:700
        }

    ];

    localStorage.setItem(
        "passengers",
        JSON.stringify(demoPassengers)
    );

}



// ===============================
// LOGIN
// ===============================

function login(){

    let userid=document.getElementById("userid").value.trim();

    let password=document.getElementById("password").value.trim();


    if(userid==="" || password===""){

        alert("Enter User ID and Password");

        return;
    }



    if(userid===DEMO_USER.userid &&
        password===DEMO_USER.password){

        localStorage.setItem("loggedIn",true);

        window.location.href="pages/dashboard.html";

    }

    else{

        alert("Invalid User ID or Password");

    }


}



// ===============================
// LOGOUT
// ===============================

function logout(){

    localStorage.removeItem("loggedIn");

    window.location.href="../index.html";

}



// ===============================
// GET PASSENGERS
// ===============================

function getPassengers(){

    return JSON.parse(

        localStorage.getItem("passengers")

    ) || [];

}



// ===============================
// SAVE PASSENGERS
// ===============================

function savePassengers(data){

    localStorage.setItem(

        "passengers",

        JSON.stringify(data)

    );

}



// ===============================
// ADD PASSENGER
// ===============================

function addPassenger(){

    let pnr=document.getElementById("pnr").value;

    let name=document.getElementById("name").value;

    let age=document.getElementById("age").value;

    let gender=document.getElementById("gender").value;

    let origin=document.getElementById("origin").value;

    let destination=document.getElementById("destination").value;

    let train=document.getElementById("train").value;

    let price=document.getElementById("price").value;



    if(

        pnr==="" ||

        name==="" ||

        age==="" ||

        gender==="" ||

        origin==="" ||

        destination==="" ||

        train==="" ||

        price===""

    ){

        alert("Fill all fields");

        return;

    }



    let passengers=getPassengers();


    let exists=passengers.find(

        p=>p.pnr===pnr

    );


    if(exists){

        alert("PNR already exists");

        return;

    }



    passengers.push({

        pnr,

        name,

        age,

        gender,

        origin,

        destination,

        train,

        price

    });



    savePassengers(passengers);


    alert("Passenger Added Successfully");


    document.getElementById("passengerForm").reset();


}





// ===============================
// VIEW ALL PASSENGERS
// ===============================

function displayPassengers(){

    let passengers=getPassengers();

    let tbody=document.getElementById("tbody");


    if(!tbody) return;


    tbody.innerHTML="";



    passengers.forEach((p,index)=>{


        tbody.innerHTML+=`

        <tr>

        <td>${p.pnr}</td>

        <td>${p.name}</td>

        <td>${p.age}</td>

        <td>${p.gender}</td>

        <td>${p.origin}</td>

        <td>${p.destination}</td>

        <td>${p.train}</td>

        <td>${p.price}</td>


        <td>

        <button onclick="editPassenger(${index})">

        Edit

        </button>


        <button onclick="deletePassenger(${index})">

        Delete

        </button>


        </td>


        </tr>

        `;


    });


}





// ===============================
// DELETE PASSENGER
// ===============================

function deletePassenger(index){

    let passengers=getPassengers();


    let ok=confirm(

        "Delete Passenger ?"

    );


    if(ok){

        passengers.splice(index,1);


        savePassengers(passengers);


        displayPassengers();

    }

}





// ===============================
// EDIT PASSENGER
// ===============================

function editPassenger(index){

    let passengers=getPassengers();

    let p=passengers[index];



    document.getElementById("pnr").value=p.pnr;

    document.getElementById("name").value=p.name;

    document.getElementById("age").value=p.age;

    document.getElementById("gender").value=p.gender;

    document.getElementById("origin").value=p.origin;

    document.getElementById("destination").value=p.destination;

    document.getElementById("train").value=p.train;

    document.getElementById("price").value=p.price;


    localStorage.setItem(

        "editIndex",

        index

    );


}





// ===============================
// UPDATE PASSENGER
// ===============================

function updatePassenger(){


    let index=localStorage.getItem(

        "editIndex"

    );


    if(index===null){

        alert("Select passenger");

        return;

    }


    let passengers=getPassengers();


    passengers[index]={

        pnr:document.getElementById("pnr").value,

        name:document.getElementById("name").value,

        age:document.getElementById("age").value,

        gender:document.getElementById("gender").value,

        origin:document.getElementById("origin").value,

        destination:document.getElementById("destination").value,

        train:document.getElementById("train").value,

        price:document.getElementById("price").value

    };


    savePassengers(passengers);


    alert("Passenger Updated");


    localStorage.removeItem(

        "editIndex"

    );


    displayPassengers();


}





// ===============================
// SEARCH PASSENGER
// ===============================

function searchPassenger(){


    let search=document

    .getElementById("searchPNR")

    .value

    .trim();


    let passengers=getPassengers();



    let result=passengers.find(

        p=>p.pnr===search

    );



    let output=document.getElementById(

        "searchResult"

    );


    if(!output) return;



    if(result){

        output.innerHTML=`

        <h3>

        Passenger Found

        </h3>


        <p>

        PNR :

        ${result.pnr}

        </p>


        <p>

        Name :

        ${result.name}

        </p>


        <p>

        Age :

        ${result.age}

        </p>


        <p>

        Gender :

        ${result.gender}

        </p>


        <p>

        Origin :

        ${result.origin}

        </p>


        <p>

        Destination :

        ${result.destination}

        </p>


        <p>

        Train :

        ${result.train}

        </p>


        <p>

        Ticket Price :

        ₹${result.price}

        </p>

        `;

    }

    else{

        output.innerHTML=`

        <h3>

        Passenger Not Found

        </h3>

        `;

    }


}




// AUTO LOAD TABLE

window.onload=function(){

displayPassengers();

}