
var btnAlarm = document.querySelector("#btnAlarm");
var btnHome = document.querySelector("#btnHome");
var btnSetting = document.querySelector("#btnSetting");
var btnLeaderboard = document.querySelector("#btnLeaderboard");
var Alarm = document.querySelector("#Alarm");
var Home = document.querySelector("#Home");
var Setting = document.querySelector("#Setting");
var Leaderboard = document.querySelector("#Leaderboard");
var calendertable = document.querySelector(".contest_table");
var alarmtable = document.querySelector(".remIsSet");
var todaybtn = document.querySelector("#today");
var upcomingbtn = document.querySelector("#upcoming");
var fil = document.querySelector("#filter");

var host_sites = ['codeforces.com', 'codechef.com', 'atcoder.jp', 'leetcode.com', 'codingninjas.com/codestudio', 'hackerearth.com', 'geeksforgeeks.org', 'topcoder.com'];
var hosts = `codechef.com%2Ccodeforces.com%2Cgeeksforgeeks.org%2Chackerearth.com%2Cleetcode.com%2Ctopcoder.com%2Catcoder.jp%2Ccodingninjas.com/codestudio`;
var today = false;
const iddata = new Map();
var apiData;
let dur = 24 * 60 * 60;

if (localStorage.getItem("alarms") === null) {
	localStorage.setItem("alarms", JSON.stringify([]));
}

fil.addEventListener('change', () => {
	var temp = fil.value;
	if (temp === "dur3")
		dur = 3 * 60 * 60;
	if (temp === "dur24")
		dur = 24 * 60 * 60;
	if (temp === "durg24")
		dur = 365 * 24 * 60 * 60;
	render();
	// console.log(dur);
})


// ------TOOGLE-------------


btnAlarm.addEventListener('click', () => {
	Home.classList.add("hidden");
	Setting.classList.add("hidden");
	Alarm.classList.remove("hidden");
	Leaderboard.classList.add("hidden");
	btnAlarm.classList.add("okactive");
	btnHome.classList.remove("okactive");
	btnSetting.classList.remove("okactive");
	btnLeaderboard.classList.remove("okactive");
})

btnHome.addEventListener('click', () => {
	Alarm.classList.add("hidden");
	Setting.classList.add("hidden");
	Leaderboard.classList.add("hidden");
	Home.classList.remove("hidden");
	btnAlarm.classList.remove("okactive");
	btnHome.classList.add("okactive");
	btnSetting.classList.remove("okactive");
	btnLeaderboard.classList.remove("okactive");
})

btnSetting.addEventListener('click', () => {
	Home.classList.add("hidden");
	Alarm.classList.add("hidden");
	Setting.classList.remove("hidden");
	Leaderboard.classList.add("hidden");
	btnAlarm.classList.remove("okactive");
	btnHome.classList.remove("okactive");
	btnSetting.classList.add("okactive");
	btnLeaderboard.classList.remove("okactive");
})

btnLeaderboard.addEventListener('click', () => {
	Home.classList.add("hidden");
	Alarm.classList.add("hidden");
	Setting.classList.add("hidden");
	Leaderboard.classList.remove("hidden");
	btnAlarm.classList.remove("okactive");
	btnHome.classList.remove("okactive");
	btnSetting.classList.remove("okactive");
	btnLeaderboard.classList.add("okactive");
})

todaybtn.addEventListener('click', () => {
	today = true;
	todaybtn.classList.add("okactive");
	upcomingbtn.classList.remove("okactive");
	render();
})

upcomingbtn.addEventListener('click', () => {
	today = false;
	todaybtn.classList.remove("okactive");
	upcomingbtn.classList.add("okactive");
	render();
})

//--------------------------

//------------map logo png with host site----------------

const logo = new Map();
logo.set('atcoder.jp', 'atcoder.png');
logo.set('leetcode.com', 'leetcode.png');
logo.set('topcoder.com', 'topcoder.png');
logo.set('codechef.com', 'codechef.png');
logo.set('codeforces.com', 'codeforces.png');
logo.set('hackerearth.com', 'HackerEarth.png');
logo.set('geeksforgeeks.org', 'GeeksforGeeks.png');
logo.set('codingninjas.com/codestudio', 'codingNinja.png');

