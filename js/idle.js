var lastState = "active";
function addAutoBlock() {
	if(localStorage["use_timeBlock"] == "true" && containsPassword()) {
		chrome.idle.queryState(parseInt(localStorage["time_block"]), function(state) {
			if(state == "idle" && lastState == "active"){
				lockBrowser();
			}
			lastState = state;
		});
	}
}

