<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProposalObjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {   
        Schema::dropIfExists('proposal_objects');
        Schema::create('proposal_objects', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('proposal_id')->unsigned();
            $table->string('name');
            $table->string('author')->nullable();
            $table->string('URL');
            $table->string('preViewImgURL');
            //$table->string('rotation');
            //$table->string('quaternion');
            
            $table->float('scale');
            $table->float('atli');
            $table->point('position');

            $table->dateTime('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->dateTime('updated_at')->nullable();
            $table->boolean('onscene')->default(true);
        });
        DB::statement('ALTER TABLE proposal_objects ADD COLUMN rotation float[]');
        DB::statement('ALTER TABLE proposal_objects ADD COLUMN quaternion float[]');
        DB::statement('ALTER TABLE proposal_objects ADD COLUMN hiddenBuildings int[]');
        DB::statement('ALTER TABLE proposal_objects ADD COLUMN hiddenbuildingsLow string[]');
        Schema::table('proposal_objects', function($table) {
            $table->foreign('proposal_id')->references('id')->on('proposals')->onDelete('cascade')->onUpdate('cascade');
        });


        Schema::dropIfExists('proposal_objects_trash');
        Schema::create('proposal_objects_trash', function (Blueprint $table) {
            $table->integer('id');
            $table->integer('proposal_id')->unsigned();
            $table->string('name');
            $table->string('author')->nullable();
            $table->string('URL');
            $table->string('preViewImgURL');

            $table->float('scale');
            $table->float('atli');
            $table->point('position');

            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->boolean('onscene')->default(false);

        });

        DB::statement('ALTER TABLE proposal_objects_trash ADD COLUMN rotation float[]');
        DB::statement('ALTER TABLE proposal_objects_trash ADD COLUMN quaternion float[]');
        DB::statement('ALTER TABLE proposal_objects_trash ADD COLUMN hiddenBuildings int[]');
        DB::statement('ALTER TABLE proposal_objects_trash ADD COLUMN hiddenbuildingsLow string[]');

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {   
        Schema::drop('proposal_objects_trash');
        Schema::drop('proposal_objects');
    }
}