const platform = new Map();
platform.set('atcoder.jp', 'atcoder');
platform.set('leetcode.com', 'leetcode');
platform.set('topcoder.com', 'topcoder');
platform.set('codechef.com', 'codechef');
platform.set('codeforces.com', 'codeforces');
platform.set('hackerearth.com', 'Hacker Earth');
platform.set('geeksforgeeks.org', 'Geeks for Geeks');
platform.set('codingninjas.com/codestudio', 'coding Ninja');

//-------------------------------------------------------


function scrollToTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

//------------------ Host Extraction from local storage---------------


var host;
if (localStorage.getItem('host-sites') === null) { host = host_sites; localStorage.setItem('host-sites', JSON.stringify(host_sites)); }
else { host = JSON.parse(localStorage.getItem('host-sites')); }
host.forEach(function (host_site) {
	document.getElementsByName(`${host_site}`)[0].checked = true;
})

//--------------------------------------------------------------------

//-------------------------Time Calculation---------------------------

var curr_time = new Date();
const curr_time_api_temp = curr_time.toISOString().substring(0, 11) + curr_time.toISOString().substring(11, 19);
var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0o0, 0o0, 0o0);
var day15back = new Date();
day15back.setDate(day15back.getDate() - 15);    // For checking atleast 15day last contests
day15back.setHours(0o0, 0o0, 0o0);
var day15back_time_api_temp = day15back.toISOString().substring(0, 11) + day15back.toISOString().substring(11, 19);

//--------------------------------------------------------------------

//-------------------------------Clist API Fetching-------------------------------------

const apiUrl = `https://cp-calendar-server.vercel.app/upcomingContests/?`;
async function FetchAPI() {
	try {
		const response = await fetch(`${(apiUrl + `&resource=${hosts}&end__gt=${curr_time_api_temp}&start__gt=${day15back_time_api_temp}`)}`);
		if (response.ok) {
			const data = (await response.json());
			// console.log(data);
			console.log("Api Working Successfully");
			return data;
		}
		throw new Error('Network response was not ok.')
	} catch {
		calendertable.innerHTML = `<div class="emptyAlarm red-alert">Unable to find contests!<br>This may be due to a Fail API Connection or you may be offline.</div>`;
		console.log("Api Fetching failed");
		document.querySelector(".loader").style.display = "none";
		document.querySelector(".mainDIV").classList.remove("hidden");
	}
}

// FetchAPI()
//--------------------------------------------------------------------

//--------------Local Storage connectivity with plateform btn--------
function plateform_localstorage() {
	for (var i = 1; i <= 8; i++) {
		document.querySelector(`#host${i}`).addEventListener("click", (btn) => {
			if (btn.target.checked) {
				if (!host.includes(btn.target.name))
					host.push(btn.target.name);
			}
			else {
				const index = host.indexOf(btn.target.name);
				if (index > -1)
					host.splice(index, 1);
			}
			render();
			localStorage.setItem('host-sites', JSON.stringify(host));
		});
	}
}

plateform_localstorage();
//--------------------------------------------------------------------

//--------------------------------------------------------------------

var todayStart = new Date();
todayStart.setHours(0o0, 0o0, 0o0);
const lastfetch = new Date(localStorage.getItem("timeUpdate"));
if (localStorage.getItem("contests") === null || localStorage.getItem("contests") === 'undefined' || lastfetch < todayStart) {
	FetchAPI().then(data => {
		apiData = data;
		localStorage.setItem("contests", JSON.stringify(data));
		localStorage.setItem("timeUpdate", new Date());
		render();
		document.querySelector(".loader").style.display = "none";
		document.querySelector(".mainDIV").classList.remove("hidden");
	})
} else {
	apiData = JSON.parse(localStorage.getItem("contests"));
	render();
	document.querySelector(".loader").style.display = "none";
	document.querySelector(".mainDIV").classList.remove("hidden");
}

//----------------------------Render----------------------------------------
var alarm_object = [];
var alarm_id = [];

