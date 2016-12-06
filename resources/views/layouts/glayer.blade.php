<!DOCTYPE html>
<html lang="en">
<head>
	<title>BetaVille _0.00001</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	<meta name="csrf-token" content="{{ csrf_token() }}" />
	<meta http-equiv="cache-control" content="no-cache" />

	<link rel="stylesheet" href="../css/Main.css">
	<link rel="stylesheet" href="../css/Slider.css">
	<link rel="stylesheet" href="../css/TopMenuBar.css">
	<link rel="stylesheet" href="../css/Comments.css">
	<link rel="stylesheet" href="../css/Proposal.css">
	<link rel="stylesheet" href="../css/GeoSection.css">
	<link rel="stylesheet" href="../css/AddedControl.css">
	<link rel="stylesheet" href="../css/Building.css">

	<?php include "./js/gl/ViewInteract/GUI.php";?>

<!--
	<script src="http://heartcode-canvasloader.googlecode.com/files/heartcode-canvasloader-min-0.9.1.js"></script>
-->
	<script src="../js/libs/three/three.js" type="text/javascript" ></script>


	<script src="../js/libs/three/THREE.Terrain.js" type="text/javascript" ></script>
	<script src="../js/libs/three/loader/ColladaLoader3.js" type="text/javascript" ></script>
	<script src="../js/libs/three/loader/OBJLoader.js" type="text/javascript" ></script>

	<script src="../js/libs/three/controls/OrbitControls.js" type="text/javascript" ></script>
	<script src="../js/libs/three/controls/TransformControls.js" type="text/javascript" ></script>
	<script src="../js/libs/three/Projector.js" type="text/javascript" ></script>
	<script src="../js/libs/three/BoundingBoxHelper.js" type="text/javascript" ></script>

	<script src="../js/libs/three/ShadowMesh.js" type="text/javascript" ></script>

	<script src="../js/libs/three/Detector.js" type="text/javascript" ></script>
	<script src="../js/libs/three/stats.min.js" type="text/javascript" ></script>
	<script src="../js/libs/three/EventsControls.js" type="text/javascript" ></script>

	
	<script src="../js/libs/converter.js" type="text/javascript"></script>

	<script src="../js/libs/suncalc.js" type="text/javascript" ></script>
	<script src="../js/libs/WcsTerrainLoader.js" type="text/javascript" ></script>
	<script src="../js/libs/ajax.js" type="text/javascript" ></script>
	<script src="../js/libs/ThreeCSG.js" type="text/javascript" ></script>

	<script src="../js/libs/sphericalmercator.js" type="text/javascript" ></script>

	

	<script src="../js/libs/wicket.js" type="text/javascript" ></script>
	<script src="../js/libs/d3.v3.min.js" type="text/javascript" ></script>


<!--	<script src="../js/libs/Tween.min.js" type="text/javascript"></script>
-->


	<!--<script src="lib/shapeLoader/shp.js" type="text/javascript"></script>
	<script src="lib/shapeLoader/dbf.js" type="text/javascript"></script>

	<script src="jsFront/php/JSPHPbridge.js" type="text/javascript" ></script>
-->

	<script src="../js/libs/zip/jszip.min.js" type="text/javascript" ></script>
	<script src="../js/libs/zip/jszip-utils.min.js" type="text/javascript" ></script>

	<script src="../js/shaders/SkyShader.js" type="text/javascript"></script>
	


<!--
	<script src="../js/shaders/WaterShader.js" type="text/javascript"></script>	
	<script src="../js/gl/StartupManager/InitProg.js" type="text/javascript"></script>
	<script src="../js/gl/StartupManager/LoadingProg.js" type="text/javascript"></script>
-->
	<script src="../js/gl/StartupManager/preLoad.js" type="text/javascript"></script>

	<script src="../js/gl/Loaders/ProposalLoad.js" type="text/javascript"></script>
	<script src="../js/gl/Loaders/LoadHelpers.js" type="text/javascript" ></script>
	<script src="../js/gl/Loaders/ObjectLoader.js" type="text/javascript" ></script>
	<script src="../js/gl/Loaders/GeoCommentsLoader.js" type="text/javascript" ></script>

	<script src="../js/gl/ViewInteract/controls/ControlHandler.js" type="text/javascript" ></script>

	<script id="guiMode" src="../js/gl/ViewInteract/TopMenuBar.js" type="text/javascript" ></script>

