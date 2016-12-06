<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDatasetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {   
        Schema::dropIfExists('datasets');
        Schema::create('datasets', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('city_id')->unsigned();

            $table->geometrycollection('streets');
            $table->geometrycollection('waterways');
            $table->geometrycollection('railroads');

            $table->dateTime('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->dateTime('updated_at')->nullable();
        });

        Schema::table('datasets', function($table) {
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
        Schema::drop('datasets');
    }
}
