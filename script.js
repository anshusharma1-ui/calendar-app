let editIndex = null;
let selectedDate = null;
const monthViewBtn =
document.getElementById("monthViewBtn");
const agendaView =
document.getElementById(
    "agendaView"
);

const weekViewBtn =
document.getElementById("weekViewBtn");

const dayViewBtn =
document.getElementById("dayViewBtn");
const weekView =
document.getElementById("weekView");
const dayView =
document.getElementById("dayView");
const sidebarTodayBtn =
document.getElementById("sidebarTodayBtn");
const importFile =
document.getElementById("importFile");
const eventCategory =
document.getElementById("eventCategory");
const filterCategory =
document.getElementById("filterCategory");

let selectedCategory = "All";
const exportBtn =
document.getElementById("exportBtn");
const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("monthYear");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const todayBtn = document.getElementById("todayBtn");

const modal = document.getElementById("eventModal");
const closeModal = document.getElementById("closeModal");

const eventInput = document.getElementById("eventInput");
const eventTime = document.getElementById("eventTime");
const eventDesc = document.getElementById("eventDesc");
const eventColor = document.getElementById("eventColor");

const saveEventBtn = document.getElementById("saveEventBtn");
const createBtn =
document.getElementById("createBtn");
const searchInput =
document.getElementById("searchInput");
const loginBtn =
document.getElementById("loginBtn");

const logoutBtn =
document.getElementById("logoutBtn");
const userInfo =
document.getElementById("userInfo");

const userPhoto =
document.getElementById("userPhoto");

const userName =
document.getElementById("userName");

const userEmail =
document.getElementById("userEmail");
const tooltip = document.getElementById("tooltip");
const eventsList =
document.getElementById("eventsList");

const eventsPanel =
document.querySelector(".events-panel");

let events =
JSON.parse(localStorage.getItem("calendarEvents")) || {};

let currentDate = new Date();
let searchText = "";
let currentView = "month";

let festivalEvents = {};
let isOnline = navigator.onLine;
window.addEventListener("online", () => {

    isOnline = true;

    console.log("Internet Connected");

});

window.addEventListener("offline", () => {

    isOnline = false;

    console.log("Internet Disconnected");

});

