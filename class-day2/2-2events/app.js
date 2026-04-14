import Car from './car.js';
import Game from './game.js';

const game = new Game();

// App listens to Game's 'raceFinished' event
game.on('raceFinished', (cars) => {
  console.log('\n======= RACE FINISHED =======\n');
  console.log('Results:');
  cars.forEach((car) => {
    console.log(`  ${car.name} (${car.model}) — finished the race`);
  });
  // Static class property — total fuel burned across all cars
  console.log(`\n[Static Car.totalFuelUsed] Total fuel burned: ${Car.totalFuelUsed}L`);
  console.log('\n=============================\n');
});

game.startRace();
