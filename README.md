# MMM-IPT
Magic Mirror Module of Islamic Prayer Times

#config 
To add the module do the following which also shows the configurable values:

````javascript
{
    module: 'MMM-IPT',
    position: 'bottom_right', // This can be any of the regions, best results in center regions
    config: {
        updateInterval: 4 * 60 * 1000, // every 4 mins
		    latitude: 37.861676,  //defaults to Konya / Meram.
		    longitude: 32.4641803,
		    timeZoneString: "Europe/Istanbul", // https://www.php.net/manual/en/timezones.php
		    method: 13, //You can see in below the config.
		    school: 1, //"school" - Optional. 0 for Shafii, 1 for Hanfi. If you leave this empty, it defaults to Shafii.
		    adhanSrc: '', // If you want to play azan add the config to this link 'http://www.islamcan.com/audio/adhan/azan1.mp3'.
		    css_class: 'bright medium',
    }
},
````
````javascript
METHODS:

1 - Muslim World League
2 - Islamic Society of North America
3 - Egyptian General Authority of Survey
4 - Umm Al-Qura University, Makkah
5 - University of Islamic Sciences, Karachi
6 - Institute of Geophysics, University of Tehran
7 - Shia Ithna-Ashari, Leva Institute, Qum
8 - Gulf Region
9 - Kuwait
10 - Qatar
11 - Majlis Ugama Islam Singapura, Singapore
12 - Union Organization islamic de France
13 - Diyanet İşleri Başkanlığı, Turkey
14 - Spiritual Administration of Muslims of Russia
````

Thanks for the [eulhaque](https://github.com/eulhaque).
