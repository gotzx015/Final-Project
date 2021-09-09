// Store urls to Flask API
var state_combined_url = "/api/statecombineddata";
var state_url = "/api/statedata";
var city_url = "/api/citydata";

// Read in state combined data
d3.json(state_combined_url).then(function(data) {
   
   // Create empty arrays to store data
   state_names = [];
   avg = [];

   // Loop through state combined data and add to empty lists
   for (var i=0; i<data.length; i++) {
      state_names.push(data[i].state);
      avg.push(data[i].agg_median_price);
   }
   
   // Create scatter chart of state combined data
   const labels = state_names;
   const scatter_data = {
     labels: labels,
     datasets: [{
       label: 'Aggregate Median Household Prices',
       data: avg,
       showLine: false,
       pointBackgroundColor: 'black',
       pointRadius: 5
     }]
   };

   var ctx = document.getElementById('scatterChart').getContext('2d');

   var scatterChart = new Chart(ctx, {
      type: 'line',
      data: scatter_data,
      options: {
         scales: {
            yAxes: [{
               ticks: {
                  fontColor: 'black'
               },
            }],
            xAxes: [{
               ticks: {
                  fontColor: 'black'
               }
            }]
         },
         title: {
            display: true,
            text: 'Aggregate Median Household Price from 2010-2020',
            fontColor: '#336699',
            fontSize: 18
         },
         legend: {
            display: false
         }
      }
   });
});

