import EventEmitter from 'events';

class Car extends EventEmitter {
  // Static: shared across ALL instances — tracks total fuel burned
  static totalFuelUsed = 0;

  constructor(name, model) {
    super();
    this.name  = name;
    this.model = model;
    // Random fuel 5–10 liters
    this.fuel  = Math.floor(Math.random() * 6) + 5;
    this.interval  = null;
    this.isRunning = false;

    console.log(`[Car] ${this.name} (${this.model}) created — fuel: ${this.fuel}L`);
  }

  drive() {
    if (this.isRunning || this.fuel === 0) return;

    this.isRunning = true;
    console.log(`[Car] ${this.name} started driving! Fuel: ${this.fuel}L`);

    this.interval = setInterval(() => {
      this.fuel       -= 1;
      Car.totalFuelUsed += 1;

      console.log(`  ${this.name} => fuel left: ${this.fuel}L`);

      if (this.fuel === 0) {
        clearInterval(this.interval);
        this.interval  = null;
        this.isRunning = false;

        // Emit event so Game knows this car stopped
        this.emit('stopped', this);
      }
    }, 3000);
  }
}

export default Car;
