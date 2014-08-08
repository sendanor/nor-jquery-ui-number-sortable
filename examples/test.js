/** Sortable implementation using floating point numbers
 * Designed to minimize the need to update multiple objects in the database to sort them.
 */

/* Test the code */
$(function() {

	$('#sortable').numberSortable({

		/** Set floating point value associated with `item` for ordering it */
		'setValue': function set_value(item, value) {
			$(item).text( value );
		},

		/** Get floating point value associated with `item` for ordering it */
		'getValue': function get_value(item) {
			return parseFloat( $(item).text() );
		}

	});

	$('#sortable').disableSelection();

});

/* EOF */
