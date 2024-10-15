'use strict';

class CityData {
  constructor({ rows, headers = [] }) {
    this.headers = headers;
    this.rows = rows;
  }

  static fromString(
    data,
    options = {
      rowDelimiter: '\n',
      cellDelimiter: ',',
      containsHeaders: true,
    }
  ) {
    const rows = data.split(options.rowDelimiter);
    const headers = options.containsHeaders ?
      rows.shift().split(options.cellDelimiter) :
      [];
    const cells = rows.map((row) => row.split(options.cellDelimiter));
    return new CityData({ headers, rows: cells });
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
  constructor({ rows, headers }) {
    this.rows = rows;
    this.headers = headers;
  }

  sortByDensityPercent() {
    this.rows.sort((a, b) => b.densityPercent - a.densityPercent);
  }

  format() {
    const formattedRows = this.rows.map((row) => {
      const name = row.name.padEnd(18),
        population = row.population.toString().padStart(10),
        area = row.area.toString().padStart(8),
        density = row.density.toString().padStart(8),
        country = row.country.padStart(18),
        densityPercent =
          'densityPercent' in row ?
            row.densityPercent.toString().padStart(6) :
            '';
      return `${name}${population}${area}${density}${country}${densityPercent}`;
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
const table = new CityTable({ rows: cities, headers: cityData.headers });
table.sortByDensityPercent();
console.log(table.format());
