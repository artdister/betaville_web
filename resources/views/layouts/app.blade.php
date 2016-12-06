<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>Beta Ville</title>

    <!-- Fonts -->
    <link href="css/libs/font-awesome.min.css" rel='stylesheet' type='text/css'>
    <link href="css/libs/googlefront.css" rel='stylesheet' type='text/css'>
    <link href="js/libs/leaftlet/leaflet.css" rel='stylesheet' type='text/css'>



    <!-- Styles -->
    <link href="css/libs/bootstrap.min.css" rel="stylesheet">

    <style>
    </style>
    {{-- <link href="{{ elixir('css/app.css') }}" rel="stylesheet"> --}}

    <style>
        body {
            font-family: 'Lato';
        }

        .fa-btn {
            margin-right: 6px;
        }
        .open{
            display:none;
        }

    </style>
    <script src='js/ProgressBar.js' ></script>
    <script src='js/libs/three/three.min.js'></script>

    <script src="js/libs/three/loader/ColladaLoader.js"></script>
    <script src="js/libs/three/loader/JSONLoader.js"></script>
    <script src="js/libs/three/loader/ObjectLoader.js"></script>
    <script src="js/libs/three/controls/OrbitControls.js"></script>
    <script src="js/libs/three/Octree.js"></script>
    <script src="js/libs/three/Projector.js" type="text/javascript" ></script>

    <script src="js/gl/Raycaster.js"></script>


    <script src="js/libs/three/Detector.js"></script>
    <script src="js/libs/three/stats.min.js"></script>
    <script src="js/libs/zip/jszip.min.js" type="text/javascript" ></script>
    <script src="js/libs/zip/jszip-utils.min.js" type="text/javascript" ></script>
    <script src="js/libs/smallworld.js" type="text/javascript" ></script>
    <script src="js/libs/sphericalmercator.js" type="text/javascript" ></script>
    <script src="https://stuk.github.io/jszip/vendor/FileSaver.js" type="text/javascript"></script>

    <script src="js/libs/xml2json.js" type="text/javascript" ></script>

     <script src="http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.js"></script>
    <script src="http://www.sumbera.com/gist/js/vt/geojson-vt-dev.js"></script>
    <script src="http://www.sumbera.com/gist/js/leaflet/canvas/L.CanvasTiles.js"></script>



</head>
<body id="app-layout">
    <nav class="navbar navbar-default"  >
        <div class="container">
            <div class="navbar-header" style="width:15%;">

                <!-- Branding Image -->
                <a href="{{ url('/') }}">
                 <!--  <img src='../public/imgs/betavilleLogo.gif' style="width:80%" > -->
                 <img src='/public/imgs/betaVilleLogo.gif' alt="Beta Ville" style="width:80%" >
                </a>

            </div>
                <div class="collapse navbar-collapse" id="app-navbar-collapse">

                    <!-- Cities List Left Side Of Navbar -->
                    <ul class="nav navbar-nav" style="pointer-events:auto">
                        <li class="dropdown">
                            <a href="#" id="pickedCity" class="dropdown-toggle" data-toggle="dropdown">
                               {{ trans('main.cities') }}
                            </a>
                            <ul class="dropdown-menu ">
                                @foreach ($cities as $cty => $city)

                                <li class="dropdown-menu-citydata"  value= '{{$city->id}}'>
                                    <a class="btn" >
                                            {{ $city->name }}
                                    </a>

                                </li>
                                @endforeach
                            </ul>
                        </li>


                        <!-- Language Switch List Left Side Of Navbar -->
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                {{ Config::get('languages')[App::getLocale()] }}
                            </a>
                            <ul class="dropdown-menu">
                                @foreach (Config::get('languages') as $lang => $language)
                                    @if ($lang != App::getLocale())
                                        <li>
                                            <a href="{{ route('lang.switch', $lang) }}">{{$language}} </a>
                                        </li>
                                    @endif
                                @endforeach
                            </ul>
                        </li>
                    </ul>

                    <div id="UserMenu">
                        @if(Auth::check())
                            @yield('userMenu')
                        @else
                            @yield('guestMenu')
                        @endif

                    </div>

                </div>



        </div>

    </nav>
    <div id='Content' style="position: absolute; height: 85%; width: 100%; overflow: hidden;">







                @yield('leftSideMenu')


            <!--    Cities List Left Side Of Navbar
                <div class="col-sm-3" id="">
                    <h2>{{ trans('main.cityEnter') }}</h2>

                    <select class="form-control" size=3 id="cityFrontList" action= >

                        @foreach ($cities as $cty => $city)
                        <option   style="font-size:140%" cityId = {{ $city->id }} >
                            <a class="" >
                                    {{ $city->name }}
                            </a>

                        </option>
                        @endforeach

                    </select>
                    <input type="button" onclick="loadGL()" class="btn" value="{{ trans('main.cityEnter') }}">
                </div>
            -->







                @yield('userManager')


        </div>




    <!-- JavaScripts -->
    <script src="js/libs/Front/jquery-2.1.4.min.js"></script>
    <script src="js/libs/Front/bootstrap.min.js"></script>
    <script src='js/libs/ajax.js'></script>
    <script src="js/ObjectPreView.js"></script>
    <script src="js/LeafLetMap.js"></script>


    <script>

