let mqttClient;
globalTopic = '';
globalRoomname = '';
globalUsername = '';
globalVideoFilename = '';
globalSubtitleisAdded = false;
globalSelectrdSource = 'src-local';
globalConnected = false;
globalFirstTime = true;
globalSync = true;
globalDisconnecion = false;
global_src_option_is_squeezed = true;
let existanceBroadcastIntervalId;
let refreshConnectedPeopleIntervalId;
let fileLink = 'local';
glbalVideoPlaying = false;
globalAncoredTime = 0;
globalSubtitleTolRange = 10;
globalSubtitleFileName = '';
globalMyUniqueKey = '';
globalshowingNotifications = false;
separator = '~';


publishFlag = true;

globalShowSubtitle = false;

globalListOfConnectedPeople = new Map();

innerHTMLById = new Map();
heightsById = new Map();
widthsById = new Map();

usersVideoFileName = new Map();
usersSubFileName = new Map();
userScreenMode = new Map();
notifications = [];

function setFileLink(val){
	fileLink = val;
}
function getFileLink(){
	return fileLink;
}


function setUserScreenMode(username, val){
	userScreenMode.set(username, val);
}
function getUserScreenMode(username){
	return userScreenMode.get(username);
}

function setUserVideoFileName(username, val){
	usersVideoFileName.set(username, val);
}
function getUserVideoFileName(username){
	val = usersVideoFileName.get(username);
	if(val){
		return val;
	}
	else{
		return 'null';
	}
}
function setUserSubtitleName(username, val){
	usersSubFileName.set(username, val);
}
function getUserSubtitleName(username){
	val = usersSubFileName.get(username);
	if(val){
		return val;
	}
	else{
		return 'null';
	}
}
function setSubtitleName(val){
	globalSubtitleFileName = val;
}
function getSubtitleName(){
	return globalSubtitleFileName;
}
function makeUniqueKey(){
	globalMyUniqueKey = Date.now().toString();
}
function getUniqueKey(){
	return globalMyUniqueKey;
}

function showingNotification(){
	return globalshowingNotifications;
}
function notificationShowMode(val){
	globalshowingNotifications = val;
}
function resetNotification(){
	notifications = [];
}
function addNotification(message){
	user = message.user;
	type = message.type;
	event = message.event;
	playTime = message.playTime;
	time = currentTime();
	notification = {user, type, event, playTime, time};
	notifications.push(notification);
} 
function getNotificationList(){
	return notifications;
}
function setPublishFlag(val){
		publishFlag = val;
}
function getPublishFlag(){
	return publishFlag;
}
function setAncoreTime(val){
	globalAncoredTime = val;
}
function getAncoretime(){
	return globalAncoredTime;
}
function setSubtitleTol(val){
	globalSubtitleTolRange = val;
}

function subtitleTolRange(){
	return globalSubtitleTolRange;
}


function showSubtitleEnabled(){
	return globalShowSubtitle;
}
function subtitleVisible(val){
	globalShowSubtitle = val;
}

function subtitleStatus(val){
	globalSubtitleisAdded = val;
}
function subTitleAded(){
	return globalSubtitleisAdded;
}

function setVideoFineName(val){
	globalVideoFilename = val;
}

function videoFileName(){
	return globalVideoFilename;
}

function setPlaying(val){
	glbalVideoPlaying = val;
}

function isPlaying(){
	return glbalVideoPlaying;
}

function getSelectedSource(){
	return globalSelectrdSource;
}

function selectedSource(val){
	globalSelectrdSource = val;
}

function src_option_is_squeezed(){
	return global_src_option_is_squeezed;
}
function src_sqeezed(val){
	global_src_option_is_squeezed = val;
}

function currentTime(){
	return new Date();
}

function getPeopleList(){
	return globalListOfConnectedPeople;
}

function resetPeopleList(){
	globalListOfConnectedPeople = new Map();
}


function userLastResponseTime(username, currentTime){
	const lastResponsetime = globalListOfConnectedPeople.get(username);
	return Math.floor((currentTime - lastResponsetime) / 1000);

}
function registerLastResponseOfUser(username, fileName){
	globalListOfConnectedPeople.set(username, currentTime());
}

function removeUser(username){
	globalListOfConnectedPeople.delete(username);
}


function setUsername(name){
	globalUsername = name;
}
function getUsername(){
	return globalUsername;
}

function setTopic(topic){
	globalTopic = topic;
}

function getTopic(){
	return globalTopic;
}

function intentionalDisconnect(){
	return globalDisconnecion;
}
function setIntentonalDisconnect(val){
	globalDisconnecion = val;
}

function setSync(val){
	globalSync = val;
}
function sync(){
	return globalSync;
}
function setRoomName(name){
	globalRoomname = name;
}
function getRoomName(){
	return globalRoomname;
}

function isConnected(){
  return globalConnected;
}
function setConnected(val){
	globalConnected = val;	
}

function storeHtmlById(id, content){
  innerHTMLById.set(id, content);
}
function storeHeightbyId(id, height){
  heightsById.set(id, height);
}

function getHtmlById(id){
  return innerHTMLById.get(id);
}

function getHeightById(id){
  return heightsById.get(id);
}

function storeWidthbyId(id, width){
  widthsById.set(id, width);
}
function getWidthById(id){
	return widthsById.get(id);
}

function firstConncet(){
	return globalFirstTime;
}

function firstHappened(){
	globalFirstTime = false;
}
function resetFirst(){
	globalFirstTime = true;
}