function render() {
	var tableItem = ``;
	alarm_id = [];
	var alreadySetAlarm = JSON.parse(localStorage.getItem('alarms'));
	apiData.objects.forEach(function (contest) {
		var start_time = new Date(contest.start + `.000Z`);
		var end_time = new Date(contest.end + `.000Z`);
		if (today) {
			if (host.includes(contest.resource) && start_time < tomorrow && end_time > curr_time && contest.duration <= dur) {
				var timeDuration = fetchTime(contest);
				var start = new Date(contest.start + `.000Z`).toLocaleString('en-US');
				const time = start.split(', ');
				var date = time[0].split('/');

				date = `${date[1]}/${date[0]}/${date[2]}`;
				var conEvent = "" + contest.event;
				if (conEvent.length > 42)
					conEvent = conEvent.substring(0, 42) + "....";
				var temp = `
				<div class="tableitem flex items-center justify-between p-2 text-xs border border-[#464646] rounded-md my-2">
					<a href="${contest.href}" target="_blank" class="flex items-center justify-start w-full gap-2">
						<img class="logo w-8 h-8 rounded-full" src="/assets/images/platforms/${logo.get(contest.resource)}" alt="png">
						<div class="details flex items-center justify-between gap-2 text-xs font-light w-full">
							<div class="flex flex-col gap-2">
								<span class="uppercase font-semibold">${platform.get(contest.resource)}</span>
								<span class="font-light">${conEvent}</span>
							</div>
							<div class="flex flex-col gap-2">
								<div class="flex flex-col gap-2">
									<p><strong>${date}</strong></p>
								</div>
								<p>	<strong>${time[1]}</strong></p>
								<!-- <p>Duration: ${timeDuration} </p> -->
							</div>
						</div>
				  	</a>
					<div class="alarm flex items-center justify-end w-8">
						${(alreadySetAlarm.includes(contest.id)) ?
						`<div class="" >
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#75FB4C">
								<path
									d="m438-298 226-226-57-57-169 169-85-85-57 57 142 142Zm42 218q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z" />
							</svg>
						</div>`
						:
						`<div class="" id="id${contest.id}">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
								<path
									d="M480-500Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm240-360v-120H600v-80h120v-120h80v120h120v80H800v120h-80ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q14 4 27.5 8.5T593-772q-15 14-27 30.5T545-706q-15-7-31.5-10.5T480-720q-66 0-113 47t-47 113v280h320v-112q18 11 38 18t42 11v83h80v80H160Z" />
							</svg>
						</div>`
					}
					</div>
                </div>
				`;
				if (!alreadySetAlarm.includes(contest.id))
					alarm_id.push(contest.id);
				tableItem += temp;
			}
		} else {
			if (host.includes(contest.resource) && contest.duration <= dur) {
				var timeDuration = fetchTime(contest);
				var start = new Date(contest.start + `.000Z`).toLocaleString('en-US');
				const time = start.split(', ');
				var date = time[0].split('/');

				date = `${date[1]}/${date[0]}/${date[2]}`;
				var conEvent = "" + contest.event;
				if (conEvent.length > 42)
					conEvent = conEvent.substring(0, 42) + "....";
				var temp = `
				<div class="tableitem flex items-center justify-between p-2 text-xs border border-[#464646] rounded-md my-2">
					<a href="${contest.href}" target="_blank" class="flex items-center justify-start w-full gap-2">
						<img class="logo w-8 h-8 rounded-full" src="/assets/images/platforms/${logo.get(contest.resource)}" alt="png">
						<div class="details flex items-center justify-between gap-2 text-xs font-light w-full">
							<div class="flex flex-col gap-2">
								<span class="uppercase font-semibold">${platform.get(contest.resource)}</span>
								<span class="font-light">${conEvent}</span>
							</div>
							<div class="flex flex-col gap-2">
								<div class="flex flex-col gap-2">
									<p><strong>${date}</strong></p>
								</div>
								<p>	<strong>${time[1]}</strong></p>
								<!-- <p>Duration: ${timeDuration} </p> -->
							</div>
						</div>
				  	</a>
					<div class="alarm flex items-center justify-end w-8">
						${(alreadySetAlarm.includes(contest.id)) ?
						`<div class="" >
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#75FB4C">
								<path
									d="m438-298 226-226-57-57-169 169-85-85-57 57 142 142Zm42 218q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z" />
							</svg>
						</div>`
						:
						`<div class="" id="id${contest.id}">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5985E1">
								<path
									d="M480-500Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm240-360v-120H600v-80h120v-120h80v120h120v80H800v120h-80ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q14 4 27.5 8.5T593-772q-15 14-27 30.5T545-706q-15-7-31.5-10.5T480-720q-66 0-113 47t-47 113v280h320v-112q18 11 38 18t42 11v83h80v80H160Z" />
							</svg>
						</div>`
					}
					</div>
                </div>
				`;
				if (!alreadySetAlarm.includes(contest.id))
					alarm_id.push(contest.id);
				tableItem += temp;
			}
		}
	})
	fetch_idddata();
	calendertable.innerHTML = tableItem;
	alarm_object = [];
	alarm_id.forEach((id) => {
		var temp = document.getElementById(`id${id}`);
		alarm_object.push(temp);
		temp.addEventListener('click', () => {
			var alarmArray = [];
			alarmArray = JSON.parse(localStorage.getItem("alarms"));
			if (!alarmArray.includes(id))
				alarmArray.push(id);
			localStorage.setItem('alarms', JSON.stringify(alarmArray));
			fetchAlarm();
			render();
		})
	})
	fetchAlarm();
	if (tableItem === ``) {
		calendertable.innerHTML = `
		<div class="emptyAlarm">
		Empty Section<br>
		Contest details not found!
		</div>
	`
	}
}

