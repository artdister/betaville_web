@extends('layouts.app')

@section('userMenu')
     

        <!-- User Profile -> Side Of Navbar -->
            <ul class="nav navbar-nav navbar-right">
                <!-- Authentication Links -->

                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                            {{ Auth::user()->name }},  {{ Auth::user()->getRole() }} <span class="caret"></span>
                        </a>

                        <ul class="dropdown-menu" role="menu">
                            <li>
                                <a href="">Added Buildings</a>
                            </li>



                            <li class="nav-divider"></li> <!--     -->
                            <li><a href="{{ url('/logout') }}">{{ trans('main.logout') }}</a></li>
                        </ul>
                    </li>
          
            </ul>

            @if(Auth::check())
                @if(Auth::user()->role >= 2)  
                    <ul class="nav navbar-nav navbar-right">
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                               Admin Menu
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a href="#" onclick="getUserList()">Users</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                @endif
            @endif
@endsection
