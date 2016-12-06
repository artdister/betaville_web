

  @section('proposalsList')

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
      border-right:1px solid lightgrey; 
      float:left;
      padding: 6px 12px;
    }
    p{
      font-size: 90%;
      margin-bottom: 0;
      margin-right: 10%;
    }
  #proposalDropdownID{
    border:1px groove rgba(0,0,0,0.02);
  }
  #proposalDropdownID li{
    padding:2%;
    margin-left: 10%;
  }
</style>
       
   	<div class="col-sm-4" style="height: 100%; ">
        <div class="navbar navbar-default" role="navigation" style="height:100%; overflow: auto;">
          <div class="navbar-collapse collapse sidebar-navbar-collapse">
            <ul id="cityObjList" class="nav navba" >

            	@foreach($data as $k => $d)


              <li buildID="{{ $d->id }}" cityID="{{ $city->id }}" >

                <a  href="#" onclick="getProposalObjectsData('{{ $d->id }}',this)">{{last(explode(':', $d->name  )) }}</a>
                <ul id="proposalDropdownID" proposalID="{{ $d->id }}" style="position:relative; float: none; box-shadow: 0 0;list-style: none; margin:0; padding:0; display:none;">
                </ul>

              </li>
              


              @endforeach

          
            </ul>

          </div><!--/.nav-collapse -->
        </div>
    </div>


    <div id="glPreView" class="col-sm-8"  city="{{ $city->hightmap }}" style="height:100%;">
          <nav class="navbar navbar-default" id="glpreViewMenu" >
            <ul class="nav navbar-nav" style="float:right">
              @if(Auth::check())
                @if(Auth::user()->role >= 3) 
                  <label class="btn" style="border-left:1px solid lightgrey;">
                      <input type='checkbox' onclick='thatpreView.toggleEdit(this);' > Edit Mode
                  </label> 
                @endif
              @endif
              @if(Auth::check())
                @if(Auth::user()->role >= 1)  
              <label class="btn" style="border-left:1px solid lightgrey;">
                  <input type="button" onclick="delteProposalObj()" value="delete"></input>
              </label>
                @endif
              @endif
            </ul>


            <ul class="nav navbar-nav" style="float:left">

              @if(Auth::check())
                @if(Auth::user()->role >= 2) 
                  <section class="" style="">
              
                  </section>
                @endif
              @endif

            </ul>
          </nav>
    </div>

  </div>
  @endsection