function fetchTime(contest) {
	const minutes = (parseInt(contest.duration) / 60) % 60;
	const hours = parseInt((parseInt(contest.duration) / 3600) % 24);
	const days = parseInt((parseInt(contest.duration) / 3600) / 24);
	var timeDuration = ``;
	if (days > 0)
		timeDuration += `${days} days `;
	if (hours > 0)
		timeDuration += `${hours} hours `;
	if (minutes > 0)
		timeDuration += `${minutes} minutes `;
	return timeDuration;
}

function fetch_idddata() {
	iddata.clear();
	apiData.objects.forEach(function (contest) {
		var timeDuration = fetchTime(contest);
		var start = new Date(contest.start + `.000Z`).toLocaleString('en-US');
		const time = start.split(', ');
		var date = time[0].split('/');
		date0 = `${date[1]}/${date[0]}/${date[2]} ${time[1]}`;
		date = `${date[2]}-${date[0]}-${date[1]}`;
		var conEvent = "" + contest.event;
		if (conEvent.length > 42)
			conEvent = conEvent.substring(0, 42) + "....";
		iddata.set(contest.id, [conEvent, contest.href, `${date0}`, timeDuration, contest.resource, new Date(`${date} ${time[1]}`)]);
	});
	var tempArr = JSON.parse(localStorage.getItem("alarms"));
	var tempArr1 = [];
	tempArr.forEach((e) => {
		if (iddata.get(e) != undefined) {
			tempArr1.push(e);
		}
		// console.log(tempArr1);
		localStorage.setItem("alarms", JSON.stringify(tempArr1));
	});
}

var updatetimer = [];
function fetchAlarm() {
	var temp = '';
	var alarmArray1 = JSON.parse(localStorage.getItem("alarms"));

	if (alarmArray1.length === 0) {
		alarmtable.innerHTML = `
		    <div class="emptyAlarm">
				Empty Section.<br>
				Let set your important contests here.
			</div>
		`
		return;
	}

	var tempA = [];
	var cur_time = Date.parse(new Date());
	alarmArray1.forEach((e) => {
		tempA.push([Date.parse(iddata.get(e)[5]) - cur_time, e]);
	})
	tempA.sort((a, b) => {
		return a[0] - b[0];
	});
	// console.log(tempA);
	for (var i = 0; i < alarmArray1.length; i++) {
		alarmArray1[i] = tempA[i][1];
	}
	localStorage.setItem("alarms", JSON.stringify(alarmArray1));
	alarmArray1.forEach((id) => {
		temp += `
		<div class="tableitem flex items-center justify-between p-2 text-xs border border-[#464646] rounded-md my-2">
			<a href="${iddata.get(id)[1]}" target="_blank" class="flex items-center justify-start w-full gap-2">
				<img class="logo w-8 h-8 rounded-full" src="/assets/images/platforms/${logo.get(iddata.get(id)[4])}" alt="png">	
				<div class="details flex items-end justify-between gap-2 text-xs font-light w-full">
					<div class="flex flex-col gap-1">
						<span class="uppercase font-semibold">${platform.get(iddata.get(id)[4])}</span>
						<span class="font-light">${iddata.get(id)[0]}</span>
						<p><span class="update" id="update${id}"> </span>
					</div>
					<div class="flex flex-col text-[8px]">
						<p><strong class="text-center">${iddata.get(id)[2]}</strong></p>
						<p><strong class="text-center">${iddata.get(id)[3]}</strong></p>
					</div>
					
				</div>
			</a>
			<div class="delete flex items-center justify-center  w-8">
				<div class="flex items-center justify-center" id="del${id}">
					<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323">
						<path
							d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
					</svg>
				</div> 
			</div>
		</div>
		`
	})
	alarmtable.innerHTML = temp;

	alarmArray1.forEach((id) => {
		document.querySelector(`#del${id}`).addEventListener('click', () => {
			var tempData = JSON.parse(localStorage.getItem("alarms"));
			chrome.alarms.clear(iddata.get(id)[1]);
			// chrome.alarms.getAll((e)=>{console.log(e)});
			tempData = tempData.filter((e) => {
				return e != id;
			})
			alarmArray1 = tempData;
			localStorage.setItem("alarms", JSON.stringify(tempData));
			fetchAlarm();
			render();
		});
	})

	alarmArray1 = JSON.parse(localStorage.getItem("alarms"));

	updatetimer = [];
	// chrome.alarms.clearAll();
	alarmArray1.forEach((id) => {
		var countDownDate = (iddata.get(id)[5]).getTime();
		if (alarmArray1.find((e) => { return e === id }) && (iddata.get(id)[5]).getTime() - 2 * 60 * 1000 > (new Date()).getTime()) { createalarm(id); }
		var x = setInterval(function () {
			var now = new Date().getTime();
			var distance = countDownDate - now;
			var days = Math.floor(distance / (1000 * 60 * 60 * 24));
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);
			alarmArray1 = JSON.parse(localStorage.getItem("alarms"));
			if (alarmArray1.find((e) => { return e === id })) { document.getElementById(`update${id}`).innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s "; }
			else {
				distance = -99999999999;
			}
			if (distance === -99999999999) { clearInterval(x); }
			else if (distance < 0) {
				clearInterval(x);
				chrome.alarms.clear(iddata.get(id)[1]);
				createnotification(id);
				document.getElementById(`update${id}`).innerHTML = "Started";
				alarmArray1 = alarmArray1.filter(function (value) {
					return value != id;
				});
				localStorage.setItem("alarms", JSON.stringify(alarmArray1));
				fetchAlarm();
				render();
			}
		}, 1000);
	})
}




