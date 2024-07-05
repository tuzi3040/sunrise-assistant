// ==UserScript==
// @name         e5489 Sunrise Assistant
// @namespace    https://github.com/tuzi3040/sunrise-assistant
// @version      0.2.0
// @description  Simple assistant to help you buy tickets for Sunrise Express on e5489.
// @author       tuzi3040
// @match        https://e5489.jr-odekake.net/e5489/cspc/CBDayTimeArriveSelRsvMyDiaPC*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e5489.jr-odekake.net
// @grant        none
// ==/UserScript==

const trainName = {
    'seto': 'サンライズ瀬戸',
    'izumo': 'サンライズ出雲'
}

const facilityName = {
    'nobinobi-single_delux-single_twin': '普通車ノビノビ座席/シングルデラックス/シングルツイン',
    'single': 'シングル',
    'solo': 'ソロ',
    'sunrise_twin': 'サンライズツイン'
}

const stationList = {
    'seto': {
        'departure': ['東京', '横浜', '熱海', '沼津', '富士', '静岡', '浜松≪くだり≫', '大阪≪のぼり≫', '三ノ宮≪のぼり≫', '姫路', '岡山', '児島', '坂出', '高松（香川県）'],
        'arrival': ['東京', '横浜', '熱海', '沼津', '富士', '静岡', '浜松≪くだり≫', '大阪≪のぼり≫', '三ノ宮≪のぼり≫', '姫路', '岡山', '児島', '坂出', '高松（香川県）', '多度津≪延長運転≫', '善通寺≪延長運転≫', '琴平≪延長運転≫']
    },
    'izumo': {
        'departure': ['東京', '横浜', '熱海', '沼津', '富士', '静岡', '浜松≪くだり≫', '大阪≪のぼり≫', '三ノ宮≪のぼり≫', '姫路', '岡山', '倉敷', '備中高梁', '新見', '米子', '安来', '松江', '宍道', '出雲市'],
        'arrival': ['東京', '横浜', '熱海', '沼津', '富士', '静岡', '浜松≪くだり≫', '大阪≪のぼり≫', '三ノ宮≪のぼり≫', '姫路', '岡山', '倉敷', '備中高梁', '新見', '米子', '安来', '松江', '宍道', '出雲市']
    }
};

const stNameListNo = {
    '東京': '%93%8C%8B%9E',
    '横浜': '%89%A1%95l',
    '熱海': '%94M%8AC',
    '沼津': '%8F%C0%92%C3',
    '富士': '%95x%8Em',
    '静岡': '%90%C3%89%AA',
    '浜松≪くだり≫': '%95l%8F%BC',
    '大阪≪のぼり≫': '%91%E5%8D%E3',
    '三ノ宮≪のぼり≫': '%8EO%83m%8B%7B',
    '姫路': '%95P%98H',
    '岡山': '%89%AA%8ER',
    '児島': '%8E%99%93%87',
    '坂出': '%8D%E2%8Fo',
    '高松（香川県）': '%8D%82%8F%BC%81i%8D%81%90%EC%8C%A7%81j',
    '多度津≪延長運転≫': '%91%BD%93x%92%C3',
    '善通寺≪延長運転≫': '%91P%92%CA%8E%9B',
    '琴平≪延長運転≫': '%8B%D5%95%BD',
    '倉敷': '%91q%95~',
    '備中高梁': '%94%F5%92%86%8D%82%97%C0',
    '新見': '%90V%8C%A9',
    '米子': '%95%C4%8Eq',
    '安来': '%88%C0%97%88',
    '松江': '%8F%BC%8D%5D',
    '宍道': '%8E%B3%93%B9',
    '出雲市': '%8Fo%89_%8Es'
}

