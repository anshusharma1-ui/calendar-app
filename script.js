let editIndex = null;
let selectedDate = null;
const aiEventBtn = document.getElementById("aiEventBtn");
const aiModal = document.getElementById("aiModal");
const closeAiModal = document.getElementById("closeAiModal");
const aiPrompt = document.getElementById("aiPrompt");
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
const eventReminder =
document.getElementById("eventReminder");
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
const undoToast =
document.getElementById("undoToast");

const undoBtn =
document.getElementById("undoBtn");
const eventsList =
document.getElementById("eventsList");

const eventsPanel =
document.querySelector(".events-panel");

let events =
JSON.parse(localStorage.getItem("calendarEvents")) || {};

let currentDate = new Date();
let notifiedEvents = {};
let lastDeletedEvent = null;
let undoTimer = null;
let searchText = "";
let currentView = "month";

let festivalEvents = {};
let isOnline = navigator.onLine;
const internetStatus =
document.getElementById("internetStatus");

function showInternetStatus(message, color){

    internetStatus.textContent = message;

    internetStatus.style.background = color;

    internetStatus.style.display = "block";

    clearTimeout(window.internetStatusTimer);

    window.internetStatusTimer = setTimeout(() => {

        internetStatus.style.display = "none";

    }, 3000);

}
console.log("Current Internet Status:", isOnline);
window.addEventListener("online", () => {

    isOnline = true;

    console.log("Internet Connected");

    showInternetStatus(
        "🟢 Internet Connected",
        "#22c55e"
    );

});

window.addEventListener("offline", () => {

    isOnline = false;

    console.log("Internet Disconnected");

    showInternetStatus(
        "🔴 Internet Disconnected",
        "#ef4444"
    );

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
function showUndoToast(){

    undoToast.style.display = "flex";

    clearTimeout(undoTimer);

    undoTimer = setTimeout(() => {

        undoToast.style.display = "none";

        lastDeletedEvent = null;

    }, 5000);

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
function renderAgendaView() {

    agendaView.innerHTML = "";

    const allEvents = [];

    Object.keys(events).forEach(date => {

        events[date].forEach(event => {

            allEvents.push({

                date: date,

                ...event

            });

        });

    });

    allEvents.sort((a, b) => {

        return new Date(a.date + " " + (a.time || "00:00")) -
               new Date(b.date + " " + (b.time || "00:00"));

    });

    if (allEvents.length === 0) {

        agendaView.innerHTML = "<h3>No Events Found</h3>";

        return;

    }

    allEvents.forEach(event => {

        const card = document.createElement("div");

        card.className = "agenda-card";

        card.innerHTML = `

            <h3>${event.title}</h3>

            <p>📅 ${event.date}</p>

            <p>⏰ ${event.time || "No Time"}</p>

            <p>📂 ${event.category || "General"}</p>

            <p>${event.desc || ""}</p>

        `;

        agendaView.appendChild(card);

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
if(currentView === "agenda"){

    eventsPanel.style.display = "none";

    daysContainer.style.display = "none";

    weekView.style.display = "none";

    dayView.style.display = "none";

    agendaView.style.display = "block";

    renderAgendaView();

    return;

}
eventsPanel.style.display = "block";
dayView.style.display = "none";
agendaView.style.display = "none";
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
    eventReminder.value = "0";

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
        let dayEvents = [...(events[eventKey] || [])];
        Object.keys(events).forEach(originalDate => {

    events[originalDate].forEach(event => {

        if (!event.repeat || event.repeat === "none") {

            return;

        }

        const original = new Date(originalDate);
        const current = new Date(eventKey);

        let show = false;

        if (event.repeat === "daily") {

            show = current > original;

        }

        else if (event.repeat === "weekly") {

            show =
                current > original &&
                current.getDay() === original.getDay();

        }

        else if (event.repeat === "monthly") {

            show =
                current > original &&
                current.getDate() === original.getDate();

        }

        else if (event.repeat === "yearly") {

            show =
                current > original &&
                current.getDate() === original.getDate() &&
                current.getMonth() === original.getMonth();

        }

        if (show) {

            dayEvents.push({

                ...event,

                repeated: true

            });

        }

    });

});

if(events[eventKey]){

    dayEvents.forEach((event,index)=>{
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
                if (event.repeated) {

    eventDiv.style.opacity = "0.75";

    eventDiv.style.border = "1px dashed white";

}

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
    eventCategory.value =
event.category || "Personal";

eventReminder.value =
event.reminder || 0;

document.getElementById("eventRepeat").value =
event.repeat || "none";

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

    lastDeletedEvent = {

    date: eventKey,

    index: index,

    event: {...events[eventKey][index]}

};

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
    showUndoToast();
}
                    }
                );

                dayBox.appendChild(eventDiv);

            });

        }

        daysContainer.appendChild(dayBox);
    }

        updateStatistics();
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
const title = eventInput.value.trim();

if (!title) {

    alert("Please enter event title");

    return;

}

       const eventData = {

    title: eventInput.value.trim(),

    time: eventTime.value,

    desc: eventDesc.value,

    color: eventColor.value,

    category: eventCategory.value,

    reminder: Number(eventReminder.value),

    repeat: document.getElementById("eventRepeat").value

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
    eventReminder.value = "0";
    eventCategory.value = "Personal";

eventColor.value = "#5b6cff";

document.getElementById("eventRepeat").value = "none";

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
function updateStatistics(){

    let total = 0;
    let personal = 0;
    let work = 0;
    let study = 0;

    Object.keys(events).forEach(date => {

        events[date].forEach(event => {

            total++;

            if(event.category === "Personal"){

                personal++;

            }
            else if(event.category === "Work"){

                work++;

            }
            else if(event.category === "Study"){

                study++;

            }

        });

    });

    document.getElementById("totalEvents").textContent = total;
    document.getElementById("personalCount").textContent = personal;
    document.getElementById("workCount").textContent = work;
    document.getElementById("studyCount").textContent = study;

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
const agendaViewBtn = document.getElementById("agendaViewBtn");

agendaViewBtn.addEventListener("click", () => {

    currentView = "agenda";

    renderCalendar();

});

sidebarTodayBtn.addEventListener("click", () => {

    currentDate = new Date();

    renderCalendar();

});
async function requestNotificationPermission(){
    console.log("Notification Function Called");

    if(!("Notification" in window)){

        console.log("Browser Notification Support Nahi Hai");

        return;

    }

    if(Notification.permission === "default"){

        const permission =
        await Notification.requestPermission();

        console.log(
            "Notification Permission:",
            permission
        );

    }

}
function showTestNotification(){

    if(Notification.permission !== "granted"){

        return;

    }

    new Notification(
        "📅 Anshu Calendar",
        {
            body: "Notification Successfully Working!",
            icon: "favicon-32x32.png"
        }
    );

}
function showEventNotification(title, body){

    if(Notification.permission !== "granted"){

        return;

    }

    console.log("Notification Sent:", title);

    new Notification(title, {

        body: body,

        icon: "favicon-32x32.png"

    });

}
function checkEventReminders(){
    console.log("Reminder Checker Running");

    const now = new Date();

    const todayKey =
`${now.getFullYear()}-${
String(now.getMonth()+1).padStart(2,"0")
}-${
String(now.getDate()).padStart(2,"0")
}`;

    if(!events[todayKey]){

        return;

    }

    events[todayKey].forEach(event => {
        console.log(event);

        if(!event.time){

            return;

        }

        const [hour, minute] =
        event.time.split(":").map(Number);

        const eventTime =
        new Date(now);

        eventTime.setHours(hour);
        eventTime.setMinutes(minute);
        eventTime.setSeconds(0);

        const reminderTime =
        new Date(
            eventTime.getTime() -
            (event.reminder || 0) * 60000
        );

        const id =
        todayKey +
        event.title +
        event.time;

        if(
            now >= reminderTime &&
            now < new Date(reminderTime.getTime()+60000) &&
            !notifiedEvents[id]
        ){

            showEventNotification(

                "📅 " + event.title,

                "Event starts at " + event.time

            );

            notifiedEvents[id] = true;

        }

    });

}

async function startApp(){

    await requestNotificationPermission();

    await loadFestivals();

    renderCalendar();

    checkEventReminders();

    setInterval(checkEventReminders, 60000);

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
// AI Modal Open

aiEventBtn.addEventListener("click", () => {

    aiModal.style.display = "flex";

    aiPrompt.focus();

});

// AI Modal Close

closeAiModal.addEventListener("click", () => {

    aiModal.style.display = "none";

});

// Outside Click Close

window.addEventListener("click", (e) => {

    if (e.target === aiModal) {

        aiModal.style.display = "none";

    }

});
const generateAiEvent = document.getElementById("generateAiEvent");

generateAiEvent.addEventListener("click", () => {

    const text = aiPrompt.value.trim();

    if (!text) {

        alert("Please write your event.");

        return;

    }

    parseAIEvent(text);

});

function parseAIEvent(text) {

    console.log("AI Input:", text);

    const input = text.toLowerCase();
    // TIME PARSER

let eventHour = null;
let eventMinute = 0;

const timeMatch = input.match(/(\d{1,2})(?::(\d{2}))?/);
    console.log("Time Match:", timeMatch);

if (timeMatch) {

    eventHour = parseInt(timeMatch[1]);

    if (timeMatch[2]) {

        eventMinute = parseInt(timeMatch[2]);

    }

    // PM
    if (
        input.includes("pm") ||
        input.includes("shaam") ||
        input.includes("raat")
    ) {

        if (eventHour < 12) {

            eventHour += 12;

        }

    }

    // AM
    if (
        input.includes("am") ||
        input.includes("subah")
    ) {

        if (eventHour === 12) {

            eventHour = 0;

        }

    }

}

console.log("Detected Time:", eventHour, eventMinute);

    let eventDate = null;

    if (
        input.includes("today") ||
        input.includes("aaj")
    ) {

        eventDate = new Date();

    }

    else if (
        input.includes("tomorrow") ||
        input.includes("kal")
    ) {

        eventDate = new Date();

        eventDate.setDate(eventDate.getDate() + 1);

    }

    else if (
        input.includes("parso")
    ) {

        eventDate = new Date();

        eventDate.setDate(eventDate.getDate() + 2);

    }

    // Date Detect (15 August, 1 July etc.)

const monthNames = {

    january:0,
    february:1,
    march:2,
    april:3,
    may:4,
    june:5,
    july:6,
    august:7,
    september:8,
    october:9,
    november:10,
    december:11

};

const dateMatch = input.match(/(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)/);
console.log("Date Match:", dateMatch);

if (dateMatch) {

    const day = parseInt(dateMatch[1]);

    const month = monthNames[dateMatch[2]];

    const year = new Date().getFullYear();

    eventDate = new Date(year, month, day);

    console.log("Detected Month Date:", eventDate);

}

    if (eventDate) {

        console.log("Detected Date:", eventDate);

    } else {

        console.log("No Date Found");

    }
    // Event Title Detect

let title = text;

title = title.replace(/kal/gi, "");
title = title.replace(/aaj/gi, "");
title = title.replace(/parso/gi, "");
title = title.replace(/today/gi, "");
title = title.replace(/tomorrow/gi, "");

title = title.replace(/subah/gi, "");
title = title.replace(/shaam/gi, "");
title = title.replace(/raat/gi, "");
title = title.replace(/dopahar/gi, "");

title = title.replace(/\d{1,2}(:\d{2})?/g, "");
title = title.replace(/baje/gi, "");
title = title.replace(/am/gi, "");
title = title.replace(/pm/gi, "");

title = title.replace(
/\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)/gi,
""
);
title = title.trim();

console.log("Detected Title:", title);
    // Category Detect

let category = "Personal";

const workWords = [
    "office",
    "meeting",
    "client",
    "boss",
    "project",
    "interview",
    "job",
    "work"
];

const studyWords = [
    "study",
    "exam",
    "class",
    "school",
    "college",
    "homework",
    "assignment",
    "test",
    "math",
    "science",
    "physics",
    "chemistry"
];

for (const word of workWords) {

    if (input.includes(word)) {

        category = "Work";
        break;

    }

}

for (const word of studyWords) {

    if (input.includes(word)) {

        category = "Study";
        break;

    }

}

console.log("Detected Category:", category);
    // Color Detect

let color = "#7a42ff"; // Personal = Purple

if (category === "Work") {

    color = "#4285F4"; // Blue

}

else if (category === "Study") {

    color = "#00b894"; // Green

}

console.log("Detected Color:", color);
// Repeat Detect

let repeat = "none";

if (
    input.includes("har roz") ||
    input.includes("daily") ||
    input.includes("every day")
) {

    repeat = "daily";

}

else if (
    input.includes("har monday") ||
    input.includes("har tuesday") ||
    input.includes("har wednesday") ||
    input.includes("har thursday") ||
    input.includes("har friday") ||
    input.includes("har saturday") ||
    input.includes("har sunday") ||
    input.includes("every monday") ||
    input.includes("every tuesday") ||
    input.includes("every wednesday") ||
    input.includes("every thursday") ||
    input.includes("every friday") ||
    input.includes("every saturday") ||
    input.includes("every sunday")
) {

    repeat = "weekly";

}

else if (

    input.includes("monthly") ||

    input.includes("har mahina")

) {

    repeat = "monthly";

}

else if (

    input.includes("birthday") ||

    input.includes("janamdin") ||

    input.includes("yearly") ||

    input.includes("har saal")

) {

    repeat = "yearly";

}

console.log("Detected Repeat:", repeat);

// Weekday Detect

const weekDays = [

    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"

];

for (let i = 0; i < weekDays.length; i++) {

    if (input.includes(weekDays[i])) {

        const today = new Date();

        eventDate = new Date(today);

        while (eventDate.getDay() !== i) {

            eventDate.setDate(
                eventDate.getDate() + 1
            );

        }

        break;

    }

}
const hindiWeekDays = {

    "ravivar": 0,
    "itwar": 0,

    "somvar": 1,
    "somvaar": 1,

    "mangalvar": 2,

    "budhvar": 3,

    "guruvar": 4,
    "guruwar": 4,

    "shukravar": 5,

    "shanivar": 6

};

for (const dayName in hindiWeekDays) {

    if (input.includes(dayName)) {

        const today = new Date();

        eventDate = new Date(today);

        while (
            eventDate.getDay() !==
            hindiWeekDays[dayName]
        ) {

            eventDate.setDate(
                eventDate.getDate() + 1
            );

        }

        break;

    }

}

    if (!eventDate) {

    alert("Date samajh nahi aayi.");

    return;

}

const dateKey =
`${eventDate.getFullYear()}-${
String(eventDate.getMonth() + 1).padStart(2,"0")
}-${
String(eventDate.getDate()).padStart(2,"0")
}`;

const timeString =
`${String(eventHour || 0).padStart(2,"0")}:${
String(eventMinute || 0).padStart(2,"0")
}`;

const eventData = {

    title: title || "New Event",

    time: timeString,

    desc: "",

    color: color,

    category: category,

    reminder: 10,

    repeat: repeat,

    createdBy: "AI"

};

if (!events[dateKey]) {

    events[dateKey] = [];

}

events[dateKey].push(eventData);
events[dateKey].sort((a, b) => {

    return (a.time || "")
        .localeCompare(b.time || "");

});

saveEvents();

saveEventsToFirebase();

selectedDate = dateKey;

renderCalendar();

showEvents(dateKey);

aiModal.style.display = "none";

aiPrompt.value = "";

alert("✅ AI Event Created Successfully");

}
undoBtn.addEventListener("click", () => {

    if (!lastDeletedEvent) {

        return;

    }

    if (!events[lastDeletedEvent.date]) {

        events[lastDeletedEvent.date] = [];

    }

    events[lastDeletedEvent.date].splice(

        lastDeletedEvent.index,

        0,

        lastDeletedEvent.event

    );

    saveEvents();

    saveEventsToFirebase();

    renderCalendar();

    if (selectedDate === lastDeletedEvent.date) {

        showEvents(selectedDate);

    }

    undoToast.style.display = "none";

    clearTimeout(undoTimer);

    lastDeletedEvent = null;

});
