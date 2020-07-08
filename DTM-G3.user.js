// ==UserScript==
// @name         DTM-G3
// @version      1.23
// @description  A script to carry out crimes on DownTown Mafia
// @author       PsyChrome-G3
// @homepageURL  https://github.com/PsyChrome-G3
// @supportURL   https://github.com/PsyChrome-G3
// @match        https://www.downtown-mafia.com/crimes
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @resource     css https://github.com/PsyChrome-G3/UserScripts/raw/master/css/g3-dtm.css
// @icon         https://www.downtown-mafia.com/images/favicon/favicon-32.png
// @icon64       https://www.downtown-mafia.com/images/favicon/favicon-120.png
// @updateURL    https://github.com/PsyChrome-G3/UserScripts/raw/master/DTM-G3Scripts.user.js
// @downloadURL  https://github.com/PsyChrome-G3/UserScripts/raw/master/DTM-G3Scripts.user.js
// ==/UserScript==

// config settings
const configId = 'g3ScriptCfg';
const iconUrl = GM_info.script.icon64;
const pattern = {};
pattern[`#${configId}`] = /#configId/g;
pattern[`${iconUrl}`] = /iconUrl/g;

let css = GM_getResourceText('css');
Object.keys(pattern).forEach((key) => {
    css = css.replace(pattern[key], key);
});
const windowcss = css;
const iframecss = `
height: 475px;
width: 435px;
border: 1px solid;
border-radius: 3px;
position: fixed;
z-index: 9999;
`;

GM_registerMenuCommand(`${GM_info.script.name} Settings`, () => {
    GM_config.open();
    GM_config.frame.style = iframecss;
});

GM_config.init({
    id: `${configId}`,
    title: `${GM_info.script.name} ${GM_info.script.version}`,
    fields: {
        crimeMode: {
            section: ['', 'Crime Settings'],
            type: 'radio', // Makes this setting a series of radio elements
            options: ['Auto', 'Manual'], // Possible choices
            label: 'Crime Mode: ', // Appears next to field
            default: 'Auto' // Default value if user doesn't change it
        },
        crimeLevel: {
            label: 'Level: ', // Appears next to field
            type: 'select', // Makes this setting a dropdown
            options: ['Street', 'Heist', 'Corporate'], // Possible choices
            default: 'Corporate' // Default value if user doesn't change it
        },
        crimeNumber: {
            label: 'Crime Number: ', // Appears next to field
            type: 'select', // Makes this setting a dropdown
            options: ['1', '2', '3', '4', '5', '6', '7', '8'], // Possible choices
            default: '8' // Default value if user doesn't change it
        },
        support: {
            section: ['', 'Support'],
            label: 'G3-Scripts Homepage',
            title: 'more info on g3-scripts.g3cko-design.uk/',
            type: 'button',
            click: () => {
                GM_openInTab('http://g3-scripts.g3cko-design.uk/', {
                    active: true,
                    insert: true,
                    setParent: true
                });
            }
        },
    },
    css: windowcss,
    events: {
        save: function () {
            GM_config.close();
        }
    },
    css: '#g3ScriptCfg_buttons_holder { text-align: center; }' +
        '#g3ScriptCfg .reset { display: none; }' +
        'div#g3ScriptCfg_section_1 { padding-top: 40px; }' +
        '#g3ScriptCfg .field_label { margin-bottom: 10px; }' +
        '#g3ScriptCfg .config_var { padding:  5px; font-size: 1.5em; border: 1px solid #000; display: grid; }' +
        '#g3ScriptCfg {background-color: #1b202a; color: white; font-size: 1.5em; font-family: "FuturaPT", sans-serif; font-weight: 500; font-style: normal; }' +
        '#g3ScriptCfg .saveclose_buttons { color: white; font-size: 1em; font-family: "FuturaPT", sans-serif; font-weight: 500; font-style: normal; margin: .7em; background-image: linear-gradient(#21252a, #19425a); }' +
        '#g3ScriptCfg button { height: 1.65em !important; transition: all 0.4s; font-family: "FuturaPT", sans-serif; font-weight: 500; font-style: normal; border: 0; background-image: linear-gradient(#21252a, #19425a); border-bottom: 4px solid #161a23; }' +
        'input[type="button" i] { color: white; font-size: 0.5em; font-family: "FuturaPT", sans-serif; font-weight: 500; font-style: normal; height: 1.65em !important; transition: all 0.4s; border: 0; background-image: linear-gradient(#21252a, #19425a); border-bottom: 4px solid #161a23; }' +
        '#g3ScriptCfg .section_desc {background-color: rgba(0,155,200,0.556863);border: 1px solid #000; color: white; font-size: 1em; font-family: "FuturaPT", sans-serif; font-weight: 500; margin: 0 0 6px; }' +
        '#g3ScriptCfg .field_label, #g3ScriptCfg .option_label { font-size: 0.4em; margin-right: 6px; }'
});

