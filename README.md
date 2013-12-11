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

## API Documentation

<a href="http://bjoernruberg.github.io/DynamicTable/src/out/custom.dynamicTable.html">Goto JSDoc API documentation</a>

## Usage

DynamicTable uses the HTML-markup of a table element to display data. DynamicTable requires an array ob well-formed objects to work on. The data might look like this:

<pre>
[
	{ "id": 1, "name": "John Doe", "age": "30" },
	{ "id": 2, "name": "John Does", "age": "35" },
	{ "id": 3, "name": "John Depp", "age": "40" },
	{ "id": 4, "name": "John Doep", "age": "20" }
]
</pre>

Example usage of the DynamicTable
<pre>
&lt;table id=&quot;exampleTable&quot; width=&quot;90%&quot;&gt;
     &lt;thead&gt;
	&lt;tr&gt;
	    &lt;th data-index=&quot;id&quot; data-type=&quot;int&quot;&gt;Id&lt;/th&gt;
	    &lt;th data-index=&quot;name&quot;&gt;Name&lt;/th&gt;
	    &lt;th data-index=&quot;age&quot; data-preprocess=&quot;date&quot;&gt;Age&lt;/th&gt;
	&lt;/tr&gt;
     &lt;/thead&gt;
&lt;/table&gt;	
</pre>

<pre>
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
</pre>

## Column configuration in markup

This attributes can be used in a th tag to configure the column:
- data-index: Defines the index of the data item that is to be displayed in this column
- data-columnclass: CSS class to be added to each cell of this column
- data-columnstyle: CSS style rules to be applied to each cell of this column
- data-preprocess: Preprocessor to be used on all data in this column. It may be pre- or self-defined
