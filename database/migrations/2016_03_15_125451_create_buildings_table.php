<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBuildingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {   
        Schema::dropIfExists('buildings');
        Schema::create('buildings', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('city_id')->unsigned();
            $table->string('name');
            $table->string('author')->nullable();
            $table->string('URL');
            //$table->string('rotation');
            //$table->string('quaternion');
            
            $table->float('scale');
            $table->float('atli');
            $table->point('position');

            $table->dateTime('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->dateTime('updated_at')->nullable();
            $table->boolean('onscene')->default(true);

         

        });
        
        DB::statement('ALTER TABLE buildings ADD COLUMN rotation float[]');
        DB::statement('ALTER TABLE buildings ADD COLUMN quaternion float[]');
        DB::statement('ALTER TABLE buildings ADD COLUMN hiddenBuildData string[]');
        
        Schema::table('buildings', function($table) {
            $table->foreign('city_id')->references('id')->on('cities')->onDelete('cascade')->onUpdate('cascade');
        });



        Schema::dropIfExists('buildings_trash');
        Schema::create('buildings_trash', function (Blueprint $table) {
            $table->integer('id');
            $table->integer('city_id')->unsigned();
            $table->string('name');
            $table->string('author')->nullable();
            $table->string('URL');

            $table->float('scale');
            $table->float('atli');
            $table->point('position');
            //$table->multipoint('rotation');
            //$table->multipoint('quaternion');
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->boolean('onscene')->default(false);

        });
        DB::statement('ALTER TABLE buildings_trash ADD COLUMN hiddenBuildData string[]');
        DB::statement('ALTER TABLE buildings_trash ADD COLUMN rotation float[]');
        DB::statement('ALTER TABLE buildings_trash ADD COLUMN quaternion float[]');
        DB::statement('ALTER TABLE buildings_trash ADD COLUMN hiddenBuildData string[]');
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('buildings');
        Schema::drop('buildings_trash');
    }
}
