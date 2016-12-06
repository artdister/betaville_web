<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBuildingCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {   
        Schema::dropIfExists('building_comments');
        Schema::create('building_comments', function (Blueprint $table) {
            $table->increments('id');     
            $table->integer('building_id')->unsigned();
            $table->string('author')->nullable();
            $table->string('msg');

            $table->dateTime('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->dateTime('updated_at')->nullable();
            $table->boolean('defunct')->default(false);
        });

        Schema::table('building_comments', function($table) {
            $table->foreign('building_id')->references('id')->on('buildings')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('building_comments');
    }
}
