// Import the necessary modules.
const appController = require('./src/appController');

async function init() {
	// Run the employee tracker app and display feedback to the user
	await appController();
	// Display feedback to the user
	process.exit(0);
}

// Initialize and run the application
init();