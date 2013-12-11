DynamicTable
============

The JQuery DynamicTable is a Jquery UI widget which provides an interactive table for viewing data.
It provides important functions for working with data like sorting, filtering and paging.

### Requirements

- JQuery 1.8+ (earlier version might work)
- JQuery UI 1.10 Core (earlier versions might work)
- JQuery UI 1.10 Button  (earlier versions might work)

### Features

DynamicTable provides generic features for displaying data in the browser. Just load a flat list of data into the table. The DynamicTable allows the user to work with the data as he likes without any additional client or server-side code. All work is than in this plugin.

- Fetch data von self-defined sources
- Display data in a pre-defined layout
- Sort the data by clicking on the column header
- Page 
- Filter rows by text input terms
- Preprocess the raw data before displaying it in the output
- Various hooks to enable interaction with the provided data. 

## Usage

DynamicTable uses the HTML-markup of a table element to display data. DynamicTable requires an array ob well-formed objects to work on. The data might look like this:

### Example Data
[
		{ "id": 1, "name": "John Doe", "age": "30" },
		{ "id": 2, "name": "John Does", "age": "35" },
		{ "id": 3, "name": "John Depp", "age": "40" },
		{ "id": 4, "name": "John Doep", "age": "20" }
]

### Example Markup
<table id="exampleTable" width="90%">
	<thead>
		<tr>
			<th data-index="id" data-type="int">Id</th>
			<th data-index="name">Name</th>
			<th data-index="age" data-preprocess="date">Age</th>
		</tr>
	</thead>
</table>	

### Example DynamicTable initialization

$("#exampleTable").dynamicTable( {
	source: function( success )
	{
		success( [
			{ "id": 1, "name": "John Doe", "age": "30" },
			{ "id": 2, "name": "John Does", "age": "35" },
			{ "id": 3, "name": "John Depp", "age": "40" },
			{ "id": 4, "name": "John Doep", "age": "20" }
		] );
	}
} );
