import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let win;

const createWindow = () => {
	win = new BrowserWindow({
		width: 1000,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});

	win.loadURL('http://localhost:3000');

	win.webContents.setWindowOpenHandler(({ url }) => {
		return {
			action: 'allow',
			overrideBrowserWindowOptions: {
				width: 800,
				height: 600
			}
		};
	});
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
