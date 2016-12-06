<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

/*
Route::controllers([
  'auth' => 'Auth\AuthController',
  'password' => 'Auth\PasswordController',
]);

*/




/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/



Route::group(['middleware' => 'web'], function () {
	Route::auth();


Route::get('/', 'Controller@index');



Route::get('gl/{city}', 'Controller@loadCityByIndex');

Route::post('gl/set/{city}' , 'Controller@loadCityByIndex');


Route::get('cities/citymap/{city}' , 'CitiesController@getCityMap');
Route::get('cities/cityobjs/{city}', 'BuildingsController@getCityObejcts');
Route::get('cities/getrash/{city}', 'BuildingsController@getBuildingFromTrash');

Route::get('cities/proposals/{city}', 'ProposalsController@getProposalObjects');
Route::get('cities/geproposaltrash/{id}', 'ProposalsController@getBuildingFromTrash');


Route::post('cities/uploadMapData', 'CitiesController@setMapData');
Route::post('cities/uploadMapDataJSON', 'CitiesController@setMapDataJSON');
Route::group(array('middleware' => 'forceSSL'), function() {




});

Route::get('cities/getDatamap/{city}' , 'CitiesController@getMapDataByCityID');
Route::get('cities/getDatasetGeomByID/{id}', 'CitiesController@getMapDataGeomByID');
Route::get('cities/removeDatasetByID/{id}', 'CitiesController@removeMapDataByID');

Route::get('cities/getCityObjectsbyParent/{city}', 'BuildingsController@getCityObjectsByIndex');

Route::get('cities/getBuildingscomments/{city}', 'CommentsController@getCommentsByBuildId');
Route::post('cities/addBuildingscomment', 'CommentsController@addBuildComment');




Route::post('cities/addProposal', 'ProposalsController@addProposal');

Route::get('cities/getProposalObjectList/{city}', 'ProposalsController@getProposalsObjectsById' );

Route::get('cities/getProposals/{city}', 'ProposalsController@getProposalByParentId');

Route::get('cities/getProposalObjectCommetnsById/{id}', 'CommentsController@getProposalObjectComments');
Route::post('cities/addProposalObjectcomment', 'CommentsController@addProposalObjectComment');


Route::post('cities/uploadProposalObj', 'ProposalsController@uploadProposalObject');

Route::post('cities/addgeoPosition' , 'GeoPositionController@addGeoPosition');
Route::get('cities/getgeppositions/{city}', 'GeoPositionController@getGeoPositionByParent');

Route::get('cities/getgeopositioncommetns/{city}', 'CommentsController@getGeoPositionComments');
Route::post('cities/addgeopositioncomment' , 'CommentsController@addGeoPositionComments');

Route::get('cities/uploadobj', ['middleware' => 'ordinary', 
										'uses' => 'BuildingsController@uploadCityObj']);

Route::post('cities/uploadobj', ['middleware' => 'ordinary', 
										'uses' => 'BuildingsController@uploadCityObj']);

Route::post('cities/movebuilding', 'BuildingsController@buildingReplace');

Route::post('cities/delete/{id}', ['middleware' => 'ordinary', 
										'uses' => 'BuildingsController@moveBuildingToTrashByid']);

Route::post('proposal/delete/{id}', ['middleware' => 'ordinary', 
										'uses' => 'ProposalsController@moveProposalToTrashByid']);

Route::post('proposalObj/delete/{id}',['middleware' => 'ordinary', 
										'uses' => 'ProposalsController@moveBuildingToTrashByid']);

Route::post('geoposition/delete/{id}',['middleware' => 'ordinary', 
										'uses' => 'GeoPositionController@moveGeoPositionToTrashByid']);



Route::get('cities/{city}', 'CitiesController@getCityByIndex');


Route::get('cities/dataset/{city}', ['middleware' => ['ordinary'], 
										'uses' => 'CitiesController@getCityDSByIndex']);


Route::get('cities', 'CitiesController@getAllCities');


Route::get('user/getusers' ,  'UserController@getAllUsers');
Route::post('user/editusermode', 'UserController@editUserMode');

Route::post('account/login', 'UserController@login');
Route::get('account/login', 'UserController@login');




    Route::get('/tasks',  'TaskController@index');
	Route::post('/task', 'TaskController@store');
	Route::delete('/task/{task}', 'TaskController@destroy');



Route::get('lang/{lang}', ['as'=>'lang.switch', 'uses'=>'LanguageController@switchLang']);

Route::get('location/get', 'Controller@getTimeLocation');
Route::get('location/map', 'Controller@getMapLocation');

Route::get('location/all/{id}', 'LocationController@getCitySections');

});