// Read in state data
d3.json(state_url).then(function(data) {

   // Select the dropdown menu
   var select = d3.select("#selDataset");

   // Append the list of states to the dropdown menu
   for (var i=0; i<data.length; i++) {
      select.append("option").text(data[i].state)
   };

   // Create initial charts
   buildstatePlot('Alabama');
   appendcitylist('Alabama');

   // Runs when the drop down menus are selected
   function handleSubmit() {

      // Prevent page from refreshing
      d3.event.preventDefault();
  
      // Select dropdown menu
      var dropdownMenu = d3.select("#selDataset");
  
      // Select the state
      var state_selection = dropdownMenu.property("value");
      
      // Append list of cities based on state selected
      appendcitylist(state_selection);

      // Build plots with chosen state
      buildstatePlot(state_selection);
      buildcityPlot(state_selection);
   };

   // Function to create bar chart of state data
   function buildstatePlot(state_selection) {
      
      // Clear canvas tag and add it back in to clear previous chart
      d3.select("#barChart").remove();
      d3.select("#plot1").append("canvas")
         .attr("id", "barChart")
         .attr("width", 200)
         .attr("height", 100);

      // Clear growth rate label and add it back in to clear previous data
      d3.select("#growthRate").selectAll("h5").remove();
      d3.select("#growthRate").append("h5");

      // Create empty list to hold state data
      state_values = [];

      // Loop through array and add to empty list
      for (var i=0; i<data.length; i++) {
         if (data[i].state === state_selection) {
            state_values.push(data[i].dec_2010);
            state_values.push(data[i].dec_2011);
            state_values.push(data[i].dec_2012);
            state_values.push(data[i].dec_2013);
            state_values.push(data[i].dec_2014);
            state_values.push(data[i].dec_2015);
            state_values.push(data[i].dec_2016);
            state_values.push(data[i].dec_2017);
            state_values.push(data[i].dec_2018);
            state_values.push(data[i].dec_2019);
            state_values.push(data[i].dec_2020);
            break;
         };
      };

      // Perform growth rate calculations
      var total = 0;
      for (var i=0; i<10; i++) {
         total += ((state_values[i+1] - state_values[i])/state_values[i])*100
      }
      var mean = total/10;
      d3.select("#growthRate").selectAll("h5").text("Annual Average Growth Rate: " + mean.toFixed(2) + "%");

      // Create bar chart of state data
      const labels = ["12/31/2010", "12/31/2011", "12/31/2012", "12/31/2013", "12/31/2014", "12/31/2015", "12/31/2016", "12/31/2017", "12/31/2018", "12/31/2019", "12/31/2020"];
      const bar_data = {
         labels: labels,
         datasets: [{
            label: 'Median Household Prices',
            data: state_values,
            backgroundColor: [
               'rgba(255, 99, 132, 1)',
               'rgba(255, 159, 64, 1)',
               'rgba(255, 205, 86, 1)',
               'rgba(75, 192, 192, 1)',
               'rgba(54, 162, 235, 1)',
               'rgba(153, 102, 255, 1)',
               'rgba(255, 99, 132, 1)',
               'rgba(255, 159, 64, 1)',
               'rgba(255, 205, 86, 1)',
               'rgba(75, 192, 192, 1)',
               'rgba(54, 162, 235, 1)',
               'rgba(153, 102, 255, 1)'
            ],
            borderColor: [
               'rgb(255, 99, 132)',
               'rgb(255, 159, 64)',
               'rgb(255, 205, 86)',
               'rgb(75, 192, 192)',
               'rgb(54, 162, 235)',
               'rgb(153, 102, 255)',
               'rgb(255, 99, 132)',
               'rgb(255, 159, 64)',
               'rgb(255, 205, 86)',
               'rgb(75, 192, 192)',
               'rgb(54, 162, 235)',
               'rgb(153, 102, 255)'
            ]
         }],
      };

      var ctx = document.getElementById('barChart').getContext('2d');

      var myBarChart = new Chart(ctx, {
         type: 'bar',
         data: bar_data,
         options: {
            scales: {
               y: {
                  beginAtZero: true
               },
               yAxes: [{
                  ticks: {
                     fontColor: 'black'
                  },
               }],
               xAxes: [{
                  ticks: {
                     fontColor: 'black'
                  }
               }]
            },
            title: {
               display: true,
               text: 'Median Household Price Per Year (2010-2020)',
               fontColor: '#336699',
               fontSize: 18
            },
            legend: {
               display: false
            }
         }
      })
   };

   // Function to append list of cities to dropdown menu
   function appendcitylist(state_selection) {

      // Select city dropdown menu and remove all cities
      d3.select("#selDataset2").selectAll("option").remove();

      // Read in city data
      d3.json(city_url).then(function(city_data) {

         // Select the city dropdown menu
         var select = d3.select("#selDataset2");

         // Append the list of cities to the dropdown menu
         for (var i=0; i<city_data.length; i++) {
            if (state_selection === city_data[i].state) {
               select.append("option").text(city_data[i].city)
            }
         };
      });
   }

   // Function to create bar chart of city data
   function buildcityPlot(state_selection) {

      // Read in city data
      d3.json(city_url).then(function(city_data) {

         // Select dropdown menu
         var dropdownMenu = d3.select("#selDataset2");
  
         // Select the city
         var city_selection = dropdownMenu.property("value");

         // Clear canvas tag and add it back in to clear previous chart
         d3.select("#barChart_city").remove();
         d3.select("#plot2").append("canvas")
            .attr("id", "barChart_city")
            .attr("width", 200)
            .attr("height", 100);

         // Clear growth rate label and add it back in to clear previous data
         d3.select("#growthRate_2").selectAll("h5").remove();
         d3.select("#growthRate_2").append("h5");

         // Create empty list to store city data
         var city_values = [];

         // Loop through city data and append to city value list
         for (var i=0; i<city_data.length; i++) {
            if (city_data[i].city === city_selection) {
               city_values.push(city_data[i].dec_2010);
               city_values.push(city_data[i].dec_2011);
               city_values.push(city_data[i].dec_2012);
               city_values.push(city_data[i].dec_2013);
               city_values.push(city_data[i].dec_2014);
               city_values.push(city_data[i].dec_2015);
               city_values.push(city_data[i].dec_2016);
               city_values.push(city_data[i].dec_2017);
               city_values.push(city_data[i].dec_2018);
               city_values.push(city_data[i].dec_2019);
               city_values.push(city_data[i].dec_2020);
               break;
            };
         };

         // Perform growth rate calculations
         var total = 0;
         for (var i=0; i<10; i++) {
            total += ((city_values[i+1] - city_values[i])/city_values[i])*100
         }
         var mean = total/10;
         d3.select("#growthRate_2").selectAll("h5").text("Annual Average Growth Rate: " + mean.toFixed(2) + "%");

         // Create bar chart of city data
         const labels = ["12/31/2010", "12/31/2011", "12/31/2012", "12/31/2013", "12/31/2014", "12/31/2015", "12/31/2016", "12/31/2017", "12/31/2018", "12/31/2019", "12/31/2020"];
         const bar_data = {
            labels: labels,
            datasets: [{
               label: 'Median Household Prices',
               data: city_values,
               backgroundColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(255, 205, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(255, 205, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(153, 102, 255, 1)'
               ],
               borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)'
               ]
            }],
         };

         var ctx = document.getElementById('barChart_city').getContext('2d');

         var myBarChart = new Chart(ctx, {
            type: 'bar',
            data: bar_data,
            options: {
               scales: {
                  y: {
                     beginAtZero: true
                  },
                  yAxes: [{
                     ticks: {
                        fontColor: 'black'
                     },
                  }],
                  xAxes: [{
                     ticks: {
                        fontColor: 'black'
                     }
                  }]
               },
               title: {
                  display: true,
                  text: 'Median Household Price Per Year (2010-2020)',
                  fontColor: '#336699',
                  fontSize: 18
               },
               legend: {
                  display: false
               }
            }
         })
      });
   }

   // When a new state is selected run the function handleSubmit
   d3.select("#selDataset").on("change", handleSubmit);
   d3.select("#selDataset2").on("change", buildcityPlot);
});