const facilitysAndIdsNo = {
    'seto': {
        'nobinobi-single_delux-single_twin': '%BB%BE%C4%20%20000',
        'single': '%BB%BE%C4%BC%20000',
        'solo': '%BB%BE%C4%BF%20000',
        'sunrise_twin': '%BB%BE%C4%BB%20000'
    },
    'izumo': {
        'nobinobi-single_delux-single_twin': '%BB%B2%BD%D3%20000',
        'single': '%BB%B2%BD%D3%BC000',
        'solo': '%BB%B2%BD%D3%BF000',
        'sunrise_twin': '%BB%B2%BD%D3%BB000'
    }
}

const facilitysAndIdsNoOriginal = {
    'seto': {
        '普通車ノビノビ座席': '%BB%BE%C4%20%20000',
        'シングルデラックス': '%BB%BE%C4%20%20000',
        'シングルツイン': '%BB%BE%C4%20%20000',
        'シングル': '%BB%BE%C4%BC%20000',
        'ソロ': '%BB%BE%C4%BF%20000',
        'サンライズツイン': '%BB%BE%C4%BB%20000'
    },
    'izumo': {
        '普通車ノビノビ座席': '%BB%B2%BD%D3%20000',
        'シングルデラックス': '%BB%B2%BD%D3%20000',
        'シングルツイン': '%BB%B2%BD%D3%20000',
        'シングル': '%BB%B2%BD%D3%BC000',
        'ソロ': '%BB%B2%BD%D3%BF000',
        'サンライズツイン': '%BB%B2%BD%D3%BB000'
    }
}

function getKeysByValue(obj, value, depth = 1) {
    if (depth >= 1 && typeof(obj) === 'object' && obj && value) {
        let key = Object.keys(obj).find(k => obj[k] === value)
        if (key) {
            return key
        } else {
            for (let i of Object.keys(obj)){
                let keys = getKeysByValue(obj[i], value, depth - 1)
                if (keys) {
                    return [i, keys].flat()
                }
            }
        }
    }
}

class queryParams {
    #queryObj

    constructor(querys) {
        this.#queryObj = Object.fromEntries(querys.split('&').map(e => e.split('=')))
    }

    getObject() {
        return this.#queryObj
    }

    get obj() {
        return this.getObject()
    }

    toString() {
        let queryList = new Array
        for (const [k,v] of Object.entries(this.#queryObj)) {
            queryList.push(`${k}=${v}`)
        }
        return queryList.join('&')
    }

    get text() {
        return this.toString()
    }

    get(name) {
        return this.#queryObj[name]
    }

    set(name, value) {
        this.#queryObj[name] = value
    }
}

class e5489Query extends queryParams {
    constructor(href) {
        super(href.split('?')[1])
    }

    get departureQuery() {
        return super.get('inputDepartStName')
    }
    get departure() {
        return getKeysByValue(stNameListNo, this.departureQuery)
    }
    set #departureQuery(v) {
        super.set('inputDepartStName', v)
        super.set('inputTransferDepartStName1', v)
    }
    set departure(v) {
        this.#departureQuery = stNameListNo[v]
    }

