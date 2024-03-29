// fetch('https://arcadia-high-mobile-temp-default-rtdb.firebaseio.com/.json')
//     .then(response => response.json())
//     .then(data => console.log(data));

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js';
import { getDatabase, ref, get, child, set, remove } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";
const config = {
    apiKey: "AIzaSyDweQSkpqQSGP42qBgoiSm5VAhDoe9dJA8",
    authDomain: "arcadia-high-mobile.firebaseapp.com",
    databaseURL: "https://ahs-app.firebaseio.com",
    projectId: "arcadia-high-mobile",
    storageBucket: "arcadia-high-mobile.appspot.com",
    messagingSenderId: "654225823864",
    appId: "1:654225823864:web:944772a5cadae0c8b7758d",
    measurementId: "G-YGN0551PM8"
};
const app = initializeApp(config);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    'hd': 'ausd.net'
})
const auth = getAuth(app);
// console.log(auth);
const db = ref(getDatabase(app));

document.getElementById("googleSignin").addEventListener("click", function () {
    console.log("signin clicked")
    signInWithPopup(auth, provider).then(function (result) {
        console.log("signin clicked 2")
        const credential = GoogleAuthProvider.credentialFromResult(result);
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(auth.currentUser)
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(error.code)
        console.log(error.message)
    });
});

document.getElementById("googleSignout").addEventListener("click", function () {
    console.log("signout clicked")
    signOut(auth)
        .then(function () {
            console.log('signout successful')
            alert('signout successful');
        }, function (error) {
            console.log('Signout Failed')
        });
});

// Get the modal
var modal = document.getElementById("myModal");

