nor-jquery-ui-number-sortable
=============================

Floating point based sortable implementation as a jQuery UI module

See live example [test.html](http://sendanor.github.io/nor-jquery-ui-number-sortable/examples/test.html).

Usage:

```
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
```