$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  }
});

$('#dropnoClose').bind('click', function (e) { e.stopPropagation(); })

$(document).ready(function() {

    $( ".dropdown-menu-citydata" ).click(function(event) {
        $('#cityDataset').empty();


        // stop bootstrap.js to hide the parents
/*
        // hide the open children
        $( this ).parent().find(".dropdown-menu-citydata").removeClass('open');
        // add 'open' class to all parents with class 'dropdown-submenu'
        $( this ).parents(".dropdown-menu-citydata").addClass('open');
        // this is also open (or was)
        $( this ).toggleClass('open');
       // $(this).find('a').hide();
    */
        document.getElementById('pickedCity').innerHTML = $(this).find('a').text();

        var merc = new SphericalMercator({
                        size: 2
        });


        $.ajax({
            url:'./cities/'+this.value,
            type:'get',
            success:function(e){
                clearContent();
               // console.log(e);


                document.getElementById('Content').innerHTML = e;

                $('#datasetPicked').click(function(e){
                    e.stopPropagation();
                });
                $('#post_code_picker').click(function(e){
                    e.stopPropagation();
                });




                $('#subDropPostCodeLI').click(function(){
                    if( $('#post_code_picker').is(":visible") == true){
                        $('#post_code_picker').hide();
                    }else{
                        $('#post_code_picker').show();
                    }
                });



            }
        })
    });





});



    function getUserList(){
        $.ajax({
            url:'./user/getusers',
            type:'get',
            success:function(e){
                    clearContent();
                    document.getElementById('Content').innerHTML = e;
            }

        })
    }

    function editUser(row){

        var userdata = $(row).closest('tr')[0].cells;
        var fd = {};

        for(var i = 0;i < userdata.length-1; i++){
            if(userdata[i].firstChild.nodeName == "A"){
                if(userdata[i].id != ""){
                    fd[userdata[i].id] = userdata[i].firstChild.innerHTML;
                }
            }

        }
        fd['mode'] = document.getElementById('userAdminSelecter').selectedIndex;

        fd['username'] = $(row).parent().parent().find('#UseManagerName').val();
        fd['email'] = $(row).parent().parent().find('#UseManagerMail').val();
        fd['password'] =  $(row).parent().parent().find('#UserManagerNewPW').val();
        console.log(fd);
        $.ajax({
            url:'./user/editusermode',
            type:'post',
            data:fd
                ,
            success:function(e){
                var out = JSON.parse(e);

                alert('success');
            },
            headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }


        });


    }
    function subLoginBTN(e){

        $.ajax({
            url: './account/login',
            type: "post",
            data: {
                    'email':$('input[id=emailID]').val(),
                    'password': $('input[id=passwordID]').val(),
                    '_token': $('input[name=_token]').val()
                },
            success: function(data){

                if(data.auth){
                    $.ajax({
                        url:'./account/login',
                        type:'get',
                        success: function(e){

                            document.getElementById('UserMenu').innerHTML = e;

                        }
                    });
                }else{
                    alert('login failed, check email and password');
                }


            }
        });


    }

    function getCityObjectsData(e){


            $.ajax({
                url:'./cities/cityobjs/'+e.value,
                type:'get',
                success: function(e){

                    document.getElementById('leftSideSubMenu').innerHTML = e;

                    new ObjectPreView();


                }
            });



    }


    function getProposalsData(e){


            $.ajax({
                url:'./cities/proposals/'+e.value,
                type:'get',
                success: function(e){

                    document.getElementById('leftSideSubMenu').innerHTML = e;

                    new ObjectPreView();

                }
            });

    }

    function getProposalObjectsData(e, li){

        $.ajax({
                url:'./cities/getProposalObjectList/'+e,
                type:'get',
                success: function(e){



                    if($(li).parent().find('ul').is(':visible') == false){
                        $(li).parent().find('ul').empty();
                        $(li).parent().find('ul').show();
                    }else{

                        $(li).parent().find('ul').slideUp();
                    }


                    for(var i = 0;i < e.length; i++){

                        $(li).parent().find('ul')
                            .append("<li class='btn-default' buildID='"+e[i].id+"' cityID='"+e[i].proposal_id+"' onclick='loadProposalObject("+JSON.stringify(e[i])+",this)'><a class=''  href='#''>"+e[i].name+"</a></li>");

                    }




                }
            });
    }

    function loadProposalObject(json,li){


        //keep the dropdown open
        $(li).parent().on('click', function(e){e.preventDefault();});

        //add Info
        //console.log(json);
        //console.log($('#glpreViewMenu').children()[1] );
        var infoSec = $($('#glpreViewMenu').children()[1]);
        infoSec.empty();
        infoSec.append("<section><p>Name: "+json.name+"</p></section>" );
        infoSec.append("<section><p>Position: "+json.position.position+"</p></section>" );
        infoSec.append("<section><p>Atli.: "+(json.atli/10)+"</p></section>" );


        thatpreView.load(json,li);


    }
    //init letflet

    function getCityMap(c){
        var data = JSON.parse(c.getAttribute('data'));
            
        loadingData = new Array();
        loadingData['loadData'] = new Array();
        loadingData['loadData']['data'] = new Array();
        loadingData['loadData']['data']['waterlevel'] = 'true';
        loadingData['loadData']['data']['topo'] = 'true';
        loadingData['loadData']['data']['terrain'] = 'true';


        


        $.ajax({
            url:'./cities/citymap/'+c.value,
            type:'get',
            success: function(e){

                document.getElementById('leftSideSubMenu').innerHTML = e;
                var citydata = JSON.parse( document.getElementById('glPreView').getAttribute('citydata') );
               
                $('#opserialDivOC').on('click', function(e){

                    if($('#osmOverpassDiv').is(":visible")){

                        $('#osmOverpassDiv').hide();

                    }else{

                        $('#osmOverpassDiv').show();
                        
                    }


                })

                $.ajax({
                    url:'./cities/getDatamap/'+c.value,
                    success: function(d){

                        var listDIV = document.getElementById('dbDatasetList').children[0];
                 
                        for(var i = 0; i < d.length;i++){
                        
                            $('#dbDatasetList ul').append('<li elemID="'+ d[i]['id'] +'" style="border:0px solid black;text-align: center;cursor: pointer;" class="" ><a onclick="thatMap.addToMapFromDB('+ d[i]['id'] +')" style="width:70%;float:left">'+d[i]['name']+'</a> <a style="width:30%;float:left" onclick="thatMap.removeFromDB('+ d[i]['id'] +')"> remove </a> </li>');


                        }
                      

                    }



                })


                merc = new SphericalMercator({
                        size: 2
                });

                require("./js/gl/Geo/GeoGround.js");
                require("./js/gl/Geo/TerrainLoader.js");
                require("./js/libs/WcsTerrainLoader.js");
                require("./js/gl/Geo/geoJSONLoader.js");
                require("./js/gl/Geo/geoObjectLoader.js");
                require("./js/gl/Geo/geoStatsLoader.js");
                require("./js/libs/zip/jszip.min.js");
                require("./js/libs/osmtogeojson.js");

                new GeoGround(citydata);
                


                JSZipUtils.getBinaryContent('../storage/app/'+data.hightmap, function(err,file){
    
                    var zip = new JSZip(file);
                    var objData = zip.file(data.name.toLowerCase()+".xyz").asText();
                    thatground.terrain.load(objData, "");



                    new LeafLetMap(thatground.terrain.bbox, thatground.terrain.plane);
            
                   
                })


            }
        });


    }

