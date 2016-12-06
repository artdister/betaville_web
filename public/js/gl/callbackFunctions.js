function CityObjsLoadad(objs){
console.log("FINSH");
}




function loadJSON(callback, file) {
console.log("not use anymore use ajax.get(url, callback, method, data, sync)");
}

function loaddedProposals(json){
	propLoader.load(json);
}
function loaddedProposalsOBJ(json){
	thatRay.proposalObjAdd(JSON.parse(json));
}
function loaddedComments(json){
    thatGUI.commentsArray = JSON.parse(json);

}
function geoLoaded(){

	thisCore.loadProposals();

	thisCore.initialised();

	animate();

}

function onLoadedVector(json){

	preLoad.index++;
	thatground.city[preLoad.index-preLoad.buildingsJSON-1].load(JSON.parse(json), preLoad.loadDataSet);

}
function onLoadedBuildings(json){

	preLoad.index++;
	thatground.buildings[preLoad.index-1].loadBuilddingsFromJSON(JSON.parse(json), preLoad.loadDataSet);

}
function onLoadedPoints(json){
	
	preLoad.index++;
	thatground.city[preLoad.index-preLoad.buildingsJSON-1].prepareObjLoad(JSON.parse(json)); // the callback is in the pointsloader.prepareObjLoad

}

function cityObjLoaded(){

		preLoad.indexHD++;
		preLoad.index++;
		preLoad.loadHDModels();

}

function addCityobjToScene(obj){
	thisCore.scene.add(obj["obj"][obj["obj"].length-1]);
}
function addPropoosalToScene(obj){
	thisCore.scene.add(obj);
	thatRay.addIntersectObject(obj);

}

function addProposalCount(json){
	//propLoader.addCount(JSON.parse(json));
}
function onWindowResize() {

	//thatControl.camera.aspect = window.innerWidth / window.innerHeight;
	//thatControl.camera.updateProjectionMatrix();

	//thisCore.renderer.setSize( window.innerWidth, window.innerHeight );

	//thatTopMenuBar.calcSubWidth();
	//thatTopMenuBar.imgBanner.style.height = thatTopMenuBar.topMenuBar.offsetHeight+'px';

	//thatTopMenuBar.stats.domElement.style.width = thatTopMenuBar.imgBanner.offsetWidth+'px';



	var leftMenuHeight = window.innerHeight - 43;
	thatTopMenuBar.citiesMenuUL.style.height = leftMenuHeight+"px";

	var topmWidth = window.innerWidth - 200;
	thatTopMenuBar.topMenuBar.style.width = topmWidth+"px";



}
function statsLoaded(obj){

	thatground.stats.statsObjs['obj'].push(obj);
	thisCore.scene.add(obj);
	thatground.stats.statsOnScene = true;
}
