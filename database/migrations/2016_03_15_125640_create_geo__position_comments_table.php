<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGeoPositionCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {   
        Schema::dropIfExists('geo__position_comments');
        Schema::create('geo__position_comments', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('geo_position_id')->unsigned();
            $table->string('author')->nullable();
            $table->string('msg');


            $table->dateTime('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->dateTime('updated_at')->nullable();
            $table->boolean('defunct')->default(false);
        });

        Schema::table('geo__position_comments', function($table) {
            $table->foreign('geo_position_id')->references('id')->on('geo__positions')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('geo__position_comments');
    }
}