<script id="guiMode" src="../js/gl/ViewInteract/subElem/CommentSection.js" type="text/javascript" ></script>
<script id="guiMode" src="../js/gl/ViewInteract/subElem/ProposalSection.js" type="text/javascript" ></script>
<script id="guiMode" src="../js/gl/ViewInteract/subElem/GeoSection.js" type="text/javascript" ></script>
<script id="guiMode" src="../js/gl/ViewInteract/subElem/AddedControl.js" type="text/javascript" ></script>
<script id="guiMode" src="../js/gl/ViewInteract/subElem/DropSubMenu.js" type="text/javascript" ></script>
<script id="guiMode" src="../js/gl/ViewInteract/subElem/BuildingSection.js" type="text/javascript" ></script>
<script id="guiMode" src="../js/gl/ViewInteract/subElem
/LangSwitch.js" type="text/javascript" ></script>
<script id="guiMode" src="../js/gl/ViewInteract/subElem/LoadinScreen.js" type="text/javascript" ></script>
<script id="guiMode" src="../js/gl/ViewInteract/subElem/HelpFrame.js" type="text/javascript" ></script>
<script id="guiMode" src="../js/gl/ViewInteract/subElem/CamControl.js" type="text/javascript" ></script>

<script id="guiMode" src="../js/gl/Motions/Motions.js" type="text/javascript" ></script>


	@if(Auth::check())

		@if(Auth::user()->role == 0)
<script id="guiMode" src="../js/gl/ViewInteract/subElem/DBInteractOrdinary.js" type="text/javascript" ></script>


		@elseif(Auth::user()->role == 1)
<script id="guiMode" src="../js/gl/ViewInteract/subElem/DBInteractOrdinary.js" type="text/javascript" ></script>
<script id="guiMode" src="../js/gl/ViewInteract/subElem/DBInteractModerator.js" type="text/javascript" ></script>


		@elseif(Auth::user()->role == 2)
<script id="guiMode" src="../js/gl/ViewInteract/subElem/DBInteractOrdinary.js" type="text/javascript" ></script>
<script id="guiMode" src="../js/gl/ViewInteract/subElem/DBInteractModerator.js" type="text/javascript" ></script>

		@endif

	@else


	@endif


	<script src="../js/gl/Lights.js" type="text/javascript" ></script>
	<script src="../js/gl/Geo/GeoGround.js" type="text/javascript" ></script>
	<script src="../js/gl/Geo/TerrainLoader.js" type="text/javascript" ></script>
	<!--<script src="../js/gl/Geo/LineLoader.js" type="text/javascript" ></script> -->
	<script src="../js/gl/Geo/geoJSONLoader.js" type="text/javascript" ></script>
	<script src="../js/gl/Geo/geoStatsLoader.js" type="text/javascript" ></script>
	<script src="../js/gl/Geo/geoObjectLoader.js" type="text/javascript" ></script>
	<script src="../js/gl/Geo/geoPointsLoader.js" type="text/javascript" ></script>


	<script src="../js/gl/Raycaster.js" type="text/javascript" ></script>
	<script src="../js/gl/MouseObj.js" type="text/javascript" ></script>
	<script src="../js/libs/renderStats.js"></script>


	<script src="../js/gl/Core.js" type="text/javascript" ></script>

	<script src="../lang/eng.json" type="text/javascript" ></script>
</head>

<body>

	<div id="container"></div>
	<script src="../js/gl/callbackFunctions.js"></script>

	<script>


	var loadingData = JSON.parse(<?php echo json_encode($data) ?>);
	var worldScale = 27;

	loadingData['city'] = JSON.parse( loadingData['city'] )[0];
	loadingData['user'] = JSON.parse( loadingData['user'] );
	loadingData['loadData'] = JSON.parse( loadingData['loadData']);
	loadingData['loadData']['data'].post_code = JSON.parse(loadingData['loadData']['data'].post_code);

	if(loadingData.models.buildings){
		loadingData['models']['buildings'] = JSON.parse( loadingData.models.buildings );
		//loadingData['models']['buildigs'].low = loadingData['models']['buildigs'].low;
		//loadingData['models']['buildigs'].high = loadingData['models']['buildigs'].high;

		loadingData['models']['proposals'] = JSON.parse( loadingData.models.proposals );
		loadingData['models']['geopositions'] = JSON.parse( loadingData.models.geopositions );


	}
	
	new Core(loadingData['user']);

	var merc = new SphericalMercator({
	    size: 2
	});
	

	new preLoad();

	

	preLoad.addWindowEvent();


