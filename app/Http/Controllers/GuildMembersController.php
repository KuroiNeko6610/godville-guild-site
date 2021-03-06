<?php

namespace App\Http\Controllers;

use App\GuildMember;
use App\Services\UserStatsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Carbon\Carbon;

class GuildMembersController extends Controller
{
    public function __construct(UserStatsService $userStatsService)
    {
        $this->userStatsService = $userStatsService;
    }

    /*Ищем список согильдийцев на сохраненной странице*/
    public function parse(Request $request)
    {

        if ($request->hasFile('file')) {
            $added = [];
            $file = Input::file('file');
            $page = file_get_contents($file->path());

            preg_match_all('/<a href=\"https:\/\/godville.net\/gods\/(.+?)>(.+?)<\/a>/', $page, $god_names); // save all links \x22 = "
            preg_match_all("/<h1>(.+?)<\/h1>/", $page, $guild_name);

            if ($guild_name[1][0] !== env("GUILD_NAME")) {
                flash('Данная гильдия нам не интересна, дайте другую')->error();
                return view('guild-members.parse');
            }
		
            foreach ($god_names[2] as $god) {
                if (GuildMember::where('name', $god)->first() === null) {
                    GuildMember::create(['name' => $god]);
                    $added[] = $god;
                }
            }
            flash('Пользователи добавлены')->success();
            return view('guild-members.parse', compact('added'));
        }

        return view('guild-members.parse');

    }
}
