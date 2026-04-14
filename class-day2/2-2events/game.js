import EventEmitter from 'events';
import Car from './car.js';

class Game extends EventEmitter {
  constructor() {
    super();

    // Create 3 cars with random fuel each time
    this.cars = [
      new Car('Lightning', 'Toyota Supra'),
      new Car('Thunder',   'BMW M3'),
      new Car('Blaze',     'Ford Mustang'),
    ];

    this.stoppedCount = 0;

    // Listen to each car's 'stopped' event
    this.cars.forEach((car) => {
      car.on('stopped', (stoppedCar) => {
        console.log(`\n*** Car "${stoppedCar.name}" stopped — out of fuel! ***\n`);
        this.stoppedCount++;

        // All cars done → emit raceFinished to app
        if (this.stoppedCount === this.cars.length) {
          this.emit('raceFinished', this.cars);
        }
      });
    });
  }

  startRace() {
    console.log('\n======= RACE STARTED =======\n');
    this.cars.forEach((car) => car.drive());
  }
}

export default Game;
