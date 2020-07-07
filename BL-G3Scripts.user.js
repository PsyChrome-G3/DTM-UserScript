// ==UserScript==
// @name         BL-G3Scripts
// @version      1.3.2.16
// @description  Commit's crimes, rackets, auto burglary, booze runs & and when available buys bullets.
// @author       PsyChrome-G3
// @homepageURL  http://g3-scripts.g3cko-design.uk/
// @include      /^https?:\/\/(www\.)?bootleggers\.(us)\/.*/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    // - - - - - - - E D I T   H E R E - - - - - - - //
    var accountName = "Reaper";
    var halfTimers = false;

    // Set what times to travel between (e.g. 8 - 21 for 8am to 9pm).
    var startTravel = 7;
    var endTravel = 23;

    var bulletBuying = false;
    var crimes = true;
    var rackets = true;
    var gta = true;
    var boozeRunning = true;
    var boozeRunMode = false;
    var negotiating = true;
    // - - - - - - - - - - E N D - - - - - - - - - - //

    // - - - - - - - I M P O R T A N T - - - - - - - //
    // - - -  Don't change anything after here - - - //
    var currentBulletStock = $(".insideTables td:contains('per bullet')").prev().text();
    var bulletsReady = ($("#timer-bul").text().indexOf("Ready") > -1 && bulletBuying === true);
    if ((window.location.href.indexOf("bullets") > -1) && currentBulletStock > "99") {
        if (bulletsReady) {
            $('input[name=amtbullets]').val('100');
            console.log("Bullets left: " + currentBulletStock);
        } else {
            var tableBody = document.getElementsByTagName('tbody')[13]; // Finds tbody
            var tableRow = tableBody.childNodes[28].remove(); // Finds Row
            console.log("Bullet Factory is still waiting: " + $("#timer-bul").text());
            setTimeout(function(){ location.reload(); }, 3*1000);
        }
    } else {
        try {
            $(document).ready(function () {
                //$.getScript('https://cdn.blimg.us/js/timers.js?b=3551', function () {
                try {
                    if ($('[id=timer-cri]').length === 0) {
                        console.log('No timers; adding own');
                        $.getScript('//cdn.blimg.us/js/timers.js?b=3551');
                        // $.getScript('//cdn.blimg.us/js/timers.js');
                        var someHtml = '<style type="text/css"> .timer { border-bottom: 1px solid #B0A8AE !important; text-align: center; width: 12.5%; background-position: center; white-space: nowrap; } .ready { background-image: url(\'https://cdn.blimg.us/old/game-new/site/tablebg_green.gif\'); } .notReady { background-image: url(\'https://cdn.blimg.us/old/game-new/site/tablebg_red.gif\'); } .timer a, .timer a:hover { padding: 1px 10px; text-decoration: none; display: block; } .timer span { font-weight: bold; } .borderRight { border-right: 1px solid #B0A8AE !important; } </style> <div align="center" class=noBorder style=height:15px> <table border="0" cellspacing="0" cellpadding="0" width="100%" style="height: 15px; border-width: 0px" id="countdownTimers"> <tr id="userTimers"> <td class="timer ready" style="border-right: 1px solid #8C867E"> <a href="/autoburglary.php" target="_top"> Auto Burglary: <span id="timer-aut" data-seconds="60" style="color: #8EF393">Checking...</span> </a> </td> <td class="timer notReady" style="border-right: 1px solid #8C867E"> <a href="/crimes.php" target="_top"> Crime: <span id="timer-cri" data-seconds="60" style="">Checking...</span> </a> </td><td class="timer notReady" style="border-right: 1px solid #8C867E"> <a href="/bank.php" target="_top"> Bank: <span id="timer-fed" data-seconds="60" style="">Checking...</span> </a> </td><td class="timer notReady" style="border-right: 1px solid #8C867E"> <a href="/jail.php" target="_top"> Jail: <span id="timer-jai" data-seconds="60" style="">Checking...</span> </a> </td> <td class="timer notReady" style="border-right: 1px solid #8C867E"> <a href="/orgcrime.php" target="_top"> Organised Crime: <span id="timer-org" data-seconds="60" style="">Checking...</span> </a> </td><td class="timer notReady" style="border-right: 1px solid #8C867E"> <a href="/rackets.php" target="_top"> Rackets: <span id="timer-rac" style="">Checking...</span> </a> </td> <td class="timer notReady" style="border-right: 1px solid #8C867E"> <a href="/bootleg.php" target="_top"> Bootlegging: <span id="timer-boo" style="">Checking...</span> </a> </td><td class="timer notReady" style="border-right: 1px solid #8C867E"> <a href="/bullets.php" target="_top"> Bullets: <span id="timer-bul" data-seconds="60" style="">Checking...</span> </a> </td><td class="timer notReady" style="border-right: 1px solid #8C867E"> <a href="/orgcrime.php" target="_top"> Org. Crime: <span id="timer-org" data-seconds="3829" style="">Checking...</span> </a> </td></tr> </table> </div>';
                        $("table.cat > tbody > tr:eq(2) > td:eq(1)").prepend(someHtml);
                    }
                } catch(err) {
                }
                function getTimeLeft(data) {
                    var users = [accountName];
                    var inJail = false,
                        jailTime = 0;
                    for (var i = 0; i < users.length; i++) {
                        if ($(data).find("#jailRow" + users[i]).length) {
                            inJail = true;
                            jailTime = parseInt($(data).find("#jailRow" + users[i] + " #countdown").text());
                        }
                    }
                    if (inJail) {
                        return jailTime;
                    } else if ($(data).find("tr > td > .countdown-timeleft").length) {
                        var time = $(data).find("tr > td > .countdown-timeleft").text();
                        if (time.indexOf(":") == -1 || time.toLowerCase().indexOf("expired") > -1) {
                            return 0;
                        } else {
                            time = time.split(":");
                            for (i = 0; i < time.length; i++) {
                                time[i] = (parseInt(time[i]));
                            }
                            return (time[0] * 360) + (time[1] * 60) + time[2];
                        }
                    } else {
                        return 0;
                    }
                }
            });
            /*jQuery.expr[":"].Contains = jQuery.expr.createPseudo(function (arg) {
                return function (elem) {
                    return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
                };
            });*/
            var times = 0;
            var checker = setInterval(bot, 1000);
            var saver = setInterval(save, 1000);
            function save() {
                if (times > 15) {
                    console.log("It's been a bit and nothing happened... Refreshing...");
                    location.href = location.href;
                    clearInterval(saver);
                } else {
                    times++;
                }
                if ($("*:contains(arrested by police)").length || $(".jailMsg").length) {
                    console.log("you in jail, REFRESHING");
                    setTimeout(function () {
                        location.href = location.href;
                    }, 6000);
                    clearInterval(saver);
                }
            }
            function notifyMe() {
                if (!Notification) {
                    alert('Notifications are supported in modern versions of Chrome, Firefox, Opera and Firefox.');
                    return;
                }
                if (Notification.permission !== "granted")
                    Notification.requestPermission();
                var notification = new Notification('Captcha', {
                    icon: 'https://www.pandasecurity.com/mediacenter/src/uploads/2014/09/avoid-captcha.jpg',
                    body: "A captcha has been detected!",
                });
                notification.onclick = function () {
                    window.focus();
                };
            }

            function bot() {
                if (bulletBuying === "on") {
                    var bulletsEmpty = true;
                    $.ajax({
                        type: "GET",
                        url: "bullets.php",
                        async: false
                    }).done(function (data) {
                        var bulletStock = parseInt(($(data).find(".insideTables td:contains('per bullet')").prev()).text());
                        bulletsEmpty = (bulletStock === 0);
                        if (!bulletsEmpty) {
                            if ($("td[align='center'][class='header']:contains(prevention)").length || $("td[align='center'][class='header']:contains(protection)").length ||
                                $("td[align='center'][class='header']:contains(bot)").length || $("td[align='center'][class='header']:contains(script)").length ||
                                $("td[align='center'][class='header']:contains(check)").length || $(".insideTables > form:contains(captcha)").length) {
                                notifyMe();
                                clearInterval(checker);
                                clearInterval(saver);
                            } else {
                                $("#timer-bul").click();
                            }
                        }
                    });
                }
                // Get today's random crime max
                var maxC;
                var maxN;
                if (halfTimers === true) {
                    maxC = 800;
                    maxN = 780;
                } else {
                    maxC = 400;
                    maxN = 380;
                }
                var today = new Date();
                var dd = today.getDate();
                var rNum;
                function isOdd(num) { return num % 2;}
                if (isOdd(dd) === 0) {
                    rNum = 13;
                } else {
                    rNum = 7;
                }
                var n = accountName.length;
                var todaysNumber = maxC - dd;
                var maxDailyCrimes;
                if (todaysNumber >= maxN) {
                    maxDailyCrimes = (maxC - dd) - rNum + n;
                } else {
                    maxDailyCrimes = (maxC - dd) + rNum + n;
                } // END

                var crimeLimitReached = true;
                $.ajax({
                    type: "GET",
                    url: "news.php",
                    async: false
                }).done(function (data) {
                    var crimesToday = parseInt(($(data).find(":contains('Crimes (Today):')").next()).last().text());
                    // Set how many crimes you want it to attempt each day - Mike 07/05/18
                    crimeLimitReached = (crimesToday >= maxDailyCrimes);
                    console.log("Today's crimes: " + crimesToday + "/" + maxDailyCrimes);
                    if (crimeLimitReached)
                        console.log("Crime limit reached, won't go to crime");
                });
                var notInJail = ($("#timer-jai").text().indexOf("Free") > -1);
                if ($("td[align='center'][class='header']:contains(prevention)").length || $("td[align='center'][class='header']:contains(protection)").length ||
                    $("td[align='center'][class='header']:contains(bot)").length || $("td[align='center'][class='header']:contains(script)").length ||
                    $("td[align='center'][class='header']:contains(check)").length || $(".insideTables > form:contains(captcha)").length) {
                    notifyMe();
                    clearInterval(checker);
                    clearInterval(saver);
                } else {
                    // Travel time
                    var todaysDate = new Date();
                    var hh = todaysDate.getHours();
                    var time = parseInt(hh);

                    var go = true;

                    var racReady = ($("#timer-rac").text().indexOf("Ready") > -1 && rackets === true);
                    var racUrl = "/rackets.php";

                    var crimeReady = ($("#timer-cri").text().indexOf("Ready") > -1 && !crimeLimitReached && crimes === true);
                    var crimeUrl = "/crimes.php";

                    var burgReady = ($("#timer-aut").text().indexOf("Ready") > -1 && gta === true);
                    var burgUrl = "/autoburglary.php";

                    var bootReady = ($("#timer-boo").text().indexOf("Ready") > -1 && negotiating === true);
                    var bootUrl = "/bootleg.php";

                    var jailReady = ($("#timer-jai").text().indexOf("Free") > -1);
                    var jailUrl = "/jail.php";

                    var bulReady = ($("#timer-bul").text().indexOf("Ready") > -1 && !bulletsEmpty);
                    var bulUrl = "/bullets.php";

                    var traReady = ($("#timer-tra").text().indexOf("Ready") > -1 && boozeRunning === true && (startTravel <= time && time <= endTravel));
                    var traUrl = "/trainstation.php";

                    var ocReady = ($("#timer-org").text().indexOf("Ready") > -1 && boozeRunMode === true);

                    var waitReady = (((!ocReady && boozeRunMode === true) || (ocReady && boozeRunMode === false)) && ((!traReady && boozeRunning === true) || (traReady && boozeRunning === false)) && ((!bootReady && negotiating === true) || (bootReady && negotiating === false)) && ((!crimeReady && crimes === true) || (crimeReady && crimes === false)) && ((!racReady && rackets === true) || (racReady && rackets === false)) && ((!burgReady && gta === true) || (burgReady && gta === false)) && ((!bulReady && bulletBuying === true) || (bulReady && bulletBuying === false)));

                    // Crime Helpers
                    if (document.location.href.indexOf(crimeUrl) > -1) {
                        var setCrimeMin;
                        $("table.cat > tbody > tr > td > div.insideTables > table > tbody > tr:contains('%')").each(function () {
                            if (parseInt($(this).children("td:eq(4)").text()) >= 70) {
                                setCrimeMin = 70;
                            } else if (parseInt($(this).children("td:eq(4)").text()) >= 50) {
                                setCrimeMin = 50;
                            } else if (parseInt($(this).children("td:eq(4)").text()) >= 30) {
                                setCrimeMin = 30;
                            } else if (parseInt($(this).children("td:eq(4)").text()) >= 20) {
                                setCrimeMin = 20;
                            } else if (parseInt($(this).children("td:eq(4)").text()) >= 10) {
                                setCrimeMin = 10;
                            } else if (parseInt($(this).children("td:eq(4)").text()) >= 1) {
                                setCrimeMin = 1;
                            } else if (parseInt($(this).children("td:eq(4)").text()) === 0) {
                                setCrimeMin = -1;
                            }
                        });
                    }

                    // Bootlegging helpers
                    if (document.location.href.indexOf(bootUrl) > -1) {
                        var bootTableRow = document.getElementsByTagName('tbody')[11].childNodes[14]; // Finds crates row
                        var bootPriceTableRow = document.getElementsByTagName('tbody')[11].childNodes[8]; // Finds price row

                        // Cognac
                        var cognacAmount = parseInt(bootTableRow.childNodes[17].innerText, 10); // Get's the amount
                        var cogPrice = parseInt(bootPriceTableRow.childNodes[17].textContent.match(/\d/g).join(""), 10);

                        // Wine
                        var wineAmount = parseInt(bootTableRow.childNodes[15].innerText, 10); // Get's the amount
                        var winPrice = parseInt(bootPriceTableRow.childNodes[15].textContent.match(/\d/g).join(""), 10);

                        // Tequila
                        var teqAmount = parseInt(bootTableRow.childNodes[13].innerText, 10); // Get's the amount
                        var teqPrice = parseInt(bootPriceTableRow.childNodes[13].textContent.match(/\d/g).join(""), 10);

                        // Get carry amount
                        var carryAmount = document.getElementsByTagName('tbody')[11].childNodes[2].childNodes[1].childNodes[4].textContent.match(/\d/g).join("");
                        console.log(carryAmount);
                        // Purchase Cells
                        var cognac = "input[name='purch[9]']";
                        var wine = "input[name='purch[8]']";
                        var tequila = "input[name='purch[7]']";

                        // Negotiation variables
                        var higher = ("input[value='h']");
                        var lower = ("input[value='l']");
                    }

                    // Sell all booze
                    function sellAll() {
                        var sellAll = $ (("input[name='sellAll']")).prop("checked",true);;
                        sellAll.find("input[type=checkbox]").click();
                        $("input[value='Complete transaction!']").click();
                    }

                    // Buy booze
                    function buyBooze(booze) {
                        $(booze).val(carryAmount);
                        $("input[value='Complete transaction!']").click();
                    }

                    // Negotations
                    function negotiation(pref) {
                        // selects the radio and commits
                        var negPrefLower = $ (pref).prop("checked",true);
                        negPrefLower.find("input[type=radio]").click();
                        $("input[value='Do it!']").click();
                    }

                    // Travel
                    function travel(state) {
                        console.log("travelling to: " + state);
                        // Travel to selected state
                        $("input[name='travelto']").val(state);
                        $("input[value='Travel!']").click();
                    }

                    // Auto Burglary helpers
                    if (document.location.href.indexOf(burgUrl) > -1) {
                        if ($(".header:contains(Stolen car)").length) {
                            clearInterval(checker);
                            go = false;
                            console.log("We stole a car!");
                            var dropCars = ["KEEPALL"];
                            var carCheckbox = $("input[type='checkbox'][class='selCar']").first();
                            var carStolen = carCheckbox.parent().parent().parent().children("td:eq(2)").text().toLowerCase();
                            var dropped = false;
                            carCheckbox.prop('checked', true);
                            if (carStolen !== "police car" && carStolen !== "duesenberg" && carStolen !== "beauford" && carStolen !== "phaeton" && carStolen !== "chevrolet" && carStolen !== "stutz" && carStolen !== "comet" && carStolen !== "essex" && carStolen !== "starpegasus" || carStolen.indexOf(dropCars) > -1) {
                                console.log("The car sucked so we threw it out...");
                                $("[name='dropCars']").click();
                            } else {
                                console.log("We will send the car to another state...");
                                $.fn.randomize = function (tree, childElem) {
                                    return this.each(function () {
                                        var $this = $(this);
                                        if (tree) $this = $(this).find(tree);
                                        var unsortedElems = $this.children(childElem);
                                        var elems = unsortedElems.clone();

                                        elems.sort(function () {
                                            return (Math.round(Math.random()) - 0.5);
                                        });

                                        for (var i = 0; i < elems.length; i++)
                                            unsortedElems.eq(i).replaceWith(elems[i]);
                                    });
                                };
                                $("[name='shipCarFrm']").randomize("#goState", "option");

                                $("#shipPlate").val(carCheckbox.parent().parent().parent().children("td:eq(1)").text());
                                $("#goState").children().each(function () {
                                    if (parseInt($(this).attr("data-miles")) > 0 && $('#1').text() !== $(this).attr('data-state')) {
                                        $(this).parent().val($(this).val()).change();
                                        $("[name=shipcar]").click();
                                        console.log("We sent the car to another state!");
                                        return false;
                                    }
                                });
                            }
                        }
                    }
                    if (notInJail) {
                        // Start Wait Module
                        if (!bootReady && !crimeReady && !traReady && !racReady) {
                            if (document.location.href.indexOf(crimeUrl) > -1) {
                                $('.insideTables').html('<div class="insideTables"><table width="500" cellspacing="0" cellpadding="2" class="sub2 centered" id="countdownTimers"><tbody><tr><td align="center" class="header" colspan="5">Mike\'s Script Status</td></tr><form method="post" action="/crimes.php"></form><tr><td class="sub3" align="center" colspan="5"><br><h3>BORED AS FUCK!</h3><p>We have nothing to do!</p><br><br></td></tr></tbody></table></div>');
                            } else {
                                $("#timer-cri").click();
                            }
                        } // End of Wait Module
                        // Start of Crime
                        if (go) {
                            if (crimeReady) {
                                if (document.location.href.indexOf(crimeUrl) > -1) {
                                    console.log("Crime is ready, clicking.");
                                    var crtCity = parseInt($('select[name=toCity]').val());
                                    var nextCity = (crtCity + 1).toString();
                                    var nextCityCrime = true;
                                    $.ajax({
                                        type: "POST",
                                        url: "crimes.php",
                                        data: {toCity: nextCity},
                                        async: false
                                    }).done(function (data) {
                                        nextCityCrime = $(data).find(":contains('do not have enough influence')").length === 0;
                                    });
                                    if (nextCityCrime && nextCity !== '9') {
                                        console.log('Next city has crimes, heading there');
                                        crtCity = parseInt($('select[name=toCity]').val());
                                        nextCity = (crtCity + 1).toString();
                                        $("select[name=toCity]").val(nextCity).change();
                                        go = false;
                                    }
                                    if (!nextCityCrime || nextCity === '9') {
                                        console.log("Next city doesn't have crimes, clicking on current city");
                                        $.ajax({
                                            type: "POST",
                                            url: "crimes.php",
                                            data: {toCity: crtCity},
                                        }).done(function (data) {
                                            var clicked = false;
                                            $("table.cat > tbody > tr > td > div.insideTables > table > tbody > tr:contains('%')").each(function () {
                                                if (parseInt($(this).children("td:eq(4)").text()) >= setCrimeMin && !clicked) {
                                                    console.log("Setting our crime chance to: " + setCrimeMin + "%");
                                                    $(this).find("input[type=radio]").click();
                                                    $("input[value='Commit!']").click();
                                                    clicked = true;
                                                }
                                                go = false;
                                            });
                                            if (!clicked) {
                                                crtCity = parseInt($('select[name=toCity]').val());
                                                var prevCity = (crtCity - 1).toString();
                                                $("select[name=toCity]").val(prevCity).change();
                                                go = false;
                                            }
                                        });
                                        var clicked = false;
                                    }
                                } else {
                                    console.log("Crime is ready, going to Crime.");
                                    $("#timer-cri").click();
                                }
                                clearInterval(checker);
                                go = false;
                            }
                        } // End of Crime
                        // Start of Rackets v1.0.0 - Mike (23/12/18)
                        if (go) {
                            if (racReady) {
                                if (document.location.href.indexOf(racUrl) > -1) {
                                    console.log("Rackets are ready, clicking.");
                                    if ($("input[value='Collect!']").length) {
                                        $("input[value='Collect!']").click();
                                        if ($("input[value='Start!']").length) {
                                            $("input[value='Start!']").click();
                                        }
                                    } else {
                                        console.log("What are you doing here!?");
                                    }
                                    setTimeout(function(){ location.reload(); }, 3*1000);
                                } else {
                                    console.log("Rackets are ready, lets do it!.");
                                    $("#timer-rac").click();
                                }
                                clearInterval(checker);
                                go = false;
                            }
                        } // End of Rackets Module
                        // Start of Auto Burglary
                        if (go) {
                            if (burgReady) {
                                if (document.location.href.indexOf(burgUrl) > -1) {
                                    $(".insideTables tr:contains('crew')").remove();
                                    console.log("Auto burglary is ready, clicking.");
                                    var top = 0;
                                    var topE = $("table.cat > tbody > tr > td div.insideTables > form > table > tbody > tr:contains('%'):eq(2)");
                                    $("table.cat > tbody > tr > td div.insideTables > form > table > tbody > tr:contains('%')").each(function () {
                                        if (parseInt($(this).children().last().text().replace(/[a-z %]/gi, '')) > top) {
                                            top = parseInt($(this).children().last().text().replace(/[a-z %]/gi, ''));
                                            topE = $(this);
                                        }
                                    });
                                    topE.find("input[type=radio]").click();
                                    $("input[value='Steal!']").click();
                                } else {
                                    console.log("Auto burglary is ready, going to auto burglary.");
                                    $("#timer-aut").click();
                                }
                                clearInterval(checker);
                                go = false;
                            }
                        } // End of Auto Burglary
                        // Start of Negotiating up
                        if (go) {
                            if (bootReady) {
                                $.get(traUrl, function(data) {
                                    if (boozeRunMode === "on" && ocReady && data.indexOf('<div><b>New Jersey</b></div>') != -1) {
                                        if (document.location.href.indexOf(bootUrl) > -1) {
                                            console.log("OC is ready so we will start to lower cognac instead of travelling!");
                                            if (teqAmount >= 1) {
                                                console.log("We have tequila to sell");
                                                sellAll();
                                            } else {
                                                if (bootReady) {
                                                    if (document.location.href.indexOf(bootUrl) > -1) {
                                                        if (cogPrice <= 1440) {
                                                            console.log("We have lowered enough");
                                                        } else {
                                                            negotiation(lower);
                                                        }
                                                    } else {
                                                        console.log("Nothing else to do so I will try get a better price for my booze!.");
                                                        $("#timer-boo").click();
                                                    }
                                                    clearInterval(checker);
                                                    go = false;
                                                } else {
                                                    console.log("Negotiation's are still waiting: " + $("#timer-boo").text());
                                                }
                                                clearInterval(checker);
                                                go = false;
                                            }
                                        } else {
                                            $("#timer-boo").click();
                                        }
                                    } else {
                                        if (document.location.href.indexOf(bootUrl) > -1) {
                                            if (teqAmount >= 1 || cognacAmount >= 1) {
                                                if (teqPrice >= 1110 || cogPrice >= 2400) {
                                                    console.log("We have already negotiated to max so we will sell and begin to lower");
                                                    sellAll();
                                                } else {
                                                    console.log("We have booze - let's try and get a better sell price!");
                                                    negotiation(higher);
                                                }
                                            } else {
                                                console.log(teqAmount);
                                                if (cogPrice <= 1472 || teqPrice <= 631) {
                                                    console.log("We have lowered enough");
                                                } else {
                                                    console.log("We have no booze - let's try and get a better buy price!");
                                                    negotiation(lower);
                                                }
                                            }
                                        } else {
                                            $("#timer-boo").click();
                                        }
                                        clearInterval(checker);
                                        go = false;

                                    }
                                }, 'text');
                            }

                        } // End of Negotiating

                        // Start of travelling module - Mike (16/07/18)
                        if (go) {
                            $.get(traUrl, function(data) {
                                if (data.indexOf('<div><b>New Jersey</b></div>') != -1 && ocReady) {
                                    console.log("OC ready - we will not travel");
                                    console.log("BR Mode: " + ocReady);
                                    clearInterval(checker);
                                    go = false;
                                } else if (traReady) {
                                    if(data.indexOf('<div><b>Illinois</b></div>') != -1) { // Start of Illinois
                                        // Go to bootlegging page, sell cognac and buy wine
                                        if (document.location.href.indexOf(bootUrl) > -1) {
                                            if (cognacAmount >= 1) {
                                                console.log("We have cognac to sell");
                                                sellAll();
                                            } else {
                                                if (wineAmount === 0) {
                                                    buyBooze(wine);
                                                } else {
                                                    $("#timer-tra").click();
                                                }
                                            }
                                        } else if (document.location.href.indexOf(traUrl) > -1) {
                                            travel("2");
                                        } else {
                                            $("#timer-boo").click();
                                        }
                                    } else if(data.indexOf('<div><b>Michigan</b></div>') != -1) { // Start of Michigan
                                        // Go to bootlegging page, sell wine and buy cognac
                                        if (document.location.href.indexOf(bootUrl) > -1) {
                                            if (wineAmount >= 1) {
                                                console.log("We have wine to sell");
                                                sellAll();
                                            } else {
                                                if (cognacAmount === 0) {
                                                    buyBooze(cognac);
                                                } else {
                                                    $("#timer-tra").click();
                                                }
                                            }
                                        } else if (document.location.href.indexOf(traUrl) > -1) {
                                            travel("1");
                                        } else {
                                            $("#timer-boo").click();
                                        }
                                    } else if(data.indexOf('<div><b>New Jersey</b></div>') != -1) { // Start of New Jersey
                                        console.log("We are in New Jersey");
                                        // Go to bootlegging page, sell tequilla and buy cognac
                                        if (document.location.href.indexOf(bootUrl) > -1) {
                                            if (teqAmount >= 1 && !ocReady) {
                                                console.log("We have tequila to sell");
                                                sellAll();
                                            } else {
                                                console.log("BR requirement's not met therefore we will buy cognac and travel to Nevada!");
                                                if (cognacAmount === 0) {
                                                    buyBooze(cognac);
                                                } else {
                                                    $("#timer-tra").click();
                                                }
                                            }
                                        } else if (document.location.href.indexOf(traUrl) > -1) {
                                            travel("8");
                                        } else {
                                            $("#timer-boo").click();
                                        }
                                    } else if(data.indexOf('<div><b>Nevada</b></div>') != -1) { // Start of Nevada
                                        // Go to bootlegging page, sell cognac and buy tequila
                                        if (document.location.href.indexOf(bootUrl) > -1) {
                                            if (cognacAmount >= 1) {
                                                console.log("We have cognac to sell");
                                                sellAll();
                                            } else {
                                                if (teqAmount === 0) {
                                                    buyBooze(tequila);
                                                } else {
                                                    $("#timer-tra").click();
                                                }
                                            }
                                        } else if (document.location.href.indexOf(traUrl) > -1) {
                                            travel("9");
                                        } else {
                                            $("#timer-boo").click();
                                        }
                                    } else {
                                        console.log("You must be in either California or New York so we are unable to buy or sell booze!");
                                    }
                                }
                            }, 'text');
                            clearInterval(checker);
                            go = false;
                        }// End of travelling module
                    }
                }
            }
        }
        catch(err) {
            console.log('Oops, something went wrong.');
        }
    }
})();