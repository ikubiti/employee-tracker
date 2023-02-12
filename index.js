// Import the necessary modules.
const appController = require('./src/appController');

async function init() {
	// Run the employee tracker app
	await appController();
}

// Initialize and run the application
init();