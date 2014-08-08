/** Floating point number sortable implementation.
 * Designed to minimize the need to update multiple objects in the database to sort them.
 */
(function() {

/*global window */

var $     = (typeof require !== 'undefined') ? require('jquery')    : window && window.jQuery;
var debug = (typeof require !== 'undefined') ? require('nor-debug') : window && window.debug;
var Q     = (typeof require !== 'undefined') ? require('q')         : window && window.Q;

if(typeof $ === 'undefined') {
	throw new TypeError('jQuery required for numberSortable plugin!');
}

/** Find best number for ordering before `a` */
function find_best_before(a) {
	if(a === undefined) {
		throw new TypeError("Not possible to calculate if the value is undefined!");
	}

	return Math.ceil( a - 1 );
}

/** Find best number for ordering after `a` */
function find_best_after(a) {
	if(a === undefined) {
		throw new TypeError("Not possible to calculate if the value is undefined!");
	}

	return Math.floor( a + 1 );
}

/** Find best number for ordering between `a` and `b` */
function find_best_between(a, b) {

	if(a === undefined) {
		throw new TypeError("Not possible to calculate if first value is undefined!");
	}

	if(b === undefined) {
		throw new TypeError("Not possible to calculate if second value is undefined!");
	}

	if(a === b) {
		//console.log('a = ', a);
		//console.log('b = ', b);
		throw new TypeError("Not possible to find anything -- the numbers are equal!");
	}

	if(a > b) {
		return find_best_between(b, a);
	}

	var x, i = 1;

	do {
		//console.log('i =', i);

		if( (i < 1) || (i > 21) ) {
			break;
		}

		x = parseFloat( (a + (b - a) / 2).toPrecision(i) );
		//console.log('x =', x, ' of type ', typeof x);
		i += 1;
	} while(!( (a < x) && (x < b) ));

	if( (x === undefined) || (!( (a < x) && (x < b) )) ) {
		throw new TypeError("Failed to find value between " + a + " and " + b);
	}

	return x;
}

/** Find best numbers for ordering between `a` and `b` and return total of `c` numbers
 * @param a {number} The first value
 * @param b {number} The last value
 * @param c {number} The amount of numbers to return
 * @returns {array} Array of numbers for the range
 */
function find_best_range(a, b, c) {

	// Verify that we know the start of range
	if(a === undefined) {
		throw new TypeError("Not possible to calculate if start of range is undefined!");
	}

	// Verify not equal
	if(a === b) {
		//console.log('a = ', a);
		//console.log('b = ', b);
		throw new TypeError("Not possible to find anything -- the numbers are equal!");
	}

	// Reverse calculate the range... not sure if this is neccesary or even works correctly!
	if( (a !== undefined) && (b !== undefined) && (a > b) ) {
		return find_best_range(b, a, c).reverse();
	}

	// Calculate numbers for the range
	var results;
	var value_step;

	if(b === undefined) {
		results = [a+1];
		b = c;
		value_step = 1;
	} else {
		value_step = (b - a) / (2+c);
		results = [a+value_step];
	}

	//console.log('value_step = ', value_step);

	var i;
	for(i = 0; i !== c; i += 1) {
		results.push( a + (i+2)*value_step );
	}

	//console.log('results = ', results);

	return results;
}

/** jQuery (UI) sortable using external floating point based ordering */
$.fn.extend({
	'numberSortable': function number_sortable (opts) {
		var element = this;
		opts = opts || {};

		if(typeof debug !== 'undefined') {
			debug.assert(opts).is('object');
			debug.assert(opts.setValue).is('function');
			debug.assert(opts.getValue).is('function');
		}

		var set_value = opts.setValue.bind(undefined);
		var get_value = opts.getValue.bind(undefined);

		$( element ).sortable({
			stop: function( event, ui ) {
				var item = ui.item;
				var item_value = get_value.call( item );

				var prev = $(item).prev();
				var next = $(item).next();

				var prev_exists = prev.length !== 0;
				var next_exists = next.length !== 0;

				var prev_value = prev_exists ? get_value.call( prev ) : undefined;
				var next_value = next_exists ? get_value.call( next ) : undefined;

				//console.log('prev exists = ', prev_exists );
				//console.log('next exists = ', next_exists );

				//console.log('prev value = ', prev_value );
				//console.log('next value = ', next_value );

				var count = 0;

				// Loop until `prev_value` and `next_value` are not equal or the end is reached
				while (prev_value === next_value) {

					count += 1;

					next = $(next).next();
					next_exists = next.length !== 0;

					next_value = next_exists ? get_value.call( next ) : undefined;
	
					// Let's break if there's no more items
					if(!next_exists) {
						break;
					}
	
				}

				//console.log('count = ', count );
				//console.log('prev value = ', prev_value );
				//console.log('next value = ', next_value );
	
				// If we're at the begin of the list, we can just choose smaller number than next value.
				if( (!prev_exists) && next_exists ) {
					//console.log('solution 1');
					if(count !== 0) { throw new TypeError("count should never be anything but zero (0) at this point"); }
					set_value.call(item, find_best_before(next_value) );
					return;
				}

				// If direct adjacent items have a different value, we can simply select a number between these two values.
				if( prev_exists && next_exists && (count === 0) ) {
					//console.log('solution 2');
					set_value.call(item, find_best_between(prev_value, next_value) );
					return;
				}

				// If we're at the end of the list, we can just choose bigger number than prev value.
				if( prev_exists && (!next_exists) && (count === 0) ) {
					//console.log('solution 3');
					set_value.call(item, find_best_after(prev_value) );
					return;
				}

				// 
				//console.log('solution 4');

				if(!prev_exists) { throw new TypeError("prev should always exist at this point"); }
				if(count === 0) { throw new TypeError("count should never be zero (0) at this point"); }

				find_best_range(prev_value, next_exists ? next_value : undefined, count).forEach(function(value) {
					if(item_value !== value) {
						set_value.call(item, value );
					}
					item = $(item).next();
					item_value = get_value.call( item );
				});

			}
		});

	}
});

// Common JS exports
if(typeof module !== 'undefined') {
	module.exports = $.fn.numberSortable;
}

}());
/* EOF */
