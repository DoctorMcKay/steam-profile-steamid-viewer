// ==UserScript==
// @name        Steam Community Profile SteamID Viewer
// @namespace   www.doctormckay.com
// @description Shows a user's SteamIDs on their profile
// @include     *://steamcommunity.com/id/*
// @include     *://steamcommunity.com/id/*/
// @include     *://steamcommunity.com/profiles/*
// @include     *://steamcommunity.com/profiles/*/
// @version     1.0.4
// @require     https://raw.githubusercontent.com/DoctorMcKay/steam-profile-steamid-viewer/master/modules.min.js
// @grant       GM_setClipboard
// @grant       GM.setClipboard
// @run-at      document-start
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function() {
	if(typeof unsafeWindow.g_rgProfileData === 'undefined' || !unsafeWindow.g_rgProfileData.steamid) {
		return; // guess this isn't a profile
	}

	var dropdown = document.querySelector('#profile_action_dropdown .popup_body.popup_menu');
	if(dropdown) {
		// We have a dropdown
		dropdown.innerHTML += '<a class="popup_menu_item" href="javascript:OpenSteamIdDialog()"><img src="//steamcommunity-a.akamaihd.net/public/images/skin_1/iconForums.png">&nbsp; View SteamID</a>';
	} else {
		var actions = document.querySelector('.profile_header_actions');
		if(actions) {
			actions.innerHTML += '<a class="btn_profile_action btn_medium" href="javascript:OpenSteamIdDialog()" title="View SteamID">' +
				'<span><img src="https://i.imgur.com/9MQ0ACl.png" style="width: 16px; height: 16px; margin: 7px 0; vertical-align: top"></span></a> ';
		}
	}

	var idDialog;
	unsafeWindow.OpenSteamIdDialog = exportFunction(function() {
		unsafeWindow.HideMenu('profile_action_dropdown_link', 'profile_action_dropdown');

		var sid = new Modules.SteamID(unsafeWindow.g_rgProfileData.steamid);
		var html = '<div class="bb_h1">Click to copy</div>';
		html += '<p><a href="javascript:CopyToClipboard(\'' + sid.getSteam2RenderedID() + '\')">' + sid.getSteam2RenderedID() + '</a></p>';
		html += '<p><a href="javascript:CopyToClipboard(\'' + sid.getSteam3RenderedID() + '\')">' + sid.getSteam3RenderedID() + '</a></p>';
		html += '<p><a href="javascript:CopyToClipboard(\'' + sid.getSteamID64() + '\')">' + sid.getSteamID64() + '</a></p>';
		html += '<p><a href="javascript:CopyToClipboard(\'https://steamcommunity.com/profiles/' + sid.getSteamID64() + '\')">https://steamcommunity.com/profiles/' + sid.getSteamID64() + '</a></p>';

		idDialog = unsafeWindow.ShowAlertDialog(unsafeWindow.g_rgProfileData.personaname + "'s SteamID", html, "Close");
	}, unsafeWindow);

	unsafeWindow.CopyToClipboard = exportFunction(function(text) {
		GM.setClipboard(text);
		unsafeWindow.ShowAlertDialog("Text Copied", '"' + text + '" has been copied to your clipboard.', "OK");
		idDialog.Dismiss();
	}, unsafeWindow);
});
