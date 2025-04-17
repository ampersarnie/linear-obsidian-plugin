import LinearPlugin from "main";
import { ObsidianProtocolData, request } from "obsidian";
import LinearAPI from "Linear/LinearAPI";

export default (Plugin: LinearPlugin) => async ({
    code, 
    state
}: ObsidianProtocolData) => {
    if (!code) {
      return;
    }

    const response = await request({
      url: 'https://api.linear.app/oauth/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(({
        code: code,
        redirect_uri: 'obsidian://linear-obsidian',
        client_id: 'a8ad4c6932a98da47cbcdb7d24a35016',
        client_secret: 'd899a36f2745f833872c0b726f390a03',
        grant_type: 'authorization_code'
      })).toString()
    });
    
    Plugin.settings.LinearToken = JSON.parse(response);

    Plugin.Linear = new LinearAPI(Plugin.settings.LinearToken?.access_token);

    Plugin.saveSettings();
}