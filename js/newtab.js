function setTitle(){
	document.getElementById("title").innerHTML = chrome.i18n.getMessage("appTitle");
}

window.addEventListener('load', setTitle);