    get arrivalQuery() {
        return super.get('inputArriveStName')
    }
    get arrival() {
        return getKeysByValue(stNameListNo, this.arrivalQuery)
    }
    set #arrivalQuery(v) {
        super.set('inputArriveStName', v)
        super.set('inputTransferArriveStName1', v)
    }
    set arrival(v) {
        this.#arrivalQuery = stNameListNo[v]
    }

    get date() {
        let dateString = super.get('inputDate')
        return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`
    }
    set date(v) {
        super.set('inputDate', v.replaceAll('-', ''))
    }

    get hour() {
        return super.get('inputHour')
    }
    set hour(v) {
        super.set('inputHour', v)
    }

    get minute() {
        return super.get('inputMinute')
    }
    set minute(v) {
        super.set('inputMinute', v)
    }

    get time() {
        return `${this.hour}:${this.minute}`
    }
    set time(v) {
        this.hour = v.replaceAll(':', '').substring(0, 2)
        this.minute = v.replaceAll(':', '').substring(2, 4)
    }

    get type() {
        return super.get('inputSpecificBriefTrainKana1')
    }
    set #type(v) {
        super.set('inputSpecificBriefTrainKana1', v)
    }

    get #trainFacility() {
        let trainFacility = getKeysByValue(facilitysAndIdsNo, this.type, 2)
        return {
            train: trainFacility[0],
            facility: trainFacility[1]
        }
    }

    get train() {
        return this.#trainFacility.train
    }
    get trainName() {
        return trainName[this.train]
    }
    set train(v) {
        this.#type = facilitysAndIdsNo[v][this.facility]
    }

    get facility() {
        return this.#trainFacility.facility
    }
    get facilityName() {
        return facilityName[this.facility]
    }
    set facility(v) {
        this.#type = facilitysAndIdsNo[this.train][v]
    }
}

(function() {
    'use strict';

    let infoNode = document.createElement("p");
    const baseUrl = window.location.href.split('?')[0];

    let sunriseQuery = new e5489Query(window.location.href);

    infoNode.innerHTML = [
        '<b style="color: #000000">Now querying</b>',
        sunriseQuery.trainName,
        sunriseQuery.facilityName,
        `from ${sunriseQuery.departure} to ${sunriseQuery.arrival}`,
        `@${sunriseQuery.date}T${sunriseQuery.hour}:${sunriseQuery.minute} JST`
    ].join('<br>');


    let assistantDiv = document.createElement("div");
    assistantDiv.style = "top: 100px; right: 20px; position: fixed; width: 200px; font:1rem 'Fira Sans', sans-serif;"
    let assistantForm = document.createElement("form");
    assistantForm.id = "assistant"

    let trainFieldset = document.createElement("fieldset");
    let trainLegend = document.createElement("legend");
    trainLegend.innerHTML = "Train: ";
    trainFieldset.appendChild(trainLegend);

    for (let i of Object.keys(trainName)) {
        let trainInputDiv = document.createElement("div");
        let trainRadio = document.createElement("input");
        trainRadio.type = "radio";
        trainRadio.name = "train";
        trainRadio.id = i;
        trainRadio.value = i;
        if (i === sunriseQuery.train) {
            trainRadio.setAttribute("checked", "");
        };
        trainRadio.setAttribute("required", "");

        trainRadio.addEventListener("change", (event) => {
            let departureStationSelect = document.createElement("select");
            departureStationSelect.name = "departure";
            departureStationSelect.id = "departure-select";
            departureStationSelect.style = "width: 10.5em";
            departureStationSelect.setAttribute("required", "");

            departureStationSelect.addEventListener("change", (event) => {
                lastSelectedDeparture = event.target.value
            });

            for (let i of stationList[event.target.id].departure) {
                let departureOption = document.createElement("option");
                departureOption.value = i;
                departureOption.innerHTML = i;
                departureStationSelect.appendChild(departureOption);
            }
            let lastSelectedDepartureOption = departureStationSelect.querySelector(`option[value=${lastSelectedDeparture}]`)
            if (lastSelectedDepartureOption) {
                lastSelectedDepartureOption.setAttribute("selected", "");
            }
            departureStationDiv.replaceChild(departureStationSelect, departureStationDiv.lastChild);

            let arrivalStationSelect = document.createElement("select");
            arrivalStationSelect.name = "arrival";
            arrivalStationSelect.id = "arrival-select";
            arrivalStationSelect.style = "width: 10.5em";
            arrivalStationSelect.setAttribute("required", "");

            arrivalStationSelect.addEventListener("change", (event) => {
                lastSelectedArrival = event.target.value
            });

            for (let i of stationList[event.target.id].arrival) {
                let arrivalOption = document.createElement("option");
                arrivalOption.value = i;
                arrivalOption.innerHTML = i;
                arrivalStationSelect.appendChild(arrivalOption);
            }
            let lastSelectedArrivalOption = arrivalStationSelect.querySelector(`option[value=${lastSelectedArrival}]`)
            if (lastSelectedArrivalOption) {
                lastSelectedArrivalOption.setAttribute("selected", "");
            } else {
            arrivalStationSelect.lastChild.setAttribute("selected", "");
            }
            arrivalStationDiv.replaceChild(arrivalStationSelect, arrivalStationDiv.lastChild);
        });

        let trainRadioLabel = document.createElement("label");
        trainRadioLabel.innerHTML = ` ${trainName[i]}`;
        trainRadioLabel.setAttribute("for", i);
        trainInputDiv.appendChild(trainRadio);
        trainInputDiv.appendChild(trainRadioLabel);
        trainFieldset.appendChild(trainInputDiv);
    }


    let facilityFieldset = document.createElement("fieldset");
    facilityFieldset.style = "word-break: keep-all"
    let facilityLegend = document.createElement("legend");
    facilityLegend.innerHTML = "Facility: ";
    facilityFieldset.appendChild(facilityLegend);

    for (let i of Object.keys(facilityName)) {
        let facilityInputDiv = document.createElement("div");
        let facilityRadio = document.createElement("input");
        facilityRadio.type = "radio";
        facilityRadio.name = "facility";
        facilityRadio.id = i;
        facilityRadio.value = i;
        if (i === sunriseQuery.facility) {
            facilityRadio.setAttribute("checked", "");
        };
        facilityRadio.setAttribute("required", "");
        let facilityRadioLabel = document.createElement("label");
        facilityRadioLabel.innerHTML = ` ${facilityName[i]}`;
        facilityRadioLabel.setAttribute("for", i);
        facilityInputDiv.appendChild(facilityRadio);
        facilityInputDiv.appendChild(facilityRadioLabel);
        facilityFieldset.appendChild(facilityInputDiv);
    }


    let departureStationDiv = document.createElement("div");
    departureStationDiv.style="display: grid; grid-template-columns: 3fr 7fr"
    let departureStationLabel = document.createElement("label");
    departureStationLabel.setAttribute("for", "departure-station-select");
    departureStationLabel.innerHTML = 'From:';
    departureStationDiv.appendChild(departureStationLabel);

    let departureStationSelect = document.createElement("select");
    departureStationSelect.name = "departure";
    departureStationSelect.id = "departure-select";
    departureStationSelect.style = "width: 10.5em";
    departureStationSelect.setAttribute("required", "");

    departureStationSelect.addEventListener("change", (event) => {
        lastSelectedDeparture = event.target.value
    });

    for (let i of stationList[sunriseQuery.train].departure) {
        let departureOption = document.createElement("option");
        departureOption.value = i;
        departureOption.innerHTML = i;
        departureStationSelect.appendChild(departureOption);
    }
    let lastSelectedDeparture = sunriseQuery.departure;
    departureStationSelect.querySelector(`option[value=${sunriseQuery.departure}]`).setAttribute("selected", "");
    departureStationDiv.appendChild(departureStationSelect);


    let arrivalStationDiv = document.createElement("div");
    arrivalStationDiv.style="display: grid; grid-template-columns: 3fr 7fr"
    let arrivalStationLabel = document.createElement("label");
    arrivalStationLabel.setAttribute("for", "arrival-station-select");
    arrivalStationLabel.innerHTML = 'To:';
    arrivalStationDiv.appendChild(arrivalStationLabel);

    let arrivalStationSelect = document.createElement("select");
    arrivalStationSelect.name = "arrival";
    arrivalStationSelect.id = "arrival-select";
    arrivalStationSelect.style = "width: 10.5em";
    arrivalStationSelect.setAttribute("required", "");

    arrivalStationSelect.addEventListener("change", (event) => {
        lastSelectedArrival = event.target.value
    });

    for (let i of stationList[sunriseQuery.train].arrival) {
        let arrivalOption = document.createElement("option");
        arrivalOption.value = i;
        arrivalOption.innerHTML = i;
        arrivalStationSelect.appendChild(arrivalOption);
    }
    let lastSelectedArrival = sunriseQuery.arrival;
    arrivalStationSelect.querySelector(`option[value=${sunriseQuery.arrival}]`).setAttribute("selected", "");
    arrivalStationDiv.appendChild(arrivalStationSelect);


    let dateTimeDiv = document.createElement("div");
    let dateTimeLabel = document.createElement("label");
    dateTimeLabel.setAttribute("for", "datetime-input");
    dateTimeLabel.innerHTML = 'Depature time: (5min step)';
    dateTimeDiv.appendChild(dateTimeLabel);
    dateTimeDiv.appendChild(document.createElement("br"));

    let dateInput = document.createElement("input");

    dateInput.type = "date";
    dateInput.name = "date";
    dateInput.id = "date-input";
    dateInput.value = sunriseQuery.date;

    const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Tokyo'
    });

    const nowDate = new Date();
    const nowDateParts = dateTimeFormat.formatToParts(nowDate);
    const nowDatePartsTypeArray = nowDateParts.map((e) => e.type);
    const nowDatePartsObj = {
        y: nowDateParts[nowDatePartsTypeArray.indexOf('year')].value,
        m: nowDateParts[nowDatePartsTypeArray.indexOf('month')].value,
        d: nowDateParts[nowDatePartsTypeArray.indexOf('day')].value
    };
    dateInput.setAttribute("min", `${nowDatePartsObj.y}-${nowDatePartsObj.m}-${nowDatePartsObj.d}`);

    const nextMonthDate = new Date((new Date()).setMonth(nowDate.getMonth() + 1));
    const nextMonthDateParts = dateTimeFormat.formatToParts(nextMonthDate);
    const nextMonthDatePartsTypeArray = nextMonthDateParts.map((e) => e.type);
    const nextMonthDatePartsObj = {
        y: nextMonthDateParts[nextMonthDatePartsTypeArray.indexOf('year')].value,
        m: nextMonthDateParts[nextMonthDatePartsTypeArray.indexOf('month')].value,
        d: nextMonthDateParts[nextMonthDatePartsTypeArray.indexOf('day')].value
    };
    dateInput.setAttribute("max", `${nextMonthDatePartsObj.y}-${nextMonthDatePartsObj.m}-${nextMonthDatePartsObj.d}`);

    dateInput.setAttribute("required", "");
    dateTimeDiv.appendChild(dateInput);


    let timeInput = document.createElement("input");

    timeInput.type = "time";
    timeInput.name = "time";
    timeInput.id = "time-input";
    timeInput.value = `${sunriseQuery.hour}:${sunriseQuery.minute}`;
    timeInput.setAttribute("step", 300);
    timeInput.setAttribute("required", "");
    dateTimeDiv.appendChild(timeInput);

    let assistantFormButtonDiv = document.createElement("div");
    assistantFormButtonDiv.style="display: grid; grid-template-columns: 1fr"
    let assistantFormButton = document.createElement("button");
    assistantFormButton.type = "submit";
    assistantFormButton.innerHTML = "GO";
    assistantFormButton.style = "border-width: 1px; border-color: black; border-style: solid; background-color: white; width: 10em; height: 2em; margin-top: 20px;";
    assistantFormButtonDiv.appendChild(assistantFormButton);


    assistantDiv.appendChild(infoNode);

    assistantForm.appendChild(trainFieldset);
    assistantForm.appendChild(facilityFieldset);
    assistantForm.appendChild(departureStationDiv);
    assistantForm.appendChild(arrivalStationDiv);
    assistantForm.appendChild(dateTimeDiv);
    assistantForm.appendChild(assistantFormButtonDiv);

    assistantForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let formObj = Object.fromEntries(new FormData(assistantForm));
        sunriseQuery.departure = formObj.departure;
        sunriseQuery.arrival = formObj.arrival;
        sunriseQuery.train = formObj.train;
        sunriseQuery.facility = formObj.facility;
        sunriseQuery.date = formObj.date;
        sunriseQuery.time = formObj.time;

        window.open(([baseUrl, sunriseQuery.toString()].join('?')), "_self")
    })

    assistantDiv.appendChild(assistantForm);
    // assistantDiv.appendChild(debugNode);

    document.body.appendChild(assistantDiv);
})();