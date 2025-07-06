const mongoose = require("mongoose");
const {Listing} = require("../models/listings.js");
const {data} = require("./data.js");

let MONGO_URL='mongodb+srv://koliom19:WlIL9f1S4LZWRpjQ@cluster0.rociihj.mongodb.net/nextDestination2?retryWrites=true&w=majority&appName=Cluster0'

async function main(){
    mongoose.connect(MONGO_URL)
    .then(()=>{
        console.log("mongodb server connected");
    })
    .catch((err)=>{
        console.log(err);
    });
};
main();


let data1 = data.map((el) =>{
    el.owner='686a067022ff883264f53c13'
    return el
});

async function addData(){
    deletedListing = await Listing.deleteMany({});
    addListing = await Listing.insertMany(data1);
    console.log(deletedListing);
    console.log(`{ total ${addListing.length} listings add }`);
};
addData();

// console.log(data1);














// <% if(!user) {%>
//           <a href="/users/signup" class="navbar-link">SignUp</a>
//           <a href="/users/login" class="navbar-link">Login</a>
//         <% } %>

//         <% if(user) {%>
//           <a href="/listings/new" class="navbar-link create-listing">Add New Listing</a>
//           <a href="/users/logout" class="navbar-link">logout</a>
//         <% } %>


//         <% if(!user) {%>
//           <a href="/users/signup" class="navbar-link">SignUp</a>
//           <a href="/users/login" class="navbar-link">Login</a>
//         <% } %>
//         <% else {%>
//           <a href="/listings/new" class="navbar-link create-listing">Add New Listing</a>
//           <a href="/users/logout" class="navbar-link">logout</a>
//         <% } %>