/*
    function getCityMap(e){
        var data = JSON.parse(e.getAttribute('data'));
        var worldScale = 27;
        //require("./js/libs/sphericalmercator.js");

        loadingData = new Array();
        loadingData['loadData'] = new Array();
        loadingData['loadData']['data'] = new Array();
        loadingData['loadData']['data']['waterlevel'] = 'true';
        loadingData['loadData']['data']['topo'] = 'true';
        loadingData['loadData']['data']['terrain'] = 'true';
        
        merc = new SphericalMercator({
                        size: 2
        });

        

        $.ajax({
                url:'./cities/citymap/'+e.value,
                type:'get',
                success: function(e){

                    document.getElementById('leftSideSubMenu').innerHTML = e;
                    var citydata = JSON.parse( document.getElementById('glPreView').getAttribute('citydata') );

      
                    require("./js/gl/Geo/GeoGround.js");
                    require("./js/gl/Geo/TerrainLoader.js");
                    require("./js/gl/Geo/geoJSONLoader.js");
                    require("./js/gl/Geo/geoObjectLoader.js");
                    require("./js/gl/Geo/geoStatsLoader.js");
                    require("./js/libs/WcsTerrainLoader.js");
                    require("./js/libs/zip/jszip.min.js");
                    require("./js/libs/osmtogeojson.js");
                    

                    

                
                    new GeoGround(citydata);
                    new MapPreView(data);
                }
            });
    }
*/
    function getMapData(e){
        var bbox = thatground.terrain.bbox;
        var type = e.getAttribute('data');
        var input = document.getElementById('osmopText').value;
        console.log(input);
    //    var node = 'node[type=route]('+bbox[0]+','+bbox[1]+','+bbox[2]+','+bbox[3]+');';
    //    var way = 'way[type=route]('+bbox[0]+','+bbox[1]+','+bbox[2]+','+bbox[3]+');';
    //    var relation = 'relation[type=route]('+bbox[0]+','+bbox[1]+','+bbox[2]+','+bbox[3]+');';

        var node = 'node['+input+']('+bbox[0]+','+bbox[1]+','+bbox[2]+','+bbox[3]+');';
        var way = 'way['+input+']('+bbox[0]+','+bbox[1]+','+bbox[2]+','+bbox[3]+');';
        var relation = 'relation['+input+']('+bbox[0]+','+bbox[1]+','+bbox[2]+','+bbox[3]+');';

        merc = new SphericalMercator({
                        size: 2
        });

        thatMap.progressBar.show();

        $.ajax({
            url:
                'http://overpass-api.de/api/interpreter?data=[out:json];('+node+way+relation+');out;>;out skel qt;',
            dataType: 'json',
            type: 'GET',
            async: true,
            crossDomain: true,
            xhrFields: {
                onprogress: function (e) {

                    thatMap.progressBar.showMSG("download data", 100);

                    }
            }

        }).done(function(e) {

            if(e.elements.length > 0){
                document.getElementById('parseToDBDiv').style.display = "block";
                $('#mapKeysLines ul').empty();
                $('#mapKeysPolygons ul').empty();
                $('#mapKeysPoints ul').empty();
                thatMap.addToMap(osmtogeojson(e));
                
               
            }else{
                alert('no geo data found');
                document.getElementById('calchighBTN').disabled = false;

                thatMap.progressBar.hide();
            }

        });



    }

    function pushMapQuery(elem){

      //  thatMap.progressBar.show();
      //  thatMap.progressBar.showMSG("upload", 100);
        thatMap.reloadgeoData();
        console.log(thatMap.geoDataObj.width );

        for(var key in thatMap.geoDataObj.width ){
            var e = thatMap.geoDataObj.width[key];
            if(e == "width"){
                e = "0.00001"
                thatMap.geoDataObj.width[key] = e;
            }
                       
          

        }


        var city = JSON.parse(elem.getAttribute('city'));
        var name = document.getElementById('osmopDBname').value;
        var fd = new FormData();
        var json = thatMap.uploadGeom.toGeoJSON(); //.features[0];
        var varName = document.getElementById('osmopText').value;
        var cityName = city.name;
        var geoData = thatMap.geoDataObj;
        geoData.color = document.getElementById('dsColor').value;

        fd.append('cityID', city.id);
        fd.append('objectName', name);
        //fd.append('json', JSON.stringify(json));
        //fd.append('varName', varName);
        fd.append('cityName', cityName);

        $.ajax({
            url:'./cities/uploadMapData',
            type:'post',
            data: fd,
            processData: false,
            contentType: false,
            success: function(e){



                var fdjson = new FormData();


                fdjson.append('json', JSON.stringify(json));
                fdjson.append('varName', varName);
                fdjson.append('objectName', name);
                fdjson.append('ds_id', e);
                fdjson.append('geoData', JSON.stringify(geoData) );
                fdjson.append('cityName', cityName);

                $.ajax({
                    url:'./cities/uploadMapDataJSON',
                    type:'post',
                    data: fdjson,
                    processData: false,
                    contentType: false,
                    success: function(e){




                     
                        thatMap.progressBar.hide();
                        $('#dbDatasetList ul').append('<li elemID="'+ e +'" style="border:0px solid black;text-align: center;cursor: pointer;" class="" ><a onclick="thatMap.addToMapFromDB('+ e +')" style="width:70%;float:left">'+name+'</a> <a style="width:30%;float:left" onclick="thatMap.removeFromDB('+ e +')"> remove </a> </li>');

                    }

                });

         
            }



        })
  
    }

    function getCityDataSet(e){


            $.ajax({
                url:'./cities/dataset/'+e.value,
                type:'get',
                success: function(e){

                    document.getElementById('leftSideSubMenu').innerHTML = e;

                }
            });

    }

    function getAddCityObjects(e){
            $.ajax({
                url:'./cities/uploadobj',
                type:'get',
                success: function(e){

                    document.getElementById('leftSideSubMenu').innerHTML = e;
                    new ObjectPreView();
                    document.getElementById('uploadForm').addEventListener('drop',function(e){
                        dropEvent(e);

                    });
                }


            })
    }
    function getTrashCityObjects(e){
            $.ajax({
                url:'./cities/getrash/'+e.value,
                type:'get',
                success: function(e){

                    document.getElementById('leftSideSubMenu').innerHTML = e;
                    new ObjectPreView();
                }


            })
    }

    function getTrashProposalObjects(e){
            $.ajax({
                url:'./cities/geproposaltrash/'+e.value,
                type:'get',
                success: function(e){

                    document.getElementById('leftSideSubMenu').innerHTML = e;
                    new ObjectPreView();
                }


            })
    }



    function dropEvent(event){


            var reader = new FileReader();

              // event.dataTransfer.files enthält eine Liste aller gedroppten Dateien

            var fileFormat = event.dataTransfer.files[0].name.split('.');
            fileFormat = fileFormat[fileFormat.length-1];

            if(fileFormat == 'dae'){
                reader.readAsText(event.dataTransfer.files[0]);

                reader.onload = function(e){
                    var col = e.target.result;
                    var x2js = new X2JS();

                    var jsonObj = x2js.xml_str2json( col);

                    thatpreView.loadFromJsonDOM(col);
                }

              reader.onprogress = function(event) {
                  if (event.lengthComputable) {

                  }
              };


            }


    };

    function saveupload(e){

        var input = e.parentElement.getElementsByTagName('input');
        var data = {
            "name" : "",
            "lat" : "",
            "lng" : "",
            "atli" : "",
            "scale" : "",
            "rotatY" : ""
        }
        for(var i = 0; i < input.length;i++){
            if(input[i].name == "upname"){
                data.name = input[i].value
            }
            if(input[i].name == "uplat"){
                data.lat += input[i].value;
            }
            if(input[i].name == "uplng"){
                data.lng += input[i].value;
            }
            if(input[i].name == "upatli"){
                data.atli += input[i].value;
            }
            if(input[i].name == "upscl"){
                data.scale += input[i].value;
            }
            if(input[i].name == "uprot"){
                data.rotatY += input[i].value;
            }

        }
        //console.log(data);

        var zip = new JSZip();
        zip.file(data.name+".json", JSON.stringify(thatpreView.dae.toJSON()));
        var content = zip.generate({type:"blob",compression:"DEFLATE"});

        saveAs(content, data.name+".zip");



    }

