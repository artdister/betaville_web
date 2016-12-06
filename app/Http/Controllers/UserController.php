<?php

namespace App\Http\Controllers;


use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;

use Auth;
use URL;
use View;

class UserController extends Controller
{	



    public function __construct(UserRepository $user)
    {
        //$this->middleware('auth');
    	$this->user = $user;
    }

    public function getAllUsers(){
    	$users = $this->user->getAllUsers();

        $sections = view('menu.usersub.userManager')
                    ->with('data', $users )
                    ->renderSections();
    

        return  $sections['userManager'];
    }


	public function getRole(){
		return $this->user->getRole();

	}


    public function login(Request $request)
    {
        if ($request->isMethod('post')){

            $auth = false;
            $credentials = $request->only('email', 'password');

            if (auth()->attempt($credentials, $request->has('remember'))) {
               
                $auth = true; // Success
                auth()->loginUsingId(auth()->user()->id);
                $this->user->setLoginData(auth()->user()->id);


                return response()->json([
                    'auth' => $auth,
                    'intended' => URL::previous(),
                    'role' => auth()->user()->role
                ]);
        


            }

        
        
        
       
        }
        if ($request->isMethod('get')){
            if(auth()->check() ){

              auth()->user()->rolestr = $this->user->getRole();
              $sections = view('menu.userMenu')->renderSections();
              return $sections['userMenu'];

            }else{

              $sections = view('menu.guestMenu')->renderSections();
              return $sections['guestMenu'];
              
            }
        }

    }

    function editUserMode(Request $request){

        return $this->user->editUserMode($request);
    

    }

}
