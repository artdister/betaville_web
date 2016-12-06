@extends('layouts.app')

@section('userManager')
<div id="leftSideSubUserMenu" class="col-sm-12" style="z-index: 0; height: 100%; position: absolute; overflow:auto;">
    <a style="display:none">__construct</a>
	<div class="table-responsive">
		<table id="userManagerList" class="table table-hover" >
			<thead>
				<tr>
			    	<td>Id</td>
			    	<td>Username</td>		
			    	<td>Email</td>
			    <!--	<td>new Password</td> -->
			    	<td>Register</td>
			    	<td>recent login</td>
			    	<td>total logins</td>
			    	<td>Mode</td>
			    	
			  	</tr>
			  </thead>
			  <tbody>
			@foreach($data as $k => $d)
			<tr>
				<td id="id"><a type='text'> {{ $d->id}}</a></td>
				<td ><input id="UseManagerName" type='text' value='{{ $d->name}}'/></td>
				<td ><input id="UseManagerMail" type='text' value='{{ $d->email}}'/></td>
				<!--<td ><input id="UserManagerNewPW" type='text'/></td> -->
				<td><a>{{ $d->created_at }}</a></td>
				<td ><a>{{$d->recent_login}}</a></td>
				<td ><a>{{$d->total_logins}}</a></td>
				<td>
					<select id="userAdminSelecter" class="form-control" style='width:70%; float:left'>
						<option <?php if($d->role == 0 ){echo "selected";} ?> >ordinary</option>
						<option <?php if($d->role == 1 ){echo "selected";} ?> >moderator</option>
						<option <?php if($d->role == 2 ){echo "selected";} ?> >admin</option>

					</select>
					<input style='width:20%;float:right' href="#" type="button" class="btn btn-default" value="save" onclick="editUser(this)"/>
				</td>
			
				
			<tr>
			@endforeach

			</tbody>
	  	</table>
	</div>

</div>
@endsection


----<br>

recent login,
total logins, 
number of comments, 
number of proposals