/*
	//city.name = unescape(encodeURIComponent(city.name));

	var loadData = new LoadingDataHelper( JSON.parse( data['loadData'] ).data );



	var loading = new LoadingProg();

	loading.addWindowEvent();
	loading.addManagerEvent();

	loading.loadDatasetinfo('../../storage/app/'+city.dataset);
*/


	getMetaToken();






function animate(time) {

	requestAnimationFrame( animate );

	thisCore.render();
	//TWEEN.update(time);

}

function updateProgress(evt) 
{	

   if (evt.lengthComputable) 
   {  

   
		//evt.loaded the bytes browser receive
		//evt.total the total bytes seted by the header
		//

		var percentComplete = (evt.loaded / evt.total)*100;

		thisCore.loadScreen.setpBar(percentComplete);




   } 


}  


function round(x, n) {
	if (n < 1 || n > 14) return false;
		var e = Math.pow(10, n);
		var k = (Math.round(x * e) / e).toString();
	if (k.indexOf('.') == -1) k += '.';
		k += e.toString().substring(1);
	return k.substring(0, k.indexOf('.') + n+1);
}
function getMetaToken(){
	var metaTags=document.getElementsByTagName("meta");

	var fbAppIdContent = "";
	for (var i = 0; i < metaTags.length; i++) {
			if(metaTags[i].getAttribute("name") == "csrf-token"){
				return metaTags[i].getAttribute("content");
			}


	}
}
function addScript(src, callback){
	var jsTag = document.createElement('script');

	jsTag.src = src;
	jsTag.type = "text/javascript";

	document.getElementsByTagName('head')[0].appendChild(jsTag);

	if(typeof(callback) == 'function'){
		jsTag.onload = jsTag.onreadystatechange = function(){
        jsTag.onreadystatechange = jsTag.onload = null;
        	callback();
        }
	}
}

function removeScript(filename){
    var targetelement="script";
    var targetattr="src";
    var allsuspects=document.getElementsByTagName(targetelement)
    for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
        allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
}

function getRandomColor() {

    var color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';

    return color;
}

function disposeNode(node)
{
 if (node instanceof THREE.Camera)
    {
        node = undefined;
    }
    else if (node instanceof THREE.Light)
    {
        node.dispose ();
        node = undefined;
    }
    else if (node instanceof THREE.Mesh)
    {
        if (node.geometry)
        {
            node.geometry.dispose ();
          //  node.geometry = undefined;
        }

        if (node.material)
        {
            if (node.material instanceof THREE.MeshFaceMaterial)
            {
                $.each (node.material.materials, function (idx, mtrl)
                {
                    if (mtrl.map)           mtrl.map.dispose ();
                    if (mtrl.lightMap)      mtrl.lightMap.dispose ();
                    if (mtrl.bumpMap)       mtrl.bumpMap.dispose ();
                    if (mtrl.normalMap)     mtrl.normalMap.dispose ();
                    if (mtrl.specularMap)   mtrl.specularMap.dispose ();
                    if (mtrl.envMap)        mtrl.envMap.dispose ();

                    mtrl.dispose ();    // disposes any programs associated with the material
                 //   mtrl = undefined;
                });
            }
            else
            {
                if (node.material.map)          node.material.map.dispose ();
                if (node.material.lightMap)     node.material.lightMap.dispose ();
                if (node.material.bumpMap)      node.material.bumpMap.dispose ();
                if (node.material.normalMap)    node.material.normalMap.dispose ();
                if (node.material.specularMap)  node.material.specularMap.dispose ();
                if (node.material.envMap)       node.material.envMap.dispose ();

                node.material.dispose ();   // disposes any programs associated with the material
                //node.material = undefined;
            }
        }

       // node = undefined;
    }

}   // disposeNode

function disposeHierarchy(node, callback)
{
    for (var i = 0; i < node.children.length-1; i++)
    {

    	if (node.children[i] instanceof THREE.Mesh)
    	{
        	var child = node.children[i];
        	disposeHierarchy (child, callback);
        	callback (child);
    	}

    }
}
function getSize(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

	</script>

	</body>
</html>
