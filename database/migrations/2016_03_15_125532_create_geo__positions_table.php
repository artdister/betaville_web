<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGeoPositionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {   
        Schema::dropIfExists('geo__positions');
        Schema::create('geo__positions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('city_id')->unsigned();

            $table->string('name');
            $table->string('author');
            
            $table->float('atli');
            $table->point('position');
            
            $table->dateTime('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->dateTime('updated_at')->nullable();
            $table->boolean('onscene')->default(true);
        });

        Schema::table('geo__positions', function($table) {
            $table->foreign('city_id')->references('id')->on('cities')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('geo__positions');
    }
}
