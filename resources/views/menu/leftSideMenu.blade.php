@extends('layouts.app')

@section('leftSideMenu')
<style>
#post_code_picker{
min-width:100%;
font-size:85%;
border-radius:0;
box-shadow:0 0 0;
position:relative;
background-color:#eee;
border:0;
margin-top:0;
}
#post_code_picker li{

}
</style>
<div class="row" style="margin:0;height:100%">
  <div id="leftSideMenu" class="col-sm-2" style="z-index: 0; height: 100%">

      <div class="sidebar-nav" style="height:100%">
        <div class="navbar navbar-default" role="navigation" style="max-height: 100%; overflow-y: auto;">
          <div class="navbar-collapse collapse sidebar-navbar-collapse">
            <ul class="nav navba ">
              @if(Auth::check())
                @if(Auth::user()->role >= 2)
                  <li value="{{ $id }}" onclick="getCityMap(this)" data="{{ $cityData }}" >
                    <a href="#">Terrain editor</a> </li>
                @endif
              @endif
              <!-- City Objects from picked city -->
              <li value="{{ $id }}" onclick="getCityObjectsData(this)">
                <a href="#" >{{ trans('cities.cityObject') }}</a></li>

              <li value="{{ $id }}" onclick="getProposalsData(this)">
                <a href="#" >{{ trans('cities.proposals') }}</a></li>

            @if(Auth::check())
              @if(Auth::user()->role >= 1)
                <li value="{{ $id }}" onclick="getCityDataSet(this)">
                  <a href="#" >{{ trans('cities.cityDataset') }}</a></li>
              @endif
            @endif
              <li class="nav-divider"></li><!-- - - - - - - - - - - - - - - - - - - - -->

              @if(Auth::check())
                @if(Auth::user()->role >= 2)
                <!-- Add City Object to db with Coords -->
                <li value="{{ $id }}" onclick="getAddCityObjects(this)">
                  <a href="#" >upload city Object</a></li>
                @endif
              @endif

              @if(Auth::check())
                @if(Auth::user()->role >= 1)
                <!-- TRASH for city objects -->
                <li value="{{ $id }}" onclick="getTrashCityObjects(this)">
                  <a href="#" >Buildings Trash</a></li>

                <!-- TRASH for proposal objects -->
                <li value="{{ $id }}" onclick="getTrashProposalObjects(this)">
                  <a href="#" >Proposals Trash</a></li>

                <li class="nav-divider"></li><!-- - - - - - - - - - - - - - - - - - - - -->
                @endif
              @endif


                <li class="dropdown"><!-- Data Picker -->
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">{{ trans('cities.datasetpicker') }}<b class="caret"></b></a>
                  <ul class="dropdown-menu list-group " id="datasetPicked" style="min-width:100%;font-size:85%;border-radius:0;box-shadow:0 0 0;position:relative;background-color:#eee;border:0;margin-top:0;">


                    <li class="list-group-item" style="border: 1px solid #eee; padding: 0 10%; background-color:#eee">
                        <input style="transform:scale(1.3)" type="checkbox" value="terrain" checked >
                          <label style=""> Terrain </label>
                    </li>


                    <li class="list-group-item" style="border: 1px solid #eee; padding: 0 10%; background-color:#eee">
                        <input style="transform:scale(1.3)" type="checkbox" value="cityobjs" checked >
                          <label style=""> {{ trans('cities.cityObjs')}} </label>
                    </li>



                    <li class="nav-divider"></li>
                    <li class="divider"></li>
                    <p style="text-align: center"> Dataset </p>

                    @foreach($data['onLoad'] as $key)
                       <li class="list-group-item" style="border: 1px solid #eee; padding: 0 10%; background-color:#eee">
                            <input style="transform:scale(1.3)" type="checkbox" value="{{ $key['name'] }}" checked >
                              <label style=""> {{  $key['name']  }} </label>
                        </li>
                    @endforeach




                    <li class="nav-divider"></li>
                    <p style="text-align: center"> Visual </p>

                    @foreach($data as $key => $value)
                      @if($key == 'waterlevel')
                        <li class="list-group-item" style="border: 1px solid #eee; padding: 0 10%; background-color:#eee">
                            <input style="transform:scale(1.3)" type="checkbox" value="{{ $key }}" checked >
                              <label style=""> {{  $key }} </label>
                        </li>
                      @endif
                      @if($key == "highestPoint")
    <!--                    <li class="list-group-item" style="border: 1px solid #eee; padding: 0 10%; background-color:#eee">
                            <input style="transform:scale(1.3)" type="checkbox" value="{{ $key }}" checked >
                              <label style="float:right"> {{ trans('cities.topo')}} </label>
                        </li>
  -->                    @endif
                    @endforeach


                    <li class="nav-divider"></li><!-- - - - - - - - - - - - - - - - - - - - -->
                    <li class="nav-divider"></li><!-- - - - - - - - - - - - - - - - - - - - -->


                  </ul>
              </li>
              @if(sizeof($locations) > 0)
              <li class="dropdown" ><!-- Post Code Picker -->
                      <a href="#" id="subDropPostCodeLI" class="dropdown-toggle" data-toggle="dropdown"> Post Codes <b class="caret"></b></a>
                      <ul class="dropdown-menu list-group " id="post_code_picker">
                        @foreach($locations as $key => $value)
                           <li class="list-group-item" style="border: 1px solid #eee; padding: 0 10%; background-color:#eee">
                                <input style="transform:scale(1.3)" type="checkbox" value="{{ $value->cfsauid }}" >
                                <label style=""> {{ $value->cfsauid }}</label>
                            </li>
                        @endforeach


                      </ul>
              </li>
              @endif
              <li> <!-- City Enter  -->
                  <a href="#" onclick="loadGLOptions({{ $id }})">{{ trans('main.cityEnter') }}</a>
              </li>



            </ul>

          </div><!--/.nav-collapse -->
        </div>
      </div>
  </div>


  <div id="leftSideSubMenu" class="col-sm-10" style="z-index: 0; height: 100%; position: absolute; left: 15%;">
  <a style="display:none">__construct</a>

                  @yield('cityObjectList')
                  @yield('cityDataSet')
  </div>


</div>



@endsection
