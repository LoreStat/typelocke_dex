const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

function onReady () {
  //titleBarStyle: hidden, width, height, icon: "", frame: false,
  //width 809 works good too
  //mobile example 412 x 915
	win = new BrowserWindow({width: 1200, height: 800, webPreferences: {nodeIntegration: true, contextIsolation: false}, autoHideMenuBar: true})
	win.loadURL(url.format({
		pathname: path.join(
			__dirname,
			'dist/typelocke_dex/index.html'),
		protocol: 'file:',
		slashes: true
	}))

}

app.on('ready', onReady);
