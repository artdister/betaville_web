/*
*   Manage the Terrain 
*/
function GeoGround(dataJSON){

       // console.log(loadingData['loadData']['data']);

        thatground = this;
        this.worldSection = {
            x: null,
            z: null
        };
        this.theights = {
            'min': 10000,
            'max':-10000,
            'center': 0
        };

        this.scaleMatrix = new THREE.Matrix4();
        this.transformtoOriginMatrix = new THREE.Matrix4();
        this.scaleLinesMatrix = new THREE.Matrix4();


        this.hightsPoint = dataJSON.highestPoint;

  

        this.waterlevel = {
            "min": dataJSON.waterlevel.min,
            "max": dataJSON.waterlevel.max
        };

        this.subwaterlevelGeoArray = new Array();

        this.terrain = new Terrain();


        //create new instances for loading GIS data
        this.stats = new geoStatsLoader();
        this.objects = new geoObjectLoader();
        this.lines = new geoJSONLineLoader();


        this.worldScale = 27;
    
        this.city = [];
        this.buildings = [];
        this.transformToOrigin = {
            x : 0,
            z : 0
        }

        this.ray = {
            'up': new THREE.Raycaster(),
            'down': new THREE.Raycaster(),
            'trans': new THREE.Matrix4()

        };
        
        this.ray = {

        'dirupVec' : new THREE.Vector3( 0 , 1, 0 ),
        'dirdownVec' : new THREE.Vector3( 0 , -1, 0 ),
        'orignVec' : new THREE.Vector3( 0 , 0, 0 ),

        'upRay' : new THREE.Raycaster(),
        'downRay' : new THREE.Raycaster(),
        'transMatrix' :  new THREE.Matrix4()


        }

}

//set the 'transformToOrigin' via the terrains center
GeoGround.prototype.setTransformToorigin = function(centerVec){

    this.transformToOrigin.x = centerVec.x;
    this.transformToOrigin.z = centerVec.z;
}

//calculate the high on a point
GeoGround.prototype.getHight = function(array){

    //a up and down ray fired
    this.ray.upRay.set(this.ray.orignVec, this.ray.dirupVec);
    this.ray.downRay.set(this.ray.orignVec, this.ray.dirdownVec);

    this.ray.transMatrix.set(   1, 0, 0, array[0],
                                0, 1, 0, 0,
                                0, 0, 1, array[1],
                                0, 0, 0, 1);

    this.ray.upRay.ray.applyMatrix4(this.ray.transMatrix);
    this.ray.downRay.ray.applyMatrix4(this.ray.transMatrix);

    var interUp = this.ray.upRay.intersectObject(thatground.terrain.plane, true);
    var interDwn = this.ray.downRay.intersectObject(thatground.terrain.plane, true);


    //if one of the rays hit the terrain set return the hight on this position
    if(interUp.length > 0){
       var h = interUp[0].point.y;         
    }else
    if(interDwn > 0){
        var h =  interDwn[0].point.y;
    }else{
        var h = 0;
    }

    return h;

}