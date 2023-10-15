// Read JSON Data using D3.js
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";



// Dropdown with subject IDs
d3.json(url).then(function(data) {

    // Extracting Subject IDs
    const subjectIDs = data.names;

    // Selecting the Dropdown Element
    const dropdown = d3.select('#selDataset');

    // Building data to the Dropdown, iterating through subjectIDs
    subjectIDs.map(function(id){
        dropdown
        .append('option')
        .attr('value', id)
        .text(id);
    })
});


// -------------------------------------------------------------------------------------------------


// Function to update the bar chart
function updateBarChart(selectedSubject) {
    // Fetch data for the selected subject from JSON data
    // Extract sample_values, otu_ids, and otu_labels for the selected subject
    const sample_values = selectedSubject.sample_values;
    const otu_ids = selectedSubject.otu_ids;
    const otu_labels = selectedSubject.otu_labels;

    // Sort the data by sample_values in descending order
    let rawData = sample_values.map((value, index) => ({
        sample_values: value,
        otu_ids: otu_ids[index],
        otu_labels: otu_labels[index]
    }));
    rawData.sort((a, b) => b.sample_values - a.sample_values);

    // Extract the top 10 items
    let top10Data = rawData.slice(0, 10);

    // Arranging Descending to Ascending
    top10Data.reverse();

    // data for the bar-chart
    let data = [{
        type: 'bar',
        orientation: 'h', // Horizontal bars
        x: top10Data.map(item => item.sample_values), // Top 10 sample values
        y: top10Data.map(item => `OTU ${item.otu_ids}`), // Top 10 OTU IDs
        text: top10Data.map(item => item.otu_labels), // Hover text
        marker: {
            color: 'lightseagreen'
        }
    }];

    // Display the chart in the "bar-chart" container
    let barChartLayout = {
        margin: {
                t: 50,
                l: 120,
                r: 20,
                b: 45
        },
        title: 'Top 10 OTUs Found',
        titlefont: {
                size: 18,
                family: 'Arial',
                weight: 'bold'
        }
    };
    // Plotting the chart
    Plotly.newPlot('bar', data, barChartLayout);
} 


// -------------------------------------------------------------------------------------------------


// Function to update the bubble chart
function updateBubbleChart(selectedSubject) {
    // Fetch data for the selected subject from JSON data
    // Extract sample_values, otu_ids, and otu_labels for the selected subject
    const sample_values = selectedSubject.sample_values;
    const otu_ids = selectedSubject.otu_ids;
    const otu_labels = selectedSubject.otu_labels;

    // Data for the bubble-chart
    let data2 = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        text: otu_labels,
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: 'Viridis', 
        }
    }]
    // Display the chart in the "bubble-chart" container
    let bubbleChartLayout = {
        xaxis: {title: 'OTU IDs'},
        yaxis: {title: 'Sample Values'},
        margin: {
            t: 100,
            l: 80,
            r: 0,
            b: 60
        }
    };
    // Plotting the chart
    Plotly.newPlot('bubble', data2, bubbleChartLayout);
} 


// -------------------------------------------------------------------------------------------------


// Function to update the Demographic Info
function displayMetadata(meta_data) {
    
    let metadataContainer = d3.select('#sample-metadata');
    let Mdata = Object.entries(meta_data);

    // Clear any existing content in the metadata container
     metadataContainer.html('');

    // Displaying the content
    metadataContainer.selectAll('p').data(Mdata).enter().append('p').text(d => `${d[0]}: ${d[1]}`);
            
}


// -------------------------------------------------------------------------------------------------


// Function to update the gauge chart
function updateGaugeChart(meta_data) {
    // Data for the gauge chart
    let data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: meta_data.wfreq,
            title: { text: 'Srubs per Week', font: {size: 14}},
            type: 'indicator',
            mode: 'gauge+number',
            gauge: {
                axis: {
                    range: [null, 9],
                    tickmode: 'array',
                    tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                },
                bar: {color: "green"},
                steps: [
                    { range: [0, 1], color: 'rgb(248, 243, 236)' },
                    { range: [1, 2], color: 'rgb(233, 230, 211)' },
                    { range: [2, 3], color: 'rgb(229, 231, 212)' },
                    { range: [3, 4], color: 'rgb(213, 228, 197)' },
                    { range: [4, 5], color: 'rgb(183, 204, 146)' },
                    { range: [5, 6], color: 'rgb(138, 187, 108)' },
                    { range: [6, 7], color: 'rgb(128, 179, 97)' },
                    { range: [7, 8], color: 'rgb(123, 176, 93)' },
                    { range: [8, 9], color: 'rgb(121, 175, 91)' }
                ],
            },
        },
    ];

    let gaugeChartLayout = {
        title: { text: 'Belly Button Washing Frequency', font: { size:17, family: 'arial', weight: 'bold'} },
        margin: {
            l: 50,
            r: 50,
            b: 120,
            t: 50,
            pad: 0
        },
    };

    // Update the gauge chart with new data
    Plotly.newPlot('gauge', data, gaugeChartLayout);
}

// -------------------------------------------------------------------------------------------------


// Attach an event listener to the dropdown menu to trigger the updates
d3.select('#selDataset').on('change', optionChanged);


// -------------------------------------------------------------------------------------------------


// Function to update all plots and metadata when a new sample is selected
function optionChanged(){
    //Get the selected sample from the dropdown
    const selectedSample = d3.select('#selDataset').property('value');
    // updatePlotsAndMetadata(data.samples.find(item => item.id === Number(selectedSample)));
    d3.json(url).then(function(data){
        displayMetadata(data.metadata.find(item => item.id === Number(selectedSample)));
        updateBubbleChart(data.samples.find(item => item.id === selectedSample));
        updateBarChart(data.samples.find(item => item.id === selectedSample));
        updateGaugeChart(data.metadata.find(item => item.id === Number(selectedSample)));

    })
};


// -------------------------------------------------------------------------------------------------


// Function to dispaly inital data when website loads
function init(data){
    updateBarChart(data.samples[0]);
    updateBubbleChart(data.samples[0]);
    displayMetadata(data.metadata[0]);
    updateGaugeChart(data.metadata[0]);
};


d3.json(url).then(init);





