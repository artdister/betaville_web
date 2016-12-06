<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProposalObjectCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {   
        Schema::dropIfExists('proposal_object_comments');
        Schema::create('proposal_object_comments', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('proposal_object_id')->unsigned();
            $table->string('author')->nullable();
            $table->string('msg');


            $table->dateTime('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->dateTime('updated_at')->nullable();
            $table->boolean('defunct')->default(false);
        });

        Schema::table('proposal_object_comments', function($table) {
            $table->foreign('proposal_object_id')->references('id')->on('proposal_objects')->onDelete('cascade')->onUpdate('cascade');
        });

    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('proposal_object_comments');
    }
}
