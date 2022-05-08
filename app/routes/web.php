<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ElectorController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
})->name("welcome");

Route::name("elector.")->prefix("/elector")->group(function () {

    Route::get("/login", [ElectorController::class, "login"])->name("login");

    Route::post("/auth", [ElectorController::class, "auth"])->name("auth");

    Route::get("/dashboard", [ElectorController::class, "dashboard"])
        ->middleware("verify-elector-api-token")
        ->name("dashboard");

});

Route::name("admin.")->prefix("/admin")->group(function () {

    Route::get("/login", [AdminController::class, "login"])->name("login");

    Route::post("/auth", [AdminController::class, "auth"])->name("auth");

    Route::get("/dashboard", [AdminController::class, "dashboard"])
        ->middleware("verify-admin-api-token")
        ->name("dashboard");

    Route::post("/create-election-research", [AdminController::class, "createElectionResearch"])
        ->middleware("verify-admin-api-token")
        ->name("create-election-research");
    
    Route::post("/insert-candidate", [AdminController::class, "insertCandidate"])
        ->middleware("verify-admin-api-token")
        ->name("insert-candidate");
});