function saveEvents() {
    localStorage.setItem(
        "calendarEvents",
        JSON.stringify(events)
    );
}
async function saveEventsToFirebase() {
    console.log("window.db =", window.db);
console.log("window.doc =", window.doc);
console.log("window.setDoc =", window.setDoc);

    console.log("Firebase Function Started");
    if(!window.currentUser){

    alert("Please Login First");

    return;
}

    try {

        await window.setDoc(
            window.doc(
    window.db,
    "users",
    window.currentUser.uid
),
            {
                events: events
            }
        );

        console.log("Events Saved To Firestore");

    } catch(error) {

        console.error(
            "Firestore Save Error:",
            error
        );

    }

}
async function loadEventsFromFirebase(){
    console.log("Current User:", window.currentUser);
    if(!window.currentUser){

    return;
}

    try{

        const docSnap = await window.getDoc(
    window.doc(
        window.db,
        "users",
        window.currentUser.uid
    )
);

        if(docSnap.exists()){

    events = docSnap.data().events || {};

    localStorage.setItem(
        "calendarEvents",
        JSON.stringify(events)
    );

    console.log("Events Loaded From Firebase");

}
    }catch(error){

        console.error(
            "Firebase Load Error:",
            error
        );

    }

}
window.loadEventsFromFirebase = loadEventsFromFirebase;
function startRealtimeSync(){

    if(!window.currentUser){

        return;

    }

    window.onSnapshot(

        window.doc(
            window.db,
            "users",
            window.currentUser.uid
        ),

        (docSnap) => {

            if(docSnap.exists()){

                events = docSnap.data().events || {};

                localStorage.setItem(
                    "calendarEvents",
                    JSON.stringify(events)
                );

                renderCalendar();

                console.log(
                    "Realtime Sync Updated"
                );

            }

        }

    );

}
window.startRealtimeSync = startRealtimeSync;
closeModal.addEventListener("click", () => {

    modal.style.display = "none";

    editIndex = null;

});
function showEvents(dateKey){

    eventsList.innerHTML = "";

    if(
        !events[dateKey] ||
        events[dateKey].length === 0
    ){

        eventsList.innerHTML = `
        <p>No Events Found</p>
        `;

        return;
    }

    events[dateKey].forEach(event => {

        const card =
        document.createElement("div");

        card.classList.add("event-card");

        card.innerHTML = `
    <h3>${event.title}</h3>
    <p>📂 ${event.category || "General"}</p>
    <p>⏰ ${event.time || "No Time"}</p>
    <p>📝 ${event.desc || ""}</p>
`;

        eventsList.appendChild(card);

    });
}
function renderWeekView(){

    weekView.innerHTML = "";

    const start =
    new Date(currentDate);

    start.setDate(
        currentDate.getDate()
        - currentDate.getDay()
    );

    for(let i=0;i<7;i++){

        const date =
        new Date(start);

        date.setDate(
            start.getDate()+i
        );

        const key =
`${date.getFullYear()}-${
String(date.getMonth() + 1).padStart(2,"0")
}-${
String(date.getDate()).padStart(2,"0")
}`;
        const box =
        document.createElement("div");
        box.addEventListener("click", () => {

    selectedDate = key;

    currentView = "day";

    renderCalendar();

});

        box.classList.add(
            "week-day-box"
        );

        box.innerHTML = `
        <h3>
        ${date.toLocaleDateString(
        "en-US",
        {weekday:"short"}
        )}
        </h3>

        <strong>
        ${date.getDate()}
        </strong>
        `;

        if(events[key]){

            events[key].forEach(
            event => {

                const div =
                document.createElement(
                "div"
                );

                div.classList.add(
                "event-dot"
                );

                div.textContent =
                event.title;

                box.appendChild(div);

            });

        }

        weekView.appendChild(box);
    }
}
function renderDayView(){

const formattedDate =
new Date(selectedDate)
.toLocaleDateString(
    "en-IN",
    {
        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric"
    }
);
   dayView.innerHTML = `
<h2 class="day-view-title">
${formattedDate}
</h2>
`;

    const key = selectedDate;
    if(festivalEvents[key]){

    dayView.innerHTML += `
        <div class="day-view-card">
            <h3>🎉 ${festivalEvents[key]}</h3>
            <p>National Holiday / Festival</p>
        </div>
    `;
}

    if(
    !events[key] ||
    events[key].length === 0
){

    dayView.innerHTML += `
    <h3>No Events Today</h3>
    `;

    return;
}

    events[key].forEach(event => {

        const card =
        document.createElement("div");

        card.classList.add(
            "day-view-card"
        );

        card.innerHTML = `
<div class="event-header">

    <h3>${event.title}</h3>

    <span class="event-category">
        ${event.category || "General"}
    </span>

</div>

<div class="event-time">
    ⏰ ${event.time || "No Time"}
</div>

<div class="event-desc">
    📝 ${event.desc || "No Description"}
</div>
`;

        dayView.appendChild(card);

    });

}


