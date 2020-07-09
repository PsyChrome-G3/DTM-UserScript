# PsyChrome's DTM User Script

A user script that automates the game DownTown Mafia. 

## Features

1. Working

	* Auto Crime Mode: Automatically commits crimes when the crime mode is set to auto. This will attempt to commit the highest available crime.
	* Manual Crime Mode: Manually commits crimes when the crime mode is set to manual. You can then specify which crime you would like to commit.
	* Completionist Mode: Automatically commits crimes that are not mastered.

2. To do

	* Jail Busting: Automatically bust people and yourself from jail.
	
## Installation

1. Make sure you have user scripts enabled in your browser (these instructions refer to the latest versions of the browser):

	* Firefox - install [Tampermonkey](https://tampermonkey.net/?ext=dhdg&browser=firefox) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/).
	* Chrome - install [Tampermonkey](https://tampermonkey.net/?ext=dhdg&browser=chrome).
	* Opera - install [Tampermonkey](https://tampermonkey.net/?ext=dhdg&browser=opera) or [Violent Monkey](https://addons.opera.com/en/extensions/details/violent-monkey/).
	* Safari - install [Tampermonkey](https://tampermonkey.net/?ext=dhdg&browser=safari).
	* Dolphin - install [Tampermonkey](https://tampermonkey.net/?ext=dhdg&browser=dolphin).
	* UC Browser - install [Tampermonkey](https://tampermonkey.net/?ext=dhdg&browser=ucweb).
	
2. Click the link below to install.

	* [DTM-G3.user.js][dtm-raw] - (Updated: 9 Jul 2020)
	
	[dtm-raw]: https://github.com/PsyChrome-G3/DTM-UserScript/raw/master/DTM-G3.user.js
	
## Updating

Userscripts are set up to automatically update. You can check for updates from within the Greasemonkey or Tampermonkey menu, or click on the install link again to get the update.

## Change Log

#### <a name="v1.3.0">Version 1.3.0</a> (09-07-2020)

* New feature
  * Auto-Master mode. With this mode selected the script will work its way through all the crimes that are not mastered from highest to lowest until all crimes have been mastered.
* Code clean up
  * Took out some of the WET code for the ```setTimeouts```.
  
#### <a name="v1.2.3">Version 1.2.3</a> (08-07-2020)

* Updated the GUI style to match the games own styling.
  
#### <a name="v1.2.0">Version 1.2.2</a> (08-07-2020)

* General tidying of the script.

#### <a name="v1.2.0">Version 1.2.1</a> (07-07-2020)

* General tidying of the script.

#### <a name="v1.2.0">Version 1.2.0</a> (07-07-2020)

* Added a setting GUI for changing crime mode and entering details for the crime to be commited in manual mode.

#### <a name="v1.1.0">Version 1.1.0</a> (06-07-2020)

* New Feature
  * Auto Crime mode. With this mode selected the script will select the highest available crime each time to commit.
* General tidying of the script.

#### <a name="v1.0.4">Version 1.0.4</a> (08-07-2020)

* New Feature
  * Manual Crime Mode. You can manually configure which crime you would like to commit.
* Stopped all the unnecessary page reloads so the game looks normal.
* No longer removes the elements from the DOM.

#### <a name="v1.0.3">Version 1.0.3</a> (05-07-2020)

* Added ```timeLeft()``` which retrieves how much time is left from the DOM before another crime can be commited. I then used this function after we attempted to commit the crime as a delay before the next refresh.

#### <a name="v1.0.2">Version 1.0.2</a> (05-07-2020)

* Removed the annoying alert pop up, possible due to the amount of times the page is being refreshed.

#### <a name="v1.0.1">Version 1.0.1</a> (03-07-2020)

* Removes all the locked and lower crimes and jusst leaves the single highest crime in the DOM and commits it.
