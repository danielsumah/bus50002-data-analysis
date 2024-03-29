const csv = require("csv-parser");
const fs = require("fs");
const results = [];

fs.createReadStream("nga_subnational_covid19_hera.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    const formattedData = results.map((row) => {
      return {
        date: row.DATE,
        new_cases: +row.CONTAMINES,
      };
    });

    // Group data by day
    const summarizedData = formattedData.reduce((acc, current) => {
      const existingDateEntry = acc.find(
        (entry) => entry.date === current.date
      );

      if (existingDateEntry) {
        // If the date already exists, add the new cases to the existing entry
        existingDateEntry.new_cases += current.new_cases;
      } else {
        // If the date is not found, create a new entry
        acc.push({ date: current.date, new_cases: current.new_cases });
      }

      return acc;
    }, []);

    const firstCaseDateInNigeria = "2/27/2020";
    const dayBeforeVaccinationLaunch = "3/4/2020";
    const vaccineLaunchDate = "3/5/2020";
    const lastDate = "2/2/2022";

    console.log("Summarised data", summarizedData);

    // Filter entries within the date range
    const filteredData = summarizedData.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate >= new Date(firstCaseDateInNigeria) &&
        entryDate <= new Date(dayBeforeVaccinationLaunch)
      );
    });

    const filteredData2 = summarizedData.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate >= new Date(vaccineLaunchDate) &&
        entryDate <= new Date(lastDate)
      );
    });

    // Calculate the sum of new cases in the filtered data
    const sumOfNewCasesBeforeVaccination = filteredData.reduce(
      (sum, entry) => sum + entry.new_cases,
      0
    );

    console.log(`There were ${sumOfNewCasesBeforeVaccination} before vaccination started`);
    console.log(`${(filteredData.length).toFixed(2)} days`);
    console.log(`Average of ${(sumOfNewCasesBeforeVaccination/filteredData.length).toFixed(2)} per day`);
    
    // Calculate the sum of new cases after vaccination in the filtered data
    const sumOfNewCasesAfterVaccination = filteredData2.reduce(
      (sum, entry) => sum + entry.new_cases,
      0
      );
      
      console.log(`There were ${sumOfNewCasesAfterVaccination} after vaccination started`);
      console.log(`${(filteredData2.length).toFixed(2)} days`);
    console.log(`Average of ${sumOfNewCasesAfterVaccination/filteredData2.length} per day`);
  });