// Config box
const street = ".easy-crimes";
const heists = ".medium-crimes";
const corporate = ".hard-crimes";
let sHC; // Select either streets, heists or corporate
let autoCrime;
let crimeNumber; // Select which crime 1-8

$(document).ready(function () {
    if (GM_config.get('crimeLevel') === 'Street') {
        sHC = street;
    } else if (GM_config.get('crimeLevel') === 'Heist') {
        sHC = heists;
    } else {
        sHC = corporate;
    }
    crimeNumber = parseInt(GM_config.get('crimeNumber'));
    if (GM_config.get('crimeMode') === 'Auto') {
        autoCrime = true;
        console.log("Automatic Mode: Enabled");
    } else {
        autoCrime = false;
        console.log("Automatic Mode: Disabled || We are going to attempt to commit the " + crimeNumber + " crime on the " + GM_config.get('crimeLevel') + " level");
    }
});

// Disable annoying alerts /////////////////////////////////////////////////////////////////
var disablerFunction = function () {

    window.alert = function alert(msg) { console.log('Hidden Alert ' + msg); };
    window.confirm = function confirm(msg) {
        console.log("Hidden Confirm " + msg);
        return true; /*simulates user clicking yes*/
    };

};

var disablerCode = "(" + disablerFunction.toString() + ")();";

var disablerScriptElement = document.createElement('script');
disablerScriptElement.textContent = disablerCode;

document.documentElement.appendChild(disablerScriptElement);
disablerScriptElement.parentNode.removeChild(disablerScriptElement);

////////////////////////////////////////////////////////////////////////////////////////////

// Main script /////////////////////////////////////////////////////////////////////////////

$(document).ready(function () { // Waits for page to finish loading

    setTimeout(function () {

        const cooldownInactive = document.querySelector(".cooldown-fade__hidden");
        const cooldownActive = document.querySelector(".cooldown-fade__active");
        const crimeResult = document.querySelector(".crime-result");
        let timeStr;

        // Main logic
        if (cooldownActive) {
            console.log("Cooldown before attempting your next crime!");
            setTimeout(function () { location.reload(); }, timeLeft() * 1000);
        } else if (cooldownInactive) {
            console.log("Go commit a crime!");
            attemptCrime();
        } else {
            console.log("No idea whats wrong, attempting to refresh");
            location.reload();
        }

        // Automatically selects a crime
        function autoCommit() {
            let crimesArray = Array.from(document.querySelectorAll('.crime-container:not(.crime-container__locked)'));
            let lastCrime = crimesArray[crimesArray.length - 1];
            return lastCrime;
        }

        // Selects a crime based on user inputs above
        function specCrime(crimeDiff, crimeNum) {
            const difficulty = crimeDiff;
            const crimeType = crimeNum - 1;
            const crimeStr = ".crimes-list-container > " + difficulty + "  > .crime-container";
            const crimeToCommit = document.querySelectorAll(crimeStr)[crimeType];
            return crimeToCommit;
        }

        // Attempt to commit a crime
        function attemptCrime() {
            if (autoCrime) {
                console.log("Automatically selecting which crime to do!");
                $(document).ready(function () { // When document has loaded
                    setTimeout(function () {
                        autoCommit().click();
                        $(document).ready(function () { // When document has loaded
                            setTimeout(function () {
                                setTimeout(function () { location.reload(); }, timeLeft() * 1000);
                            }, 1500); // 1.5 seconds will elapse and Code will execute
                        });
                        console.log(timeLeft());
                    }, 1500); // 1.5 seconds will elapse and Code will execute
                });
            } else {
                $(document).ready(function () { // When document has loaded
                    setTimeout(function () {
                        specCrime(sHC, crimeNumber).click();
                        $(document).ready(function () { // When document has loaded
                            setTimeout(function () {
                                setTimeout(function () { location.reload(); }, timeLeft() * 1000);
                            }, 1500); // 1.5 seconds will elapse and Code will execute
                        });
                    }, 1500); // 1.5 seconds will elapse and Code will execute
                });
            }
        }

        // Gets the time left before we can commit another crime
        function timeLeft() {
            timeStr = jQuery(".ticker").text().replace(/[^0-9]/g, '');
            timeStr + 1;
            console.log("We will refresh in: " + timeStr + " seconds");
            return timeStr;
        }
    }, 1500); // 1.5 seconds will elapse and Code will execute.
});

////////////////////////////////////////////////////////////////////////////////////////////
