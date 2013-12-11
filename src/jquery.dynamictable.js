/**                                                                                                                                                                                           
 * @fileOverview                                                                                                                                                                               
 * @version 0.1                                                                                                                                                                                                                                                                                                                                                              
 * @namespace custom.dynamicTable                                                                                                                                                        
 */     

(function ( $ ) 
{
 /**
   * The JQuery DynamicTable is a Jquery UI widget which provides an interactive table for viewing data.
   * It provides important functions for working with data like sorting, filtering and paging.
   *
   * @class DynamicTable
   * @version 0.1
   * @author Björn Ruberg <bjoern@ruberg-wegener.de>
   */

	$.widget( "custom.dynamicTable", 
	{
		
		options: {
			/**  
			* @name custom.dynamicTable#actions                                                                                                                                                
			* @description Object defined custom actions that can be selected by each field. Default is empty                                                                                                                                              
			* @type {object}
			*/     
			actions			: [], 
		   
			/**
			 * @name custom.dynamicTable#clickable
			 * @description Conigures whether a row in the table is clickable. Default is false.                                                                                                                                            
			 * @type {boolean}
			 */
			clickable		: false,
		   
			/**
			 * @name custom.dynamicTable#columnStyles
			 * @description List of styles that is used in its given order repeatedly for styling rows of the table                                                                                                                                       
			 * @type {object}
			 */
			columnStyles	: [ {'background-color': '#F1F1F0'}, {'background-color': '#FAFAF9'} ],
		   
			/**
			 * @name custom.dynamicTable#filterIndex
			 * @description List of object indicies that should be looked through when filtering column content. Default is none, which means all items of the data object are used.                                                                                                                         
			 * @type {array}
			 */
			filterIndex		: null, // list of fields to search in 
		   
			/**
			 * @name custom.dynamicTable#fixHeight
			 * @description Configures whether the Table should grow in height with the number of items provided in the dataset or whether it should keep a fixedHeight. Default is true.                                                                                                                        
			 * @type {Boolean}
			 */
			fixHeight		: true, // should the table be in a fixed height or grow with the amount of items displayed?
	
			/**
			 * @name custom.dynamicTable#headline
			 * @description Give a headline for the table. Default is none.                                                                                                                       
			 * @type {String}
			 */
			headline		: null, // title of the table
		   
			/**
			 * @name custom.dynamicTable#hover
			 * @description Configures whether there is a hover effect                                                                                           
			 * @type {Boolean}
			 */
			hover			: true, // hovereffect?
		   
			/**
			 * @name custom.dynamicTable#onclick
			 * @description Callback function to be used when a row is clicked. Its binded to an jquery event                                                                                       
			 * @type {function}
			 */
			onclick			: null, // callback on click on a row
		   
			/**
			 * @name custom.dynamicTable#onrender
			 * @description Callback function to be used when the table is rendered                                                                                      
			 * @type {function}
			 */
			onrender		: function(){},
			  
			/**
			 * @name custom.dynamicTable#page
			 * @description Page to show. Default is 1.                                                                                    
			 * @type {integer}
			 */
			page			: 1, 	// page to display
		   
			/**
			 * @name custom.dynamicTable#perPageOptions
			 * @description List of options that are shown in the "itemsPerPage" select. Defaults to [ 10, 20, 50, 100 ]                                                                             
			 * @type {array}
			 */
			perPageOptions	: [ 10, 20, 50, 100 ],  
		   
			/**
			 * @name custom.dynamicTable#plain
			 * @description Activate a plain mode without a table header. Default is false.                                                                    
			 * @type {Boolean}
			 */
			plain			: false, // plain mode 
		   
			/**
			 * @name custom.dynamicTable#preprocessors
			 * @description List of user defined preprocessors for table cell data                                                                             
			 * @type {array}
			 */
			preprocessors	: {},

			/**
			 * @name custom.dynamicTable#rowIndex
			 * @description Index of the data object that should be used as a special row index for special use cases. Default is null.                                                       
			 * @type {String}
			 */
			rowIndex		: null, // field that will be put in the data-index for each row

			/**
			 * @name custom.dynamicTable#searchTerm
			 * @description Search term to filter the data from the start. Default is none.                                                       
			 * @type {String}
			 */
			searchTerm		: '', // default search term
		   
			/**
			 * @name custom.dynamicTable#sortDirection
			 * @description Configures whether sort direction is 'asc' or 'desc'. Default is 'asc'.                                                        
			 * @type {String}
			 */
			sortDirection	: 'asc',

			/**
			 * @name custom.dynamicTable#sortIndex
			 * @description Defines the column after which the data is to be sorted. Default is null which means the data is displayed as provided by the source.                                                     
			 * @type {String}
			 */
			sortIndex		: null, /* do not sort by default */

			/**
			 * @name custom.dynamicTable#source
			 * @description Function which fetches data from source and provide it to the success function as a parameter.                                                       
			 * @type {function}
			 */
			source			: function( success )
			{
				  // without source, nothing will work
			}
	    },
	    _create: function() {
	    	/* build up the UI */
			
	    	var that			= this;
			var columnMap 		= [];
			var tableHeadline 	= $( 'th', $( 'thead', this.element ) );
			var	settings		= this.options;
			
			if( this.options.plain )
			{
				this.options.perPageOptions = [ 999999 ];
			}
			settings.elementsPerPage = settings.perPageOptions[0] ? settings.perPageOptions[0] : 10;
			
			tableHeadline.each( function() 
			{
				var th = $( this );
				columnMap.push( 
				{
					action		: th.data( 'action' ),
					field		: th.data( 'index' ),
					icon		: th.data( 'icon' ),
					preprocess	: th.data( 'preprocess' ),
					style		: th.data( 'columnstyle' ),
					columnclass	: th.data( 'columnclass' )
				} );
				
				th.click( function() 
				{ 
					$( '.dynamicTable_sortIndicator', tableHeadline ).removeClass('ui-icon ui-icon-carat-1-n ui-icon-carat-1-s');
					var column = $( this ).data( 'index' ); 
					
					if( that.options.sortIndex == column )
					{
						// change sort direction
						if( that.options.sortDirection == 'asc' )
						{
							that.options.sortDirection = 'desc';
							$( '.dynamicTable_sortIndicator', this ).addClass('ui-icon ui-icon-carat-1-n');
						}
						else
						{
							that.options.sortDirection = 'asc';
							$( '.dynamicTable_sortIndicator', this ).addClass('ui-icon ui-icon-carat-1-s');
						}
					}
					else
					{
						that.options.sortIndex = column;
						if( that.options.sortDirection == 'desc' )
						{
							$( '.dynamicTable_sortIndicator', this ).addClass('ui-icon ui-icon-carat-1-n');
						}
						else
						{
							$( '.dynamicTable_sortIndicator', this ).addClass('ui-icon ui-icon-carat-1-s');
						}
					}
					
					that.refresh( );
				} );
				
				th.append( '<span class="dynamicTable_sortIndicator" />' );
			} );
			
			this.columns 	= columnMap;
					
			var container 	= $( '<div class="dynamicTable_container" />' );
			container.attr( 'id', this.element.attr( 'id' ) );
			container.width( this.element.width() );
			
			this.container	= container;
			
			if( !this.options.plain )
			{
				this.header		= $('<div class="dynamicTable_header" />').appendTo( container );
				
				if( this.options.headline )
				{
					$('<h2>'+this.options.headline+'</h2>').appendTo( this.header );
				}
				
				$('<span class="controlButton"></span>').button( { icons: { primary: 'ui-icon-refresh' }, text: false } ).appendTo( this.header ).click( function()
				{
					that.reload();
					return false;
				});
				
				var perPage	= $('<select class="dynamicTable_perPage ui-button ui-widget ui-state-default ui-corner-all"></select>').appendTo( this.header );
				$.each( settings.perPageOptions, function( index, element )
				{
					$('<option value="'+element+'">'+element+'</option>').appendTo( perPage );
				});
				
				perPage.change( function() 
				{
					settings.elementsPerPage = $(this).val();
					that.refresh();
				} );
				
				var search = $('<input type="text" class="dynamicTable_search ui-widget-content ui-state-default ui-corner-all" />').appendTo( $('<div style="float: right;"></div>').appendTo( this.header ) );
				search.css( 'width', '100%' );
				search.keyup( function() 
				{ 
					settings.searchTerm = $(this).val().toLowerCase();
					that.refresh( ); 
				} );
			}
			
			this.table			= $('<table class="dynamicTable_table" />').appendTo( container )
			this.tableHeader 	= $( '<thead class="dynamicTable_table_head" />' ).append( tableHeadline ).appendTo( this.table );
			this.tableBody		= $( '<tbody class="dynamicTable_table_body" />' ).appendTo( this.table );
			
			var tableFooter	= $( 'tfoot', this.element );
			if( tableFooter.length > 0 )
			{
				tableFooter.addClass( 'dynamicTable_table_foot' );
				this.tableFooter = $( tableFooter ).appendTo( this.table );
			}
			
			if( !this.options.plain )
			{
				this.footer			= $('<div class="dynamicTable_footer" />').appendTo( container );
				
				$('<span class="controlButton"></span>').button( { icons: { primary: 'ui-icon-refresh' }, text: false } ).appendTo( this.footer ).click( function()
				{
					that.reload();
					return false;
				});
				$('<div class="dynamicTable_listSum"></div>').appendTo( this.footer );
				$('<div class="dynamicTable_pageButtons"></div>').appendTo( this.footer );
				
				container.on( 'click', '.dynamicTable_pageButton', function()
				{
					settings.page = $(this).val();
					that.refresh();
				});
			}
			
			this.element.replaceWith( container );
			container.data( 'custom-dynamicTable', this );
			settings.source( $.proxy( this._updated, this ) );
			
	    },
		
		/**                                                                                                                                                                                   
         * @name custom.dynamicTable#_filter
         * @function
		 * @private
         * @description returns the data of the table filtered according to term
		 * @returns List of filtered data rows
		 * @param { String } term - Term for which the data has to be filtered                                                                                                                                      
         */ 
	    _filter	: function( term )
		{
			var data 			= this.data;
			var	that			= this;
			var filtered		= [];
			term 				= term ? term : this.options.searchTerm; 
			
			$.each( data, function( index, element )
        	{
				var success		= false;
        		$.each( that.columns, function( i, column ) 
        		{
        			if( new String(element[column.field]).toLowerCase().indexOf( term ) >= 0 )
        			{
        				success = true;
        			}
        		} );
        		
        		if( success )
        		{
        			filtered.push( element );
        		}
        	});
			
			return filtered;
		},
		
		/**                                                                                                                                                                                   
         * @name custom.dynamicTable#getData
         * @function
         * @description returns the array of all data that is loaded into the table                                                                                                                                                   
         */  
		getData: function()
		{
			return this.data;
		},
		/**                                                                                                                                                                                   
         * @name custom.dynamicTable#_preprocess
         * @function
         * @description Returns the preprocessed version of a given datum for being written into a cell   
		 * @private    
		 * @param { Object } datum - represents the raw datum that is to be written into the cell     
		 * @param { String } preprocessor - name of the preprocessor that is to be used on the datum
		 * @param { Object } obj - the whole object containing the data for this row - which the datum is part of                                                                                                                       
         */
        _preprocess: function( datum, preprocessor, obj )
        {
        	var dataTable = this;
			
			// first try the user defined preprocessors
        	
        	if( typeof preprocessor == 'string' && this.options.preprocessors[preprocessor] )
        	{
        		return this.options.preprocessors[preprocessor]( datum, obj );
        	}
        	
        	// try built-in preprocessors
        	
        	switch( preprocessor )
        	{
        		case 'attention':
        			if( parseInt(datum) > 0 )
        			{
        				return $( '<span title="attention" class="ui-icon ui-icon-notice"></span>' );
        			}
        			else
        			{
        				return $( '<span></span>' );
        			}
        			break;
        		case 'check':
        			if( parseInt(datum) > 0 )
        			{
        				return $( '<span class="ui-icon ui-icon-check"></span>' );
        			}
        			else
        			{
        				return $( '<span class="ui-icon ui-icon-minus"></span>' );
        			}
        			break;
        		case 'date':
        			var date = new Date( datum );
        			if( !isNaN( date.getDay() ) ) // firefox problem
        				return $.datepicker.formatDate( 'dd.mm.', date );
        			else
        				return datum;
        			break;
        		case 'euro':
        			if( datum )
        			{ 
        				return formatMoney( datum ) + ' €';
        			}
        			else
        			{
        				return datum;
        			}
        			break;
        			
        		case 'euroRounded':
        			if( datum )
        			{ 
        				return number_format( datum, 0, ',' ) + ' €';
        			}
        			else
        			{
        				return datum;
        			}
        			break;

        		case 'float':
        			return number_format( datum, 2, ',' );
        			break;
        			
        		case 'percent':
        			return number_format( datum, 2, ',' ) + '%';
        			break;
        			
        		case 'percentRounded':
        			return number_format( datum, 0, ',' ) + '%';
        			break;
        			
        		case 'switch':
        			var radioGroup 	= 'buttonset' + Math.ceil( Math.random() * 10000 );
        			return $( '<div>'+
        				'<input type="radio" id="'+(radioGroup + 1)+'" name="'+radioGroup+'" '+ ( datum == '1' ? 'checked="checked"' : '' ) +' value="1" /><label for="'+(radioGroup + 1)+'">On</label>'+
        				'<input type="radio" id="'+(radioGroup + 2)+'" name="'+radioGroup+'" '+ ( datum == '0' ? 'checked="checked"' : '' ) +' value="0" /><label for="'+(radioGroup + 2)+'">Off</label>'+
        				'</div>' )
        				.buttonset();
        			
        			break;
        			
        		default:
        			return datum;
        	}
        },
		
		/**                                                                                                                                                                                   
		 * @name custom.dynamicTable#refresh
         * @function
         * @description refreshes the table with data array provided. The data is filtered and sorted according to the current configuration
		 * @param { Array } data - The data array that is to be shown in the table                                                                                                                                                   
		 */  
        refresh : function( data )
        { 
        	var page 			= this.options.page;
        	var elementsPerPage = this.options.elementsPerPage;
        	var data			= data ? data : this.data;
        	data				= this._filter( );
        	data				= this._sort( data );
        	this._render( data.slice( (page - 1) * elementsPerPage, page * elementsPerPage ) );
        },
		
		/**                                                                                                                                                                                   
		 * @name custom.dynamicTable#reload
         * @function
         * @description Triggers a reload of the table. It will call the source again and refreshes its data from there                                                                                                                            
		 */  
        reload	: function( )
        {
        	this.options.source( $.proxy( this._updated, this ) );
        },
		
		/**                                                                                                                                                                                   
         * @name custom.dynamicTable#_render
         * @function
         * @description Rerenders the table. The given data is used as it is whith no further processing
		 * @private    
		 * @param { Array } elements - list of data items that are to be rendered                                                                                                                   
         */
        _render	: function( elements )
        {
			
			/*
			 * The scrolling code is to prevent scrollbars from jumping during the reload of the table
			 */
			
        	var that			= this;
        	var dataTable 		= this.tableBody;
        	var dataTableNode	= this.table;
        	var columnStyles	= this.options.columnStyles;
        	var scrollTopBackup = dataTable.scrollTop();
        	
//        	dataTable.css( 'height', dataTable.height() ); // avoid scrolling around in the surrounding container
        	dataTableNode.css( 'height', dataTableNode.height() );
        	var completeHeight 	= dataTable.height();

        	dataTable.empty();
        	var height 			= 20;
        	
        	$.each( elements, function( index, element )
        	{
        		var tr = $( '<tr  />' );
        		tr.css( columnStyles[ index % columnStyles.length ] );
        		
        		if( that.options.clickable )
        		{
        			tr.click( function() { $(this).toggleClass( 'clicked' ); } );
        		}
        		
        		$.each( that.columns, function( i, column ) 
        		{
        			var content = element[column.field];
        			content 	= that._preprocess( content, column.preprocess, element );
        			var cell 	= null;
        			
        			if( column.action )
        			{
        				cell = $( '<td style="' + (column.style ? column.style : '' ) + '"></td>' ).appendTo( tr );
        				var action 	= that.options.actions[column.action];
        				var button 	= $( '<button value="'+content+'"></button>' ).append(action.label).button( );
        				if( column.icon )
        				{
        					button.button( "option", "icons", { primary: column.icon } );
        					button.button( "option", "text", false );
        				}
        				
        				button.click( action.click ).appendTo( cell );
        			}
        			else
        			{
        				cell = $( '<td style="' + (column.style ? column.style : '' ) + '"></td>' ).append( content ).appendTo( tr );
        			}
        			
        			if( column.columnclass )
        			{
        				cell.addClass( column.columnclass );
        			}
        		} );
        		
        		if( that.options.rowIndex )
        		{
        			tr.data( 'index', element[that.options.rowIndex] );
        		}
        		
        		if( that.options.hover )
        		{
        			tr.addClass( 'dynamicTable_table_hoverable' );
        		}
        		
        		if( that.options.onclick )
        		{
        			tr.addClass( 'dynamicTable_table_hoverable' );
        			tr.click( that.options.onclick );
        		}
        		
        		tr.appendTo( dataTable );
        	});
        	
        	
        	if( this.options.fixHeight )
        	{
	        	var toAdd = this.options.elementsPerPage - elements.length;
	        	for( var i = 0; i < toAdd; i++ )
	        	{
	        		var tr = $('<tr  />').appendTo( dataTable ).append( '<td class="dynamicTable_emptyRow" colspan="100">...</td>' );
	        		tr.height( height );
	        	}
        	}
        	
        	if( this.tableFooter )
        	{
        		$( 'td', this.tableFooter ).each( function( index, element )
        		{
        			var sumIndex = $(element).data( 'sumindex' );
        			if( sumIndex )
        			{
        				var total = 0.0;
        				$.each( elements, function( index, element )
        			    {
        					total += parseFloat( element[sumIndex] );
        			    } );
        				
        				$(element).empty()
        					.append( that._preprocess( total, $(element).data('preprocess') ) );
        			}
        		}
        		);
        	}
        	
        	dataTable.scrollTop( scrollTopBackup );
        	dataTable.css( 'height', 'auto' );
        	dataTableNode.css( 'height', 'auto' );
        	
        	$( 'tr', dataTable ).height( $( 'tr', dataTable ) / $( 'tr', dataTable ).length );
        	
        	$.proxy( that.options.onrender, this )();
        },
		
		/**                                                                                                                                                                                   
		 * @name custom.dynamicTable#selected
         * @function
         * @description Returns the indicies of all selected rows of the table. The table has to be configured to be clickable and there must be a valid rowIndex set                                                                                                           
		 */  
        selected: function( )
        {
        	return $( '.clicked', this.tableBody ).map( function() { return $( this ).data( 'index' ); } ).toArray();
        },
		
		/**                                                                                                                                                                                   
		 * @name custom.dynamicTable#setData
         * @function
         * @description Set a list of data to be displayed without using the source. Triggers a complete refresh of the widget including the headers and footers                                                                                                          
		 */ 
        setData	: function( data )
        {
        	this._updated( data );
        },
		
        /**                                                                                                                                                                                   
         * @name custom.dynamicTable#_sort
         * @function
         * @description Returns the sorted data of the table according the current configuration
		 * @private    
		 * @param { Array } data - the list of data to be sorted
		 * @returns { Array } the sorted data                                                                                                               
         */
        _sort	: function( data )
        {
        	var sortIndex 		= this.options.sortIndex;
        	var sortDirection 	= this.options.sortDirection;
        	
        	if( sortIndex )
        	{
        		data.sort( function( a, b )
        		{
        			field_a = a[sortIndex];
        			field_b = b[sortIndex];
        			
        			// for dates
        			field_a = field_a && field_a.replace ? field_a.replace( /-/g , "" ).replace( /:/, "" ).replace( / /g, "" ) : null;
        			field_b = field_b && field_b.replace ? field_b.replace( /-/g , "" ).replace( /:/, "" ).replace( / /g, "" ) : null;
        			
        			if( parseFloat(field_a) && parseFloat(field_b) )
        			{
        				af = parseFloat(field_a);
        				bf = parseFloat(field_b);
        			}
        			else
        			{
        				af = a[sortIndex];
        				bf = b[sortIndex];
        			}
        			if( sortDirection == 'asc' )
        			{
        				return af > bf ? 1 : -1 ;
        			}
        			else
        			{
        				return af > bf ? -1 : 1 ;
        			}
        		} );
        		return data;
        	}
        	else
        	{
        		return data;
        	}
        },
        
		/**                                                                                                                                                                                   
         * @name custom.dynamicTable#_update
         * @function
         * @description Triggers the complete redraw of the widget
		 * @private    
		 * @param { Array } data - the list of data to be used in the table                                                                                                               
         */
        _update	: function( data )
        {
        	this.refresh( data );
        	
        	
        	if( !this.options.plain )
        	{
        		$('.dynamicTable_listSum', this.footer).text( 'Total: ' + data.length );

	        	/*
	        	 * Draw the page buttons at the bottom
	        	 */
	        	var pages 		= Math.ceil( data.length / this.options.elementsPerPage );
	        	var x			= 1;
	        	var	buttons		= $('.dynamicTable_pageButtons', this.footer);
	        	var radioGroup 	= Math.ceil( Math.random() * 10000 );
	        	buttons.empty();
	        	
	        	var availableWidth = buttons.width();
	        	if( pages * 40 < availableWidth )
	        	{
	        		// use space requiring button list
		        	while( x <= pages )
		        	{
		        		var radio = $('<input type="radio" id="page_radio'+radioGroup+''+x+'" value="'+x+'" class="dynamicTable_pageButton" name="dynamicTable_pageButtons'+radioGroup+'" />').appendTo( buttons );
		        		if( x == this.page )
		        		{
		        			radio.attr( 'checked', 'checked' );
		        		}
		        		
		        		$('<label for="page_radio'+radioGroup+''+x+'">'+x+'</label>').appendTo( buttons );
		        		x++;
		        	}
		        	buttons.buttonset();
	        	}
	        	else
	        	{	
	        		buttons.append( 'Page:' );
	        		var select = $( '<select class="dynamicTable_pageButton"></select>' ).appendTo( buttons );
	        		while( x <= pages )
		        	{
	        			$('<option value="'+x+'">'+x+'</option>').appendTo( select );
		        		x++;
		        	}
	        	}
        	}
        },
		
        _updated	: function( data )
        {
        	this.data	= data;
        	this._update( data );
        }
	});
}( jQuery ));