function renderCalendar() {
    console.log(
  "Current Month:",
  currentDate.getMonth() + 1,
  currentDate.getFullYear()
);

        tooltip.style.display = "none";
    
    if(currentView === "day"){

    eventsPanel.style.display = "none";

    daysContainer.style.display = "none";

    weekView.style.display = "none";

    dayView.style.display = "block";

    renderDayView();

    return;
}
eventsPanel.style.display = "block";
dayView.style.display = "none";
    if(currentView === "week"){

    daysContainer.style.display =
    "none";

    weekView.style.display =
    "grid";

    renderWeekView();

    return;
}
daysContainer.style.display =
"grid";

weekView.style.display =
"none";

    daysContainer.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay =
        new Date(year, month, 1).getDay();

    const lastDate =
        new Date(year, month + 1, 0).getDate();

    const monthNames = [
        "January","February","March",
        "April","May","June",
        "July","August","September",
        "October","November","December"
    ];

    monthYear.textContent =
        `${monthNames[month]} ${year}`;

    for(let i=0; i<firstDay; i++){

        const empty =
            document.createElement("div");

        daysContainer.appendChild(empty);
    }

    for(let day=1; day<=lastDate; day++){

        const dayBox =
            document.createElement("div");

        dayBox.classList.add("day");

        dayBox.textContent = day;

        const eventKey =
`${year}-${
String(month + 1).padStart(2,"0")
}-${
String(day).padStart(2,"0")
}`;
if(day === 17){
    console.log("Checking:", eventKey);
    console.log(events[eventKey]);
}
            dayBox.addEventListener("click", () => {

    selectedDate = eventKey;

    showEvents(eventKey);

});

       dayBox.addEventListener("dblclick", () => {

    selectedDate = eventKey;

    eventInput.value = "";
    eventTime.value = "";
    eventDesc.value = "";

    modal.style.display = "flex";

});

        const today = new Date();

        if(
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ){
            dayBox.classList.add("today");
        }

        if(events[eventKey] && events[eventKey].length > 1){

    const count = document.createElement("div");

    count.classList.add("event-count");

    count.textContent =
    events[eventKey].length;

    dayBox.appendChild(count);
}
if(festivalEvents[eventKey]){

    const festivalDiv =
    document.createElement("div");

    festivalDiv.classList.add(
        "festival-event"
    );

    festivalDiv.textContent =
    "🎉 " +
    festivalEvents[eventKey];

    dayBox.appendChild(
        festivalDiv
    );

}
        if(events[eventKey]){

            events[eventKey].forEach((event,index)=>{
                if(
    selectedCategory !== "All" &&
    event.category !== selectedCategory
){
    return;
}

    if(
        searchText &&
        !(event.title || "")
.toLowerCase()
.includes(searchText)
    ){
        return;
    }

                const eventDiv =
                    document.createElement("div");

                eventDiv.classList.add("event-dot");

             eventDiv.textContent =
(event.title || "").length > 15
? event.title.substring(0,15) + "..."
: event.title;

eventDiv.addEventListener("click", (e) => {
    e.stopPropagation();
});
eventDiv.addEventListener("dblclick", (e) => {

    e.stopPropagation();

    selectedDate = eventKey;
    editIndex = index;

    eventInput.value = event.title || "";
    eventTime.value = event.time || "";
    eventDesc.value = event.desc || "";
    eventColor.value = event.color || "#5b6cff";

    modal.style.display = "flex";
});

                if(event.color){
                    eventDiv.style.background =
                        event.color;
                }

             eventDiv.addEventListener("mouseenter", () => {

    tooltip.innerHTML = `
        <b>${event.title}</b><br>
        ⏰ ${event.time || "No Time"}<br>
        📝 ${event.desc || ""}
    `;

     const rect =
    eventDiv.getBoundingClientRect();

    tooltip.style.left =
    rect.left + "px";

    tooltip.style.top =
    (rect.top - tooltip.offsetHeight - 10) + "px";

    tooltip.style.display =
    "block";
});

                eventDiv.addEventListener(
                    "mouseleave",
                    () => {

                        tooltip.style.display =
                            "none";
                    }
                );

                eventDiv.addEventListener(
                    "contextmenu",
                    (e) => {

                        e.preventDefault();
e.stopPropagation();

                       if(
    confirm(
        "Delete this event?"
    )
){

    tooltip.style.display = "none";

    events[eventKey]
        .splice(index,1);

    if(
        events[eventKey]
        .length === 0
    ){
        delete events[eventKey];
    }

    saveEvents();
    saveEventsToFirebase();

    showEvents(eventKey);

    renderCalendar();
}
                    }
                );

                dayBox.appendChild(eventDiv);

            });

        }

        daysContainer.appendChild(dayBox);
    }
}
window.renderCalendar = renderCalendar;

saveEventBtn.addEventListener(
    "click",
    () => {
        console.log("Save Button Clicked");
        if(selectedDate === null){

    alert("Please select a date first");

    return;
}

        const title =
            eventInput.value.trim();

        if(!title) return;

        const eventData = {

    title : title,

    time : eventTime.value,

    desc : eventDesc.value,

    color : eventColor.value,

    category : eventCategory.value
};
        if(!events[selectedDate]){

            events[selectedDate] = [];
        }

        if(editIndex !== null){

    events[selectedDate][editIndex] =
    eventData;

    editIndex = null;

}else{

    events[selectedDate].push(eventData);
    events[selectedDate].sort((a,b)=>{

    return (a.time || "")
    .localeCompare(b.time || "");

});

}

        saveEvents();

        saveEventsToFirebase();

        modal.style.display = "none";

        renderCalendar();
    }
);

