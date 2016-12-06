

  @section('cityObjectList')

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
</style>
       
   	<div class="col-sm-4" style="height: 100%; ">
        <div class="navbar navbar-default" role="navigation" style="height:100%; overflow: auto;">
          <div class="navbar-collapse collapse sidebar-navbar-collapse">
            <ul id="cityObjList" class="nav navba" >

            	@foreach($data as $k => $d)


              <li buildID="{{ $d->id }}" cityID="{{ $city->id }}" onclick="thatpreView.load('{{ json_encode($d) }}',this)"><a href="#">{{last(explode(':', $d->name  )) }}</a></li>
             
              @endforeach

          
            </ul>
            <div id="editOption" style="display:none">
              <section>
                Name
                <input name="upname"
                    type = "text"/>
              </section>
              
              <section>
                Latitude
                <input name="uplat"
                    type = "number"/>
              </section>
              
              <section>
                Longitude
                <input name="uplng"
                    type = "number"/>
              </section>
              
              <section>
                Elevation
                <input name="upatli"
                    type = "number"/>
              </section>
              
              <section>
                Scale
                <input name="upscl"
                    type = "number"/>
              </section>

              <section>
                Rotation
                <input name="uprot"
                    type = "number"/>
              </section>
              <button  onclick="saveEditCityObj(this)">Save</button>
            </div>
          </div><!--/.nav-collapse -->
        </div>
    </div>


    <div id="glPreView" class="col-sm-8"  city="{{ $city->hightmap }}" style="height:100%;">
          <nav class="navbar navbar-default" id="glpreViewMenu" >
            <ul class="nav navbar-nav" style="float:right">
              @if(Auth::check())
                @if(Auth::user()->role >= 3) 
              <label class="btn" style="border-left:1px solid lightgrey;">
                  <input type='checkbox' onclick='thatpreView.toggleEdit(this);' > Edit Mode</label> 
                  @endif
              @endif

              @if(Auth::check())
                @if(Auth::user()->role >= 1)  
              <label class="btn" style="border-left:1px solid lightgrey;">
                  <input type="button" onclick="delteObj()" value="delete"></input></label>
                @endif
              @endif
            </ul>
          </nav>
    </div>

  </div>
  @endsection


