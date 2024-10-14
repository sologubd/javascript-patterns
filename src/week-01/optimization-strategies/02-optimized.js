'use strict';

/*
 * Is it a good idea to assign maxDensity to the `table obj`?
 * I'm not sure if wee need `headers`, but decided to store it
 */

function City({ city, population, area, density, country }) {
  this.city = city;
  this.population = population;
  this.area = parseInt(area);
  this.density = parseInt(density);
  this.country = country;
}

const parseData = (data) => {
  const lines = data.trim().split('\n');
  const headers = lines.shift().split(',');
  let maxDensity = 0;
  const table = lines.map((line) => {
    const [city, population, area, density, country] = line.split(',');
    if (parseInt(density) > maxDensity) maxDensity = parseInt(density);
    const row = new City({ city, population, area, density, country });
    return row;
  });
  table.headers = headers;
  table.maxDensity = maxDensity;
  return table;
};

const addDensityPercentage = (table) =>
  table.map((row) => ({
    ...row,
    densityPercent: Math.round((row.density * 100) / table.maxDensity),
  }));

const sortByDensityPercent = (table) =>
  table.sort((a, b) => b.densityPercent - a.densityPercent);

const formatRow = (row) => {
  const city = row.city.padEnd(18),
    population = row.population.toString().padStart(10),
    area = row.area.toString().padStart(8),
    density = row.density.toString().padStart(8),
    country = row.country.padStart(18),
    densityPercent = row.densityPercent.toString().padStart(6);
  return `${city}${population}${area}${density}${country}${densityPercent}`;
};

// Usage
const data = `city,population,area,density,country
  Shanghai,24256800,6340,3826,China
  Delhi,16787941,1484,11313,India
  Lagos,16060303,1171,13712,Nigeria
  Istanbul,14160467,5461,2593,Turkey
  Tokyo,13513734,2191,6168,Japan
  Sao Paulo,12038175,1521,7914,Brazil
  Mexico City,8874724,1486,5974,Mexico
  London,8673713,1572,5431,United Kingdom
  New York City,8537673,784,10892,United States
  Bangkok,8280925,1569,5279,Thailand`;

const table = parseData(data);
const tableWithDensityPercentage = addDensityPercentage(table);
const sortedTable = sortByDensityPercent(tableWithDensityPercentage);
sortedTable.map((row) => console.log(formatRow(row)));