prevBtn.addEventListener(
    "click",
    async () => {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );
       await loadFestivals();

        renderCalendar();
    }
);

nextBtn.addEventListener(
    "click",
    async () => {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );
        await loadFestivals();

        renderCalendar();
    }
);

todayBtn.addEventListener(
    "click",
    () => {

        currentDate = new Date();

        renderCalendar();
    }
);
searchInput.addEventListener("input", () => {

    searchText =
    searchInput.value.toLowerCase();

    renderCalendar();

});
createBtn.addEventListener("click", () => {

    const today = new Date();

    selectedDate =
`${today.getFullYear()}-${
String(today.getMonth()+1).padStart(2,"0")
}-${
String(today.getDate()).padStart(2,"0")
}`;

    eventInput.value = "";
    eventTime.value = "";
    eventDesc.value = "";

    modal.style.display = "flex";

});
async function loadFestivals() {

    try {

        const response = await fetch("./festivals.json");

        if (!response.ok) {

            console.warn("Festival JSON not found!");

            festivalEvents = {};

            renderCalendar();

            return;

        }

        festivalEvents = await response.json();

        console.log("Festival Data:", festivalEvents);

        renderCalendar();

    }
    catch (error) {

        console.error("Festival Load Error:", error);

        festivalEvents = {};

        renderCalendar();

    }

}
function renderMiniCalendar(){

    const mini =
    document.getElementById("miniCalendar");

    const today = new Date();

    mini.innerHTML = `
        <h3>
        ${today.toLocaleString("default",
        {month:"long"})}
        ${today.getFullYear()}
        </h3>

        <p>
        Today: ${today.getDate()}
        </p>
    `;
}
filterCategory.addEventListener(
    "change",
    () => {

        selectedCategory =
        filterCategory.value;

        renderCalendar();

    }
);
exportBtn.addEventListener(
    "click",
    () => {

        const data =
        JSON.stringify(
            events,
            null,
            2
        );

        const blob =
        new Blob(
            [data],
            {
                type:
                "application/json"
            }
        );

        const a =
        document.createElement("a");

        a.href =
        URL.createObjectURL(blob);

        a.download =
        "calendar-events.json";

        a.click();

    }
);
importFile.addEventListener(
    "change",
    (e) => {

        const file =
        e.target.files[0];

        if(!file) return;

        const reader =
        new FileReader();

        reader.onload = function(){

    try{

        const importedEvents =
        JSON.parse(reader.result);

        console.log(
            "Imported Data:",
            importedEvents
        );

        const fixedEvents = {};

Object.keys(importedEvents).forEach(key => {

    const parts = key.split("-");

    const newKey =
    `${parts[0]}-${
        parts[1].padStart(2,"0")
    }-${
        parts[2].padStart(2,"0")
    }`;

    fixedEvents[newKey] =
    importedEvents[key];

});

events = fixedEvents;

        saveEvents();

        renderCalendar();

        alert(
            "Events Imported Successfully"
        );

    }catch(error){

        console.error(error);

        alert(
            "Invalid JSON File"
        );

    }

};

        reader.readAsText(file);

    }
);
monthViewBtn.addEventListener("click", () => {

    currentView = "month";

    renderCalendar();

});

weekViewBtn.addEventListener("click", () => {

    currentView = "week";

    renderCalendar();

});

dayViewBtn.addEventListener("click", () => {

    if(!selectedDate){

        alert("Please select a date first");

        return;
    }

    currentView = "day";

    renderCalendar();

});

sidebarTodayBtn.addEventListener("click", () => {

    currentDate = new Date();

    renderCalendar();

});

async function startApp(){


    await loadFestivals();

    renderCalendar();

}

window.addEventListener("load", () => {
    startApp();
});
loginBtn.addEventListener(
"click",
async () => {

try{

const result =
await window.signInWithPopup(
window.auth,
window.provider
);

alert(
"Welcome " +
result.user.displayName
);
await loadEventsFromFirebase();

renderCalendar();

}
catch(error){

console.error(error);

}

});
logoutBtn.addEventListener(
"click",
async () => {

await window.signOut(
window.auth
);

alert("Logged Out");
    document.getElementById("userPhoto").src = "";

document.getElementById("userName").textContent = "";

document.getElementById("userEmail").textContent = "";

});
