const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

function onReady () {
	win = new BrowserWindow({width: 900, height: 670, webPreferences: {nodeIntegration: true, contextIsolation: false}})
	win.loadURL(url.format({
		pathname: path.join(
			__dirname,
			'dist/typelocke_dex/index.html'),
		protocol: 'file:',
		slashes: true
	}))

}

app.on('ready', onReady);