let scheduleIDs = document.getElementById("dayType");
function renderScheduleIDs() {
    get(child(db, "scheduleIDs")).then((snapshot) => {
        if (snapshot.exists()) {
            let i = 0;
            snapshot.val().forEach((item) => {
                let li = document.createElement("option");
                li.value = item;
                li.text = item;
                li.style = "color: black;";
                scheduleIDs.appendChild(li);
                i++;
            })
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}
renderScheduleIDs();

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//CALENDER
const date = new Date();

const renderCalendar = () => {
    date.setDate(1);

    const monthDays = document.querySelector(".days");

    const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();

    const prevLastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        0
    ).getDate();

    const firstDayIndex = date.getDay();

    const lastDayIndex = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDay();

    const nextDays = 7 - lastDayIndex - 1;

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    document.querySelector(".date h1").innerHTML = months[date.getMonth()];

    document.querySelector(".date p").innerHTML = new Date().toDateString().replace(" ", ", ", 1);

    let days = "";

    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDay; i++) {
        if (
            i === new Date().getDate() &&
            date.getMonth() === new Date().getMonth()
        ) {
            var oneJan = new Date(date.getFullYear(), 0, 1);
            var d = date;
            var numberOfDays = Math.floor((d - oneJan) / (24 * 60 * 60 * 1000));
            //console.log(numberOfDays);
            var result = Math.ceil(numberOfDays / 7);
            var day = d.getDay();
            var month = d.toLocaleString('default', { month: 'short' });
            var year = d.getFullYear();

            days += `<div class="today dateDay" data-week=${result} data-month=${month} data-year=${year} id=${day}>${i}</div>`;
        } else {
            var oneJan = new Date(date.getFullYear(), 0, 1);
            var d = new Date(date.getFullYear(), date.getMonth(), i);
            // console.log(oneJan);
            // console.log(d);
            var numberOfDays = Math.floor((d - oneJan) / (24 * 60 * 60 * 1000));
            //console.log(numberOfDays);
            var result = Math.ceil(numberOfDays / 7);
            var day = d.getDay();
            var month = d.toLocaleString('default', { month: 'short' });
            var year = d.getFullYear();
            days += `<div class="dateDay" data-week=${result} data-month=${month} data-year=${year} id=${day}>${i}</div>`;
        }
    }

    if (nextDays == 0) {
        monthDays.innerHTML = days;
    }

    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="next-date">${j}</div>`;
        monthDays.innerHTML = days;
    }

    var el = document.getElementsByClassName('dateDay');
    // console.log(el);
    for (let i = 0; i < el.length; i++) {
        el[i].addEventListener("click", () => {
            // console.log(el[i].dataset.phrase);
            editDay(el[i].dataset.week, el[i].id, el[i].dataset.month, el[i].dataset.year, el[i].innerHTML)
            modal.style.display = "block";
        });
    }
};

document.querySelector(".prev").addEventListener("click", () => {
    // console.log("ujisdhfaiuk");
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

renderCalendar();

// for (var i = 0; i < el.length; i++) {
//     console.log(i);
//     var e = el[i];
//     e.addEventListener('click', function () {
//         const d = new Date(date.getFullYear(), date.getMonth(), i);
//         e.week =
//             console.log(i);
//         console.log(d);
//     });
// }

// SCHEDULES

//schedule ids
// let scheduleIDsList = document.getElementById("scheduleIDsList");
// function renderScheduleIDs() {
//     get(child(db, "scheduleIDs")).then((snapshot) => {
//         if (snapshot.exists()) {
//             let i = 0;
//             snapshot.val().forEach((item) => {
//                 let li = document.createTextNode(" " + item);
//                 let input = document.createElement("input");
//                 let deleteInput = document.createElement("input");
//                 input.type = "button";
//                 input.className = "scheduleIDsClass";
//                 input.id = item;
//                 input.style = "background-color: #82ff66; border-color: green;";
//                 deleteInput.type = "button";
//                 deleteInput.id = i;
//                 deleteInput.style = "background-color: #ff4046; border-color: red;";
//                 scheduleIDsList.appendChild(input);
//                 scheduleIDsList.appendChild(deleteInput);
//                 scheduleIDsList.appendChild(li);
//                 scheduleIDsList.appendChild(document.createElement("br"));
//                 input.addEventListener("click", function () {
//                     editScheduleID(item);
//                 });
//                 deleteInput.addEventListener("click", function () {
//                     deleteScheduleID(item, deleteInput.id);
//                 });
//                 i++;
//             })
//         } else {
//             console.log("No data available");
//         }
//     }).catch((error) => {
//         console.error(error);
//     });
// }
// renderScheduleIDs();

//edit schedule id
// function editScheduleID(id) {
//     get(child(db, "schedules/" + id)).then((snapshot) => {
//         if (snapshot.exists()) {
//             document.getElementById("ScheduleFirebaseTitle").innerHTML = "Editing: " + id;
//             document.getElementById("ScheduleTitle").value = snapshot.val().title;
//             document.getElementById("ScheduleColor").value = snapshot.val().color;
//             document.getElementById("ScheduleDots").value = snapshot.val().dots;
//             document.getElementById("ScheduleIconURL").value = snapshot.val().iconURL != undefined ? snapshot.val().iconURL : "";
//             let periodIDsArr = snapshot.val().periodIDs;
//             let periodIDsList = document.getElementById("editPeriodIDs");
//             periodIDsList.innerHTML = "";
//             if (periodIDsArr != undefined) {
//                 periodIDsArr.forEach(item => {
//                     let input = document.createElement("input");
//                     input.className = "editingPeriodIDs";
//                     input.style = "color: black;";
//                     input.value = item;
//                     periodIDsList.appendChild(input);
//                     periodIDsList.appendChild(document.createElement("br"));
//                 });
//             }
//             let timestampsArr = snapshot.val().timestamps;
//             let timestampsList = document.getElementById("editTimestamps");
//             timestampsList.innerHTML = "";
//             if (timestampsArr != undefined) {
//                 timestampsArr.forEach(item => {
//                     let input = document.createElement("input");
//                     input.className = "editingTimestamps";
//                     input.style = "color: black;";
//                     input.value = item;
//                     timestampsList.appendChild(input);
//                     timestampsList.appendChild(document.createElement("br"));
//                 });
//             }
//         } else {
//             console.log("No data available");
//         }
//     }).catch((error) => {
//         console.error(error);
//     });
// }

// document.getElementById("editAddPeriod").addEventListener("click", function () {
//     let needOneMore = false;
//     let timestampsList = document.getElementById("editTimestamps");
//     let periodIDsList = document.getElementById("editPeriodIDs");

//     if (timestampsList.innerHTML == "" && periodIDsList.innerHTML == "") {
//         needOneMore = true;
//     }

//     let input = document.createElement("input");
//     input.className = "editingPeriodIDs";
//     input.style = "color: black;";
//     periodIDsList.appendChild(input);
//     periodIDsList.appendChild(document.createElement("br"));

//     let input2 = document.createElement("input");
//     input2.className = "editingTimestamps";
//     input2.style = "color: black;";
//     timestampsList.appendChild(input2);
//     timestampsList.appendChild(document.createElement("br"));

//     if (needOneMore) {
//         let input3 = document.createElement("input");
//         input3.className = "editingTimestamps";
//         input3.style = "color: black;";
//         timestampsList.appendChild(input3);
//         timestampsList.appendChild(document.createElement("br"));
//     }
// });

// document.getElementById("editRemovePeriod").addEventListener("click", function () {
//     let ul = document.getElementById("editPeriodIDs");
//     let ul2 = document.getElementById("editTimestamps");
//     if (ul.childElementCount <= 2) {
//         ul.innerHTML = "";
//         ul2.innerHTML = "";
//         return;
//     }
//     ul.removeChild(ul.lastElementChild);
//     ul.removeChild(ul.lastElementChild);
//     ul2.removeChild(ul2.lastElementChild);
//     ul2.removeChild(ul2.lastElementChild);
// });

// document.getElementById("editedScheduleType").addEventListener("click", function () {
//     if (document.getElementById("ScheduleFirebaseTitle").innerHTML == "Editing:") {
//         alert("Choose a Schedule to Edit");
//         return;
//     }
//     let id = document.getElementById("ScheduleFirebaseTitle").innerHTML.substring(9);
//     let title = document.getElementById("ScheduleTitle").value;
//     let color = document.getElementById("ScheduleColor").value;
//     let dots = document.getElementById("ScheduleDots").value;
//     let iconUrl = document.getElementById("ScheduleIconURL").value;
//     let periodsArray = Array.from(document.getElementsByClassName("editingPeriodIDs"));
//     let arr = periodsArray.map(x => x.value);
//     let timestampsArray = Array.from(document.getElementsByClassName("editingTimestamps"));
//     let arr2 = timestampsArray.map(x => x.value);
//     let editedScheduleObject = {
//         color: color,
//         dots: dots,
//         iconURL: iconUrl,
//         periodIDs: arr,
//         timestamps: arr2,
//         title: title
//     }
//     set(child(db, 'schedules/' + id), editedScheduleObject).then(alert("changed the " + title + " schedule"));
//     document.getElementById("scheduleIDsList").innerHTML = "";
//     renderScheduleIDs();
// })

// //delete schedule type
// function deleteScheduleID(id, number) {
//     if (confirm("Are you sure you want to delete " + id + " schedule type?")) {
//         remove(child(db, "scheduleIDs/" + number));
//         remove(child(db, "schedules/" + id));
//         alert("Deleted " + id);
//         document.getElementById("scheduleIDsList").innerHTML = "";
//         renderScheduleIDs();
//     } else {
//         console.log('Canceled');
//     }
// }


// // WEEKS
// // render weeks
// let weeksList = document.getElementById("weeksList");
// function renderWeeks() {
//     get(child(db, "weeks")).then((snapshot) => {
//         if (snapshot.exists()) {
//             for (var item in snapshot.val()) {
//                 if (snapshot.val().hasOwnProperty(item)) {
//                     let li = document.createTextNode(" " + item);
//                     let input = document.createElement("input");
//                     let deleteInput = document.createElement("input");
//                     input.type = "button";
//                     input.className = "weeksClass";
//                     input.id = item;
//                     input.style = "background-color: #82ff66; border-color: green;";
//                     deleteInput.type = "button";
//                     deleteInput.id = item;
//                     deleteInput.style = "background-color: #ff4046; border-color: red;";
//                     weeksList.appendChild(input);
//                     // weeksList.appendChild(deleteInput);
//                     weeksList.appendChild(li);
//                     weeksList.appendChild(document.createElement("br"));
//                     input.addEventListener("click", function () {
//                         editWeek(input.id, snapshot.val()[input.id]["title"], snapshot.val()[input.id]["scheduleIDs"]);
//                     });
//                     deleteInput.addEventListener("click", function () {
//                         deleteWeek(deleteInput.id);
//                     });
//                 }
//             }
//         } else {
//             console.log("No data available");
//         }
//     }).catch((error) => {
//         console.error(error);
//     });
// }
// renderWeeks();

// //delete week type
// // function deleteWeek(id) {
// //     if (confirm("Are you sure you want to delete " + id + " week type?")) {
// //         remove(child(db, "weeks/" + id));
// //         alert("Deleted " + id);
// //         document.getElementById("weeksList").innerHTML = "";
// //         renderWeeks();
// //     } else {
// //         console.log('Canceled');
// //     }
// // }

// //array for "Add a New Type of Week"
// // for (let i = 0; i < 8; i++) {
// //     let input = document.createElement("input");
// //     input.className = "newWeekTypeArray";
// //     input.style = "color: black;";
// //     input.id = i;
// //     if (i == 0) { input.placeholder = "Please leave blank" };
// //     let number = document.createTextNode(i + " ");
// //     addScheduleIDs.appendChild(number);
// //     addScheduleIDs.appendChild(input);
// //     addScheduleIDs.appendChild(document.createElement("br"));
// // }

// // //adding new week type
// // document.getElementById("newWeekID").addEventListener("click", function () {
// //     var FT = document.getElementById("newWeekFirebaseTitle").value;
// //     if (FT == "") {
// //         alert("Please add a Firebase Title");
// //         return;
// //     }

// //     let a = document.getElementsByClassName("newWeekTypeArray");
// //     var arr = [];
// //     for (let i = 0; i < a.length; i++) {
// //         arr.push(a[i].value);
// //     }

// //     let newWeekType = {
// //         scheduleIDs: arr,
// //         title: document.getElementById("weekTitle").value
// //     }

// //     set(child(db, 'weeks/' + FT), newWeekType).then(alert('added new Week named ' + document.getElementById("weekTitle").value));
// //     document.getElementById("weeksList").innerHTML = "";
// //     renderWeeks();
// // });

// // edit week type
// var editingWeek = "";
// // var weekScheduleIDsList = document.getElementById("editScheduleIDs");
// function editWeek(key, title, scheduleIdsArray) {
//     editingWeek = key;
//     // weekScheduleIDsList.innerHTML = "";
//     document.getElementById("WeekFirebaseTitle").innerHTML = "Editing: " + key;
//     document.getElementById("WeekTitle").value = title;
//     // let i = 0;
//     // scheduleIdsArray.forEach(item => {
//     //     let input = document.createElement("input");
//     //     if (i == 0) { input.placeholder = "Please leave blank" };
//     //     input.className = "weekScheduleIDs";
//     //     input.style = "color: black;";
//     //     input.value = item;
//     //     let number = document.createTextNode(i + " ");
//     //     weekScheduleIDsList.appendChild(number);
//     //     weekScheduleIDsList.appendChild(input);
//     //     weekScheduleIDsList.appendChild(document.createElement("br"));
//     //     i++;
//     // });
// }

var edtDay = "";
var edtWeek = "";
var edtStringDate = "";

function editDay(week, day, month, year, date) {
    if (day == 0) {
        day = 7;
    }
    week = "w" + week;
    edtDay = day;
    edtWeek = week;
    console.log(day);
    console.log(week);
    console.log(month);
    console.log(year);
    // document.getElementById("weekType").value = title;
    get(child(db, "weeks/" + week + "/scheduleIDs/" + day)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val())
            edtStringDate = month + " " + date + " " + year + ": " + snapshot.val();
            document.getElementById("currentDay").innerHTML = "Editing " + edtStringDate;
            // document.getElementById("ScheduleFirebaseTitle").innerHTML = "Editing: " + id;
            // document.getElementById("ScheduleTitle").value = snapshot.val().title;
            // let periodIDsArr = snapshot.val().periodIDs;
            // let periodIDsList = document.getElementById("editPeriodIDs");
            // periodIDsList.innerHTML = "";
            // if (periodIDsArr != undefined) {
            //     periodIDsArr.forEach(item => {
            //         let input = document.createElement("input");
            //         input.className = "editingPeriodIDs";
            //         input.style = "color: black;";
            //         input.value = item;
            //         periodIDsList.appendChild(input);
            //         periodIDsList.appendChild(document.createElement("br"));
            //     });
            // }
            // let timestampsArr = snapshot.val().timestamps;
            // let timestampsList = document.getElementById("editTimestamps");
            // timestampsList.innerHTML = "";
            // if (timestampsArr != undefined) {
            //     timestampsArr.forEach(item => {
            //         let input = document.createElement("input");
            //         input.className = "editingTimestamps";
            //         input.style = "color: black;";
            //         input.value = item;
            //         timestampsList.appendChild(input);
            //         timestampsList.appendChild(document.createElement("br"));
            //     });
            // }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

document.getElementById("editedDay").addEventListener("click", function () {
    var result = document.getElementById("dayType").value;
    console.log(result);
    if (auth.currentUser) {
        set(child(db, 'weeks/' + edtWeek + '/scheduleIDs/' + edtDay), result).then(alert("changed " + edtStringDate + " to " + result));
    } else {
        alert("please sign in");
    }
    // /weeks/w1/scheduleIDs/1
});

// Edited Week Type
// document.getElementById("editedWeek").addEventListener("click", function () {
//     if (editingWeek == "") {
//         alert("Choose a Week to Edit");
//         return;
//     }
//     let weekTitle = document.getElementById("WeekTitle").value;
//     // let weekScheduleIdsArray = Array.from(document.getElementsByClassName("weekScheduleIDs"));
//     // let arr = weekScheduleIdsArray.map(x => x.value);
//     // let editedWeekObject = {
//     //     scheduleIDs: arr,
//     //     title: weekTitle
//     // }
//     set(child(db, 'weeks/' + editingWeek + '/title/'), weekTitle).then(alert("changed " + edtStringDate + " week title"));
//     document.getElementById("weeksList").innerHTML = "";
//     renderWeeks();
// });

// //week ids
// // let weekIDsList = document.getElementById("weekIDsList");
// // function renderWeekIDs() {
// //     get(child(db, "weekIDs")).then((snapshot) => {
// //         if (snapshot.exists()) {
// //             let temp = 0;
// //             snapshot.val().forEach((item) => {
// //                 let li = document.createElement("li");
// //                 let weekID = document.createElement("button");
// //                 weekID.className = "weekIDsClass";
// //                 weekID.id = temp;
// //                 weekID.style = "color: black;";
// //                 weekID.innerHTML = item;
// //                 li.appendChild(weekID);
// //                 weekIDsList.appendChild(li);
// //                 weekID.addEventListener("click", function () {
// //                     editWeekID(item, weekID.id);
// //                 });
// //                 temp++;
// //             })
// //         } else {
// //             console.log("No data available");
// //         }
// //     }).catch((error) => {
// //         console.error(error);
// //     });
// // }
// // renderWeekIDs();

// // let editingWeekID = 0;
// //edit week id
// // function editWeekID(id, number) {
// //     document.getElementById("weekIdInput").value = id;
// //     editingWeekID = number;
// // }

// //submit edited week id
// // document.getElementById("changedWeekID").addEventListener("click", function () {
// //     if (document.getElementById("weekIdInput").value == "") {
// //         alert("Woah you can't submit an empty Week ID");
// //         return;
// //     }
// //     if (editingWeekID == 0) {
// //         alert("Click a Week ID first");
// //         return;
// //     }
// //     set(child(db, 'weekIDs/' + editingWeekID), document.getElementById("weekIdInput").value).then(alert("changed week ID number " + editingWeekID + " to " + document.getElementById("weekIdInput").value));
// //     document.getElementById("weekIDsList").innerHTML = "";
// //     renderWeekIDs();
// // });


// // ADD A NEW TYPE OF SCHEDULE
// //periods?: checkbox functionality
// document.getElementById("periods").addEventListener("click", function () {
//     document.getElementById("periodDiv").hidden = document.getElementById("periods").checked ? false : true;
// }, false);

// // adding input boxes for timestamp and period
// document.getElementById("addPeriod").addEventListener("click", function () {
//     let ul = document.getElementById("periodList");
//     let input = document.createElement("input");
//     let input2 = document.createElement("input");
//     let input3 = document.createElement("input");
//     input.style = "color: black;";
//     input.placeholder = "Timestamp";
//     input.id = "scheduleTimestamps";
//     input.className = "timestamps";

//     input2.style = "color: black;";
//     input2.placeholder = "Period ID";
//     input2.id = "schedulePeriodIDs";
//     input2.className = "periods";

//     input3.style = "color: black;";
//     input3.placeholder = "Timestamp";
//     input3.id = "scheduleTimestamps2";
//     input3.className = "timestamps";

//     ul.appendChild(document.createElement("br"));
//     ul.appendChild(document.createElement("br"));
//     ul.appendChild(input);
//     ul.appendChild(document.createElement("br"));
//     ul.appendChild(input2);
// });

// // removing input boxes for timestamp and period
// document.getElementById("removePeriod").addEventListener("click", function () {
//     let ul = document.getElementById("periodList");
//     if (ul.childElementCount < 8) {
//         return;
//     }
//     ul.removeChild(ul.lastElementChild);
//     ul.removeChild(ul.lastElementChild);
//     ul.removeChild(ul.lastElementChild);
//     ul.removeChild(ul.lastElementChild);
//     ul.removeChild(ul.lastElementChild);
// })

// //add schedule ID to firebase
// document.getElementById("newScheduleID").addEventListener("click", function () {
//     const periods = document.getElementsByClassName('periods');
//     const timestamps = document.getElementsByClassName('timestamps');
//     const arr = [];
//     const arr2 = [];

//     for (let i = 0; i < timestamps.length; i++) {
//         if (i < periods.length) {
//             arr.push(periods[i].value);
//         }
//         arr2.push(timestamps[i].value);
//     }

//     let firebaseTitle = document.getElementById("scheduleFirebaseTitle").value;
//     if (firebaseTitle == "") {
//         alert("YO YO YO, put a title for our Firebase Database");
//         return;
//     }

//     let newSchedule = {
//         color: document.getElementById("scheduleColor").value,
//         iconURL: document.getElementById("scheduleIconURL").value == "" ? null : document.getElementById("scheduleIconURL").value,
//         dots: document.getElementById("scheduleDots").value,
//         periodIDs: document.getElementById("schedulePeriodIDs").hidden ? null : arr,
//         timestamps: document.getElementById("scheduleTimestamps").hidden ? null : arr2,
//         title: document.getElementById("scheduleTitle").value
//     }
//     let len = document.getElementsByClassName("scheduleIDsClass").length;
//     set(child(db, 'schedules/' + firebaseTitle), newSchedule).then(alert('added schedule ID named ' + document.getElementById("scheduleTitle").value));
//     set(child(db, 'scheduleIDs/' + len), firebaseTitle);
//     document.getElementById("scheduleIDsList").innerHTML = "";
//     renderScheduleIDs();
// });
