import { app, BrowserWindow, globalShortcut } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';
import waitOn from 'wait-on'; // Add this package to wait for the server to be ready

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let win;

// Function to start the server using child_process
const startServer = () => {
	return new Promise((resolve, reject) => {
		const server = spawn('npm', ['run', 'start'], { cwd: __dirname });

		// Listen for any errors when starting the server
		server.on('error', (err) => {
			reject(`Failed to start server: ${err.message}`);
		});

		// Resolve the promise once the server is successfully started
		server.stdout.on('data', (data) => {
			console.log(`Server stdout: ${data}`);
			if (data.includes('listening on port 3000')) {
				// Adjust this condition based on your server's output
				resolve();
			}
		});

		// Handle server failure
		server.stderr.on('data', (data) => {
			console.error(`Server stderr: ${data}`);
		});
	});
};

// Wait for the server to be ready before creating the window
const waitForServer = () => {
	return waitOn({ resources: ['http://localhost:3000'] }); // Wait for the server at this URL
};

// Create the Electron window
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
				height: 400
			}
		};
	});
};

app.whenReady().then(async () => {
	try {
		await startServer(); // Start the server
		await waitForServer(); // Wait for the server to be ready
		createWindow(); // Open the Electron window once the server is ready
	} catch (err) {
		console.error('Error starting server:', err);
	}

	globalShortcut.register('CommandOrControl+K', () => {
		if (!win || win.isDestroyed()) {
			win = new BrowserWindow({ width: 800, height: 400 });
			win.loadURL('http://localhost:3000');
			win.on('closed', () => (win = null));
		} else {
			win.focus();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});
