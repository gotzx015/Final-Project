// Store urls to Flask API
var state_predict_url = "/api/statepredictions";
var city_predict_url = "/api/citypredictions";

// Read in state data
d3.json(state_predict_url).then(function(data) {

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
      d3.select("#lineChart").remove();
      d3.select("#plot1").append("canvas")
         .attr("id", "lineChart")
         .attr("width", 200)
         .attr("height", 100);

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
            state_values.push(data[i].dec_2021_predicted);
            state_values.push(data[i].dec_2025_predicted);
            state_values.push(data[i].dec_2030_predicted);
            break;
         };
      };

      // Create line chart of state predicted data
      const labels = ["12/31/2010", "12/31/2011", "12/31/2012", "12/31/2013", "12/31/2014", "12/31/2015", "12/31/2016", "12/31/2017", "12/31/2018", "12/31/2019", "12/31/2020", "12/31/2021", "12/31/2025", "12/31/2030"];
      const line_data = {
      labels: labels,
      datasets: [{
       label: 'Blue: Actual  |  Red: Predicted',
       data: state_values,
       pointBackgroundColor: ['#336699','#336699','#336699','#336699','#336699','#336699','#336699','#336699','#336699','#336699','#336699','red','red','red'],
       pointRadius: 5,
       fill: false
       }]
      };

      var ctx = document.getElementById('lineChart').getContext('2d');

      var lineChart = new Chart(ctx, {
         type: 'line',
         data: line_data,
         options: {
            scales: {
               yAxes: [{
                  ticks: {
                     fontColor: 'black',
                     beginAtZero: true
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
               text: 'Median Household Price Per Year',
               fontColor: '#336699',
               fontSize: 18
            },
            legend: {
               display: true
            }
         }
      });
   };

   // Function to append list of cities to dropdown menu
   function appendcitylist(state_selection) {

      // Select city dropdown menu and remove all cities
      d3.select("#selDataset2").selectAll("option").remove();

      // Read in city data
      d3.json(city_predict_url).then(function(city_data) {

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
      d3.json(city_predict_url).then(function(city_data) {

         // Select dropdown menu
         var dropdownMenu = d3.select("#selDataset2");
  
         // Select the city
         var city_selection = dropdownMenu.property("value");

         // Clear canvas tag and add it back in to clear previous chart
         d3.select("#lineChart2").remove();
         d3.select("#plot2").append("canvas")
            .attr("id", "lineChart2")
            .attr("width", 200)
            .attr("height", 100);

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
               city_values.push(city_data[i].dec_2021_predicted);
               city_values.push(city_data[i].dec_2025_predicted);
               city_values.push(city_data[i].dec_2030_predicted);
               break;
            };
         };

         // Create line chart of state predicted data
         const labels = ["12/31/2010", "12/31/2011", "12/31/2012", "12/31/2013", "12/31/2014", "12/31/2015", "12/31/2016", "12/31/2017", "12/31/2018", "12/31/2019", "12/31/2020", "12/31/2021", "12/31/2025", "12/31/2030"];
         const line_data = {
         labels: labels,
         datasets: [{
          label: 'Blue: Actual  |  Red: Predicted',
          data: city_values,
          pointBackgroundColor: ['#336699','#336699','#336699','#336699','#336699','#336699','#336699','#336699','#336699','#336699','#336699','red','red','red'],
          pointRadius: 5,
          fill: false
         }]
         };

         var ctx = document.getElementById('lineChart2').getContext('2d');

         var lineChart = new Chart(ctx, {
            type: 'line',
            data: line_data,
            options: {
               scales: {
                  yAxes: [{
                     ticks: {
                        fontColor: 'black',
                        beginAtZero: true
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
                  text: 'Median Household Price Per Year',
                  fontColor: '#336699',
                  fontSize: 18
               },
               legend: {
                  display: true
               }
            }
         });
      });
   }

   // When a new state is selected run the function handleSubmit
   d3.select("#selDataset").on("change", handleSubmit);
   d3.select("#selDataset2").on("change", buildcityPlot);
});