function delteObj(){

   if(thatpreView.dae instanceof THREE.Mesh){
        var confirm = window.confirm("Are your sure?");
        if (confirm == true) {

            $.ajax({
                type: "POST",
                url: './cities/delete/'+thatpreView.dae.userData.id,
                data: {
                    'buildID': thatpreView.dae.userData.id,
                    'cityID' : thatpreView.dae.userData.parentID
                },
                success: function(e){
                    var liElem = document.getElementById('cityObjList').children;
                    for(var i = 0; i < liElem.length; i++){
                        if(liElem[i].getAttribute("buildid") == e){
                            liElem[i].parentNode.removeChild(liElem[i]);
                        }
                    }
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

        } else {


            alert("no delete");


        }
    }

}

function delteProposalObj(){


   if(thatpreView.dae instanceof THREE.Mesh){
        var confirm = window.confirm("Are your sure?");
        if (confirm == true) {

            $.ajax({
                type: "POST",
                url: './proposalObj/delete/'+thatpreView.dae.userData.id,
                data: {
                    'buildID': thatpreView.dae.userData.id,
                    'cityID' : thatpreView.dae.userData.parentID
                },
                success: function(e){

                    var liElem = document.getElementById('proposalDropdownID').children;
                    //console.log(liElem);
                    for(var i = 0; i < liElem.length; i++){
                        if(liElem[i].getAttribute("buildid") == e){
                            liElem[i].parentNode.removeChild(liElem[i]);
                        }
                    }
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

        } else {


            alert("no delete");


        }
    }

}

function loadGLOptions(city){

            var data = document.getElementById('datasetPicked').getElementsByTagName('input');
            var out = new FormData();
            for(var i = 0; i < data.length;i++){
                if( data != "undefined" ){

                    out.append(data[i].value,  data[i].checked);
                }

            }




            if( document.getElementById('post_code_picker') != null ){
                    var post_code_data = new Array();
                    var post_code = document.getElementById('post_code_picker').getElementsByTagName('input');
                    for(var i = 0; i < post_code.length;i++){
                        if(post_code[i].checked){
                            post_code_data.push(post_code[i].value);
                        }

                    }
                    out.append('post_code', JSON.stringify(post_code_data) );
            }else{
                    out.append('post_code', false );
            }


            $.ajax({
                        type: "POST",
                        url: './gl/set/'+city,
                        data: out,
                        processData: false,
                        contentType: false,
                        success: function(e){

                            document.location.href = './gl/'+city;
                        },
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });

}

function loadGL(){

    var list = document.getElementById('cityFrontList');
    city = list.options[list.selectedIndex].getAttribute('cityId');


    //document.location.href = './gl/'+city;


          /*  $.ajax({
                type: "POST",
                url: './gl',
                data: {
                    'id':city
                },
                success: function(e){
                    //document.documentElement.innerHTML = e;

                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
        */
}




    </script>
    <script>
        function maxLengthCheck(object) {
        if (object.value.length > object.maxLength)
            object.value = object.value.slice(0, object.maxLength)
        }

        function isNumeric (evt) {
            //console.log(evt);
            var theEvent = evt || window.event;
            var key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode (key);
            var regex = /[0-9]|\./;
            if ( !regex.test(key) ) {
              theEvent.returnValue = false;
              if(theEvent.preventDefault) theEvent.preventDefault();
            }
        }
        function clearContent(){

            $('#leftSideMenu').html('');
            $('#leftSideSubMenu').html('');
            $('#leftSideSubUserMenu').html('');
        }

        function require(script) {
            $.ajax({
                url: script,
                dataType: "script",
                async: false,           // <-- This is the key
                success: function () {
                    // all good...
                },
                error: function () {
                    throw new Error("Could not load script " + script);
                }
            });
        }
        function round(x, n) {
            if (n < 1 || n > 14) return false;
                var e = Math.pow(10, n);
                var k = (Math.round(x * e) / e).toString();
            if (k.indexOf('.') == -1) k += '.';
                k += e.toString().substring(1);
            return k.substring(0, k.indexOf('.') + n+1);
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
