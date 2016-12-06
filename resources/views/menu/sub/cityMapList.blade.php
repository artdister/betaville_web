  @section('cityMapList')

  <style>
    #glpreViewMenu{
      position: absolute;
      width: 100%;
      z-index: 1;
      opacity: 0.7;
      min-height: 7%
    }
    #glPreView{
      padding: 0 0%;
    }

    input{
      background-color: rgba(0, 0, 0, 0);
      border: 0 solid black;
    }
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
section{

  margin: 5% 0;
}
h5{
    background-color: lightgray;
    margin: 0;
    padding: 5%;
}
  
  #editOption{
    height: 50%;
    width: 100%;
  }
  #editOption input{
    -moz-appearance:textfield;
    width: 30%;
    float:right;
    font-size: 110%;
    border: 1px solid black;
  }
  #progresFrame{
    position: absolute;
    width: 100%;
    height:100%;
    z-index: 20;
    background-color: rgba(0, 0, 0, 0.3);

  }
  .progress{
    width: 80%;
    margin-left:10%;
    position: relative;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  #osmOverpassDiv{


  }
  #osmOverpassDiv ul{
    list-style: none;
    padding: 0;
  }
  #osmOverpassDiv ul li{
    height: 32px;
    padding: 0;
    margin-top: 10%;
    margin-bottom: 10%;

  }
  #osmOverpassDiv p{
    width: 75%;
    float: left;
    margin: 0;
  }
  #osmOverpassDiv input[type="text"]{
    width: 25%;
    text-align: right;
    float: right;
    background-color: white;
    border: 1px solid lightgray;
  }
  #dsColor{

  }
</style>  

<div id="progresFrame">
  <div class="progress">
    <div id="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 100%" class="progress-bar progress-bar-striped active" role="progressbar" >
      <span class=""></span>
    </div>
  </div>
</div>

  <div id="glMapMenu" class="col-sm-4" style="overflow:scroll; height:100%">

    <!--<button onclick="getMapData(this)" data="building"> get Buildings </button> 
    <button onclick="pushMapQuery()"> Push Query </button>-->
  
   
    <div class='sidebar-nav' style="border:1px solid lightgray">  
    <button class="btn navbar-default" style="width:100%" id="opserialDivOC" type="button">Overpass Serial
    </button>
      <div id="osmOverpassDiv" style="display:none; text-align: center;">

          <div class="navbar navbar-default" >
              <h5>Get the Data from Overpass-API</h5>
              <input type="text" style="width:100%; background-color: white;border: 1px solid lightgrey;text-align: center;" value="waterway" id="osmopText">
              <button type="button" style="width:80%; border: 1px solid lightgrey;" class="btn nav navba" onclick="getMapData(this)" data="building"> get Data </button>
          </div>


      <div style="display:none" id="parseToDBDiv">
          <div style="margin-bottom: 25px">
            <h5>Color</h5>
            <input value="rgb(100, 100, 100 )" type="text" style="width:100%; background-color: white;border: 1px solid lightgrey;text-align: center;" id="dsColor">
          </div>



          <div id="mapKeysLines" class="navbar navbar-default" >
              <h5>Lines width</h5>
              <div>
                <h5>Keyword</h5>
                <input type="text" style="width:100%; background-color: white;border: 1px solid lightgrey;text-align: center;" id="searchforKeyTextLines">
                <button type="button" style="width:80%; border: 1px solid lightgrey;" class="btn nav navba" onclick="thatMap.findKey(this)" data="lines"> search </button>
              </div>

               
              <ul></ul>
          </div>


          <div id="mapKeysPolygons" class="navbar navbar-default" >
              <h5>Polygons height</h5>
              <div class="navbar navbar-default">
              <form action="" name="calcPolygonType">
                <input type="radio" name="calcPolygonRadio" value="points" > Point's calculating<br>
                <input type="radio" name="calcPolygonRadio" value="area" checked> Area's calculating<br>
              </form>
              </div>
            <!--  <div>
                <h5>Keyword</h5>
                <input type="text" style="width:100%; background-color: white;border: 1px solid lightgrey;text-align: center;" id="searchforKeyTextPolygons">
                <button type="button" style="width:80%; border: 1px solid lightgrey;" class="btn nav navba" onclick="thatMap.findKey(this)" data="polygons"> search </button>
              </div>
              -->
              <ul></ul>
          </div>


          <div id="mapKeysPoints" class="navbar navbar-default" >
              <h5>Points</h5>
              <div>
                <h5>Keyword</h5>
                <input type="text" style="width:100%; background-color: white;border: 1px solid lightgrey;text-align: center;" id="searchforKeyTextPoints">
                <button type="button" style="width:80%; border: 1px solid lightgrey;" class="btn nav navba" onclick="thatMap.findKey(this)" data="lines"> search </button>
              </div>
              <ul></ul>
          </div>

          <div class="navbar navbar-default" >
              <h5>Push the query to Database</h5>
              <input type="text" style="width:100%; background-color: white;border: 1px solid lightgrey;text-align: center;" value="Name for the Objects" id="osmopDBname">
              <button type="button" style="width:80%; border: 1px solid lightgrey;" class="btn nav navba" onclick="pushMapQuery(this)" city="{{ $city }}" id="calchighBTN" data="building" > Push Query </button>
          </div>

      </div>

      </div>
 
    </div>


    <div id="dbDatasetList" style="margin-top:2%; text-align: center;" class="navbar navbar-default">
      <h5>saved in the database</h5>
      <ul style="list-style: none" class="nav navba ">
      </ul>
    </div> 



  </div>



  <div id="mapPreView" class="col-sm-8"  city="{{ $city->hightmap }}" citydata="{{ $citydata }}" style="height:100%;float:right">
  </div>
  <div id="glPreView"  style="display:none;height:500px;position:absolute;right:0;" class="col-sm-8"  city="{{ $city->hightmap }}" citydata="{{ $citydata }}" style="height:100%;float:right">
  </div>
  </div>
  @endsection


