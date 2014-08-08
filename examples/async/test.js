/** Sortable implementation using floating point numbers
 * Designed to minimize the need to update multiple objects in the database to sort them.
 */

function wait(f) {
	var defer = Q.defer();
	setTimeout(function() {
		try {
			defer.resolve( f() );
		} catch(err) {
			defer.reject(err);
		}
	}, 300);
	return defer.promise;
}


/* Test the code */
$(function() {

	$('#sortable').numberSortable({

		/** Set floating point value associated with `item` for ordering it */
		'setValue': function set_value(value) {
			var self = this;
			return wait(function() {
				return $(self).text( value );
			});
		},

		/** Get floating point value associated with `item` for ordering it */
		'getValue': function get_value() {
			return parseFloat( $(this).text() );
		}

	});

	$('#sortable').disableSelection();

});

/* EOF */
