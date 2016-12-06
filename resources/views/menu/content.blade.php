  @section('content')
            <div id="leftSideMenu" class="col-sm-2" style="z-index: 0; height: 100%;">
                @yield('leftSideMenu')
            </div>

            <div id="leftSideSubMenu" class="col-sm-10" style="z-index: 0; height: 100%; position: absolute; left: 15%;">
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
                <a style="display:none">__construct</a>
                @yield('cityObjectList')
                @yield('cityDataSet')

            </div>


            
            <div id="leftSideSubUserMenu" class="col-sm-12" style="z-index: 0; height: 100%; position: absolute">
                <a style="display:none">__construct</a>
                @yield('userManager')
            </div>


  @endsection