@extends('layouts.app')

@section('guestMenu')
       

        <!-- Login -> Right Side Of Navbar -->
            <ul class="nav navbar-nav navbar-right">
                <!-- Authentication Links -->
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                            {{ trans('main.login')}} <span class="caret"></span>
                        </a>

                        <div class="dropdown-menu" role="menu" style="min-width: 215%; padding: 5%;">
                            <div class="secure">{{ trans('main.login')}}</div>
                            {!! Form::open(array('url'=>'account/login','method'=>'POST', 'id'=>'myform')) !!}
                            <div class="control-group">
                              <div class="controls">
                                 {!! Form::text('email','',array('id'=>'emailID','class'=>'form-control span6','placeholder' => trans('main.email'))) !!}
                              </div>
                            </div>
                            <div class="control-group">
                              <div class="controls">
                              {!! Form::password('password',array('id'=>'passwordID', 'class'=>'form-control span6', 'placeholder' => trans('main.passwordEnter'))) !!}
                              </div>
                            </div>
                            {!! Form::button( trans('main.login'), array('class'=>'send-btn', 'onclick' =>'subLoginBTN()')) !!}
                            {!! Form::close() !!}
                        </div>

                    </li>


         <!-- Register -> Right Side Of Navbar -->
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                           {{ trans('main.register') }} <span class="caret"></span>
                        </a>

                        <div class="dropdown-menu" role="menu" style="min-width: 350%;">
                            <form class="form-horizontal" role="form" method="POST" action="{{ url('/register') }}">
                                {!! csrf_field() !!}

                                <div class="form-group{{ $errors->has('name') ? ' has-error' : '' }}">
                                    <label class="col-md-4 control-label"> {{ trans('main.username') }}</label>

                                    <div class="col-md-6">
                                        <input type="text" class="form-control" name="name" value="{{ old('name') }}">

                                        @if ($errors->has('name'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('name') }}</strong>
                                            </span>
                                        @endif
                                    </div>
                                </div>

                                <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                                    <label class="col-md-4 control-label">{{ trans('main.emailAddres') }}</label>

                                    <div class="col-md-6">
                                        <input type="email" class="form-control" name="email" value="{{ old('email') }}">

                                        @if ($errors->has('email'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('email') }}</strong>
                                            </span>
                                        @endif
                                    </div>
                                </div>

                                <div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">
                                    <label class="col-md-4 control-label">{{ trans('main.password') }}</label>

                                    <div class="col-md-6">
                                        <input type="password" class="form-control" name="password">

                                        @if ($errors->has('password'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('password') }}</strong>
                                            </span>
                                        @endif
                                    </div>
                                </div>

                                <div class="form-group{{ $errors->has('password_confirmation') ? ' has-error' : '' }}">
                                    <label class="col-md-4 control-label">{{ trans('main.passwordConfirm') }}</label>

                                    <div class="col-md-6">
                                        <input type="password" class="form-control" name="password_confirmation">

                                        @if ($errors->has('password_confirmation'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('password_confirmation') }}</strong>
                                            </span>
                                        @endif
                                    </div>
                                </div>

                                <div class="form-group">
                                    <div class="col-md-6 col-md-offset-4">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fa fa-btn fa-user"></i>{{ trans('main.register') }}
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </div>

                    </li>
                    
               
            </ul>
       
@endsection