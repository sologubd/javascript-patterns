'use strict';

class CityData {
  constructor({ rows, head = [] }) {
    this.head = head;
    this.rows = rows;
  }

  static fromString(
    data,
    options = { rowDelim: '\n', cellDelim: ',', head: true }
  ) {
    const rows = data.split(options.rowDelim);
    const head = options.head ? rows.shift() : [];
    const headCells = head.split(options.cellDelim);
    const rowCells = rows.map((row) => row.split(options.cellDelim));
    return new CityData({ head: headCells, rows: rowCells });
  }
}

class City {
  constructor({
    name,
    population,
    area,
    density,
    country,
    densityPercent = 0,
  }) {
    this.name = name;
    this.population = parseInt(population);
    this.area = parseInt(area);
    this.density = parseInt(density);
    this.country = country;
    this.densityPercent = parseInt(densityPercent);
  }

  static calculateDensityPercentage(maxDensity) {
    return Math.round((this.density * 100) / maxDensity, 0);
  }
}

class CityTable {
  constructor({ rows, head }) {
    this.rows = rows;
    this.head = head;
  }

  sortByDensityPercent() {
    this.rows.sort((a, b) => b.densityPercent - a.densityPercent);
  }

  format(options = { stringIndent: 20, numberIndent: 10 }) {
    const { stringIndent, numberIndent } = options;
    const formattedRows = this.rows.map((row) => {
      let result = row.name.padEnd(stringIndent);
      result += row.population.toString().padStart(numberIndent);
      result += row.area.toString().padStart(numberIndent);
      result += row.density.toString().padStart(numberIndent);
      result += row.country.padStart(stringIndent);
      result += row.densityPercent.toString().padStart(numberIndent);
      return result;
    });
    return formattedRows.join('\n');
  }
}

// usage
const data = `city,population,area,density,country
Shanghai,24256800,6340,3826,China
Delhi,16787941,1484,11313,India
Lagos,16060303,1171,13712,Nigeria
Istanbul,14160467,5461,2593,Turkey
Tokyo,13513734G,2191,6168,Japan
Sao Paulo,12038175,1521,7914,Brazil
Mexico City,8874724,1486,5974,Mexico
London,8673713,1572,5431,United Kingdom
New York City,8537673,784,10892,United States
Bangkok,8280925,1569,5279,Thailand`;

const cityData = CityData.fromString(data);
// I assume that density percentage might be calculated
// relatively to any number, not only to max density from the dataset
// So it's not a part of any class, but just a number,
// that is calculated using the dataset (in the certain use case)
const maxDensity = cityData.rows.reduce(
  (max, item) => Math.max(max, parseInt(item[3])),
  0
);

// We can use create a `City` object and use it separately,
// or create a table if it's necessary
const cities = cityData.rows.map((item) => {
  const [name, population, area, density, country] = item;
  const densityPercent = Math.round((parseInt(density) * 100) / maxDensity);
  return new City({ name, population, area, density, country, densityPercent });
});
const table = new CityTable({ rows: cities, head: cityData.head });
table.sortByDensityPercent();
console.log(table.format());
