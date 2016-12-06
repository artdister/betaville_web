function LoadingProg(){

	this.manager = new THREE.LoadingManager();
	this.gl = {};


	this.pipe = {};
	this.pipe['onLoad'] = [];
	this.pipe['dataStats'] = [];
	this.pipe['cityObjects'] = [];
	this.pipe['terrainData'] = [];

	this.objlength = 0;

	if(cityObjs) this.pipe['cityObjects'] = cityObjs;

	this.progressBar = document.createElement("PROGRESS"); 
	this.progressBar.setAttribute("value", 0); 
	this.loadingFile = document.createElement("p");
	this.addmaxProgress(this.pipe['cityObjects'].length); 



	var loadingContainer = document.getElementById("container");
	loadingContainer.appendChild(this.loadingFile);
	loadingContainer.appendChild(this.progressBar);
	this.loadingFile.innerHTML = "Loading: Hightmap"+" : "+city['hightmap'];


};

LoadingProg.prototype.loadDatasetinfo = function(url){

	
		ajax.get(url,'json',
		function(i){
			var json = JSON.parse(i);
		
			loading.pipe['onLoad'] = json.onLoad;
			loading.pipe['dataStats']  = json.dataStats;
			loading.pipe['terrainData'] = {
											"waterlevel":json.waterlevel, 
											"highestPoint":json.highestPoint
											};
			loading.addmaxProgress(loading.pipe['onLoad'].length);
			loading.initProg();

		}
	);

}

LoadingProg.prototype.loadpipe = function(){
	
	
	geoLoad.loadDataSet();
}


LoadingProg.prototype.initProg = function(){

	new InitProg(this.pipe);

}
LoadingProg.prototype.unzipHeighmap = function(url){

	this.manager.itemStart(url);
	JSZipUtils.getBinaryContent(url, function(err,data){
		console.log(city.name);
		var zip = new JSZip(data);
		var objData = zip.file(city.name.toLowerCase()+".xyz").asText();
		loading.loadHightMap(objData);
	})


}
LoadingProg.prototype.loadHightMap = function(data){

		thatground.terrain.load(data, geoLoad.terainLoaded);	
		
}

LoadingProg.prototype.addmaxProgress = function(val){
	this.objlength += val;
	this.progressBar.setAttribute("max",this.objlength);

}
LoadingProg.prototype.addWindowEvent = function(){

	window.addEventListener("dragover",function(e){
		e = e || event;
		e.preventDefault();
	},false);
	window.addEventListener("drop",function(e){
		e = e || event;
		e.preventDefault();
	},false);
	window.addEventListener( 'keydown', function ( event ) {

			switch ( event.keyCode ) {

				case 81: // Q
					thisCore.control.setSpace( thisCore.control.space === "local" ? "world" : "local" );
					break;

				case 87: // W
					thisCore.control.setMode( "translate" );
					break;

				case 69: // E
					thisCore.control.setMode( "rotate" );
					break;

				case 82: // R
					thisCore.control.setMode( "scale" );
					break;

				case 187:
				case 107: // +, =, num+
					thisCore.control.setSize( thisCore.control.size + 0.1 );
					break;

				case 189:
				case 109: // -, _, num-
					thisCore.control.setSize( Math.max( thisCore.control.size - 0.1, 0.1 ) );
					break;

			}
	});
};
LoadingProg.prototype.addManagerEvent = function(){

	this.manager.onProgress = function ( item, loaded, total ) {
//	console.log(item,loaded,total);

	};

	this.manager.onLoad = function () {
		if(thisCore.init == false){
			
	
		}
		
	};

	this.manager.onError = function () {

	};
		

};