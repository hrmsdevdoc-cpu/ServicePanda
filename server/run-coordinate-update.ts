import { updateSuburbCoordinates } from './coordinate-updater';

// Run the coordinate update
async function main() {
  try {
    await updateSuburbCoordinates();
    console.log('Coordinate update completed successfully');
  } catch (error) {
    console.error('Coordinate update failed:', error);
  }
  process.exit(0);
}

main();