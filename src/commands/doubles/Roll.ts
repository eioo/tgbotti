export class Roll {
  roll = `${Math.floor(Math.random() * 100)}`.padStart(2, '0');

  get isOnlySameNumbers() {
    return new Set(this.roll).size === 1;
  }
}

export class TriplesRoll extends Roll {
  roll = `${Math.floor(Math.random() * 1000)}`.padStart(3, '0');
}
