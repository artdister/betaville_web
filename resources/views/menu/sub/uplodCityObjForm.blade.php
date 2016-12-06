  
@section('uplodCityObjForm')
<style>

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
section{

  margin: 5% 0;
}
  
  #uploadvalues{
    height: 50%;
    width: 100%;
  }
  #uploadvalues input{
    -moz-appearance:textfield;
    width: 30%;
    float:right;
    font-size: 110%;
  }
  #uploadForm{
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    height: 45%;
    text-align: center;
    width: 100%;
  }
</style>

      <div class="col-sm-4 navbar navbar-default" style="height: 100%;">

@if(Auth::check())
  @if(Auth::user()->role >= 2)
      <div id="uploadvalues">

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



<button  onclick="saveupload(this)">Save this Object</button>

</div>
  @endif
@endif

       	<div id="uploadForm">
            Drop Collada Here

        </div>




      </div>
      <div class="col-sm-8" id="glPreView" style="height:100%;">

      </div>

<script type="text/javascript">



</script>

@endsection