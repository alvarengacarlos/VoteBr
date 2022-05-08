<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function login() {
        return view("admin.login");
    }

    public function auth(Request $request) {
        $validatedData = $request->validate([
            "email" => ["required", "email:rfc"],
            "password" => ["required", "string"],
        ]);
        
        $email = $request->input("email");
        $password = $request->input("password");

        //Fazer requisição
        $token = "asfeoiwurweor.dsaklfjslk.kjsalfjsd";
        
        $minutes = 60;
        return redirect()->route("admin.dashboard")->cookie("admin-api-token", $token, $minutes);
        
        return back();
    }
    
    public function dashboard() {        
        return view("admin.dashboard");
    }
        
}
