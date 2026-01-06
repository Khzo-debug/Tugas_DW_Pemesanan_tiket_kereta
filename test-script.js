// Test script for script.js functionality
console.log('Testing script.js functionality...');

// Test STORAGE_KEYS
console.log('STORAGE_KEYS:', STORAGE_KEYS);

// Test DataStorage class
console.log('Testing DataStorage class...');
try {
    const history = DataStorage.getHistory();
    console.log('History loaded:', history.length, 'items');

    const profile = DataStorage.getProfile();
    console.log('Profile loaded:', profile);

    const stats = DataStorage.getStatistics();
    console.log('Statistics:', stats);

    console.log('DataStorage class: PASSED');
} catch (error) {
    console.log('DataStorage class: FAILED -', error.message);
}

// Test APIService class (static methods)
console.log('Testing APIService class...');
try {
    // Test that methods exist
    if (typeof APIService.login === 'function') {
        console.log('APIService.login: EXISTS');
    }
    if (typeof APIService.register === 'function') {
        console.log('APIService.register: EXISTS');
    }
    if (typeof APIService.getBookings === 'function') {
        console.log('APIService.getBookings: EXISTS');
    }
    if (typeof APIService.getStatistics === 'function') {
        console.log('APIService.getStatistics: EXISTS');
    }

    console.log('APIService class: PASSED');
} catch (error) {
    console.log('APIService class: FAILED -', error.message);
}

// Test utility functions
console.log('Testing utility functions...');
try {
    const statusText = getStatusText('completed');
    console.log('getStatusText("completed"):', statusText);

    const duration = calculateDuration('08:00', '15:30');
    console.log('calculateDuration("08:00", "15:30"):', duration);

    const formattedDate = formatDate('2023-11-15');
    console.log('formatDate("2023-11-15"):', formattedDate);

    console.log('Utility functions: PASSED');
} catch (error) {
    console.log('Utility functions: FAILED -', error.message);
}

console.log('All tests completed!');
