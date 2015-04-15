nor-jquery-ui-number-sortable
=============================

Floating point based sortable implementation as a jQuery UI module

See live example [test.html](http://sendanor.github.io/nor-jquery-ui-number-sortable/examples/sync/test.html).

Usage:

```
$('#sortable').numberSortable({

	/** Set floating point value associated with `item` for ordering it. You also may return a promise from this function. */
	'setValue': function set_value(value) {
		$(this).text( value );
	},

	/** Get floating point value associated with `item` for ordering it */
	'getValue': function get_value() {
		return parseFloat( $(this).text() );
	}

});
```

Commercial Support
------------------

You can buy commercial support from [Sendanor](http://sendanor.com/software).