function createalarm(id) {
	// chrome.alarms.getAll((e)=>{console.log(e)});
	// chrome.alarms.create(iddata.get(id)[1], { when: (new Date(iddata.get(id)[5]).getTime() - 2 * 60 * 1000) });
	// console.log(new Date((iddata.get(id)[5]).getTime() - 2 * 60 * 1000));
}

function createnotification(id) {
	chrome.notifications.create("" + id, {
		type: 'basic',
		iconUrl: `images/${logo.get(iddata.get(id)[4])}`,
		title: iddata.get(id)[4],
		message: iddata.get(id)[0],
		priority: 2,
		eventTime: Date.now(),
		buttons: [
			{
				title: 'Visit Now'
			},
			{
				title: 'Later'
			}
		]
	});
}
// alert("Welcome Back");


//  chrome.alarms.create("https://developer.chrome.com/docs/extensions/reference/", { when:new Date('Sun Dec 04 2022 08:43:31 GMT+0530 (India Standard Time)').getTime()});

//----------------------------Collect----------------------------------

// {
// 	var genUserID = "";
// 	var isNewUser = false;
// 	var isUnique = false;
// 	chrome.storage.local.get(["NCPCID"]).then((result) => {
// 		genUserID = result.NCPCID;
// 		// console.log(genUserID);
// 		if (localStorage.getItem("NCPCID") === null) {
// 			isNewUser = true;
// 			localStorage.setItem("NCPCID", genUserID);
// 		} else {
// 			genUserID = localStorage.getItem("NCPCID");
// 		}
// 		var currDay = new Date();
// 		var year = currDay.getFullYear();
// 		var month = String(currDay.getMonth() + 1).padStart(2, '0');
// 		var day = String(currDay.getDate()).padStart(2, '0');
// 		var currDay = `${year}-${month}-${day}`;
// 		if (localStorage.getItem("currDay") === null || localStorage.getItem("currDay") != currDay) {
// 			isUnique = true;
// 			localStorage.setItem("currDay", currDay);
// 		}

// 		fetch("https://extensions-info-api.vercel.app/api/collect", {
// 			method: "POST",
// 			body: JSON.stringify({
// 				"extension": "CPCalendar",
// 				"isNewUser": isNewUser,
// 				"userID": genUserID,
// 				"isUnique": isUnique,
// 				"day": currDay
// 			}),
// 			headers: {
// 				"Content-type": "application/json; charset=UTF-8"
// 			}
// 		});
// 	});
// }


//--------------------------------------------------------------------