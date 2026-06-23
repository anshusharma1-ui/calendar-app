console.log("SCRIPT VERSION 2");
git add .
git commit -m "script updated"
git push
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
const API_KEY = "jpihddqq3MvCK1Obd7vonVQrTiBg2asN";

let festivalEvents = {};

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

    try {

        await window.setDoc(
            window.doc(
                window.db,
                "calendar",
                "events"
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
        date.getMonth()
        }-${
        date.getDate()
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
${selectedDate}
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

        dayView.innerHTML =
        "<h3>No Events Today</h3>";

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

const realDate =
`${year}-${
String(month + 1).padStart(2,"0")
}-${
String(day).padStart(2,"0")
}`;
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
    () => {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );
        loadFestivals(
currentDate.getFullYear()
);

        renderCalendar();
    }
);

nextBtn.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );
        loadFestivals(
currentDate.getFullYear()
);

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
async function loadFestivals(year){

    try{

        const response = await fetch(
            `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=IN&year=${year}`
        );

        const data = await response.json();

        festivalEvents = {};

        data.response.holidays.forEach(holiday => {

            festivalEvents[holiday.date.iso] = holiday.name;

        });
        console.log("Festival Data:", festivalEvents);

        renderCalendar();

    }
    catch(error){

        console.error(
            "Festival Load Error:",
            error
        );

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

loadFestivals(
currentDate.getFullYear()
);

renderCalendar();
