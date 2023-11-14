Module.register("MMM-IPT",{

	/*
	 * This module uses http://api.aladhan.com/timings/ to fetch Prayer
	 * Timings. One caveat here is the the timings api assumes the
	 * unix timestamp in seconds and hence make sure to use this to
	 * get the timestamp:
	 * Math.floor(Date.now()/1000) 
	 * It also uses islamcan.com for the Adhan audio file.	 
	 * This module uses the existing built-in module to copy the code
	 * structure and develop on top of this.
	Methods:
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

Thanks for the [eulhaque](https://github.com/eulhaque).
	 */
	defaults: {
		updateInterval: 4 * 60 * 1000, // every 24 hour
		initLoadDelay: 0,
		retryDelay: 2500,
		latitude: 37.861676,  //defaults to Norwalk, CT, US
		longitude: 32.4641803,
		timeZoneString: "Europe/Istanbul",
		method: 13, //https://aladhan.com/prayer-times-api
		timingsApi: 'http://api.aladhan.com/v1/timings/', 
		school: 1, //"school" - Optional. 0 for Shafii, 1 for Hanfi. If you leave this empty, it defaults to Shafii.
		adhanSrc: '',
		css_class: 'bright medium',
	},

	start: function() {
		Log.info("starting module " + this.name);
		this.loaded = false;
		this.result = null;
		this.adhan_src = this.config.adhanSrc;
		this.scheduleUpdate(this.config.initLoadDelay);
	},
	
	getDateObj: function(time_str) {
		now = new Date();
		tmp = time_str.split(':');
		hour = parseInt(tmp[0]);
		min = parseInt(tmp[1]);
		
		d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, min, 0);
		return d;
	},
	
	getFormattedTime: function(time_str) {
		var tmp = time_str.split(':');
		var minute = tmp[1];
		var old_hour = tmp[0];
		var am_pm = "AM";

		var new_hour_str = old_hour;
		var new_hour = parseInt(old_hour);
		if (new_hour >= 12) { 
			am_pm = "PM";
		}

		if (new_hour > 12) {
			new_hour = old_hour - 12;
			if (new_hour < 10) { 
				new_hour_str = '0' + new_hour;
			}
		}
		return new_hour_str + ':' + minute + ' ' + am_pm;
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		if (this.loaded) {
			var timings = this.result['data']['timings'];
			var keys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
			var dates = Array();
			var cur_time = null;
			var cur_key = 'Fajr';
			var now = Date.now();
			var self = this;
			for(var i=0; i < keys.length; ++i) {
				var key = keys[i];
				date = this.getDateObj(timings[key]);
				dates[key] = date;
				Log.info(dates[key]);
				if (dates[key] > now ) {
					cur_key = key;
					cur_time = dates[key];
					Log.info("Scheduling Adhan for " + key + ' at ' + date + " Src: " + self.config.adhanSrc);
					setTimeout(
						function() {
							Log.info("Scheduling Adhan for " + key);
						},
						date - now
					);
				}
			}
			for(var i=0; i < keys.length; ++i) {
				var key = keys[i];
				var div = document.createElement("div");
				div.className = this.config.css_class;
				div.innerHTML = key + " " + this.getFormattedTime(timings[key]);
				wrapper.appendChild(div);
			}
		}else {
			Log.info("Still not loaded yet");
		}
		
		return wrapper;
	},
	
	playAdhan: function() {
		Log.info(this.config);		
		Log.info("Playinng adhan now. SRC: " + this.config.adhanSrc);
		var audio = new Audio(this.config.adhanSrc);
		audio.play();
		
	},	
	processTimings: function(data) {
		
		this.loaded = true;
		this.result = data;
		this.updateDom(this.config.animationSpeed);
	},

	updateTimings: function() {
		var currentDate = new Date();
		var url = this.config.timingsApi + currentDate.getDate() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getFullYear() + "?";
		url += "longitude=" + this.config.longitude;
		url += "&latitude=" + this.config.latitude;
		url += "&method=" + this.config.method;
		url += "&school=" + this.config.school;
		var self = this;
		
		var request = new XMLHttpRequest();
		Log.info(url)
		request.open("GET", url, true);
		request.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processTimings(JSON.parse(this.response));
				}else {
					Log.error("Got error. Failed to fetch timings");
				}
			}
		};		
		request.send();
	},

	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update. If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function() {
			self.updateTimings();
		}, nextLoad);
	},
});