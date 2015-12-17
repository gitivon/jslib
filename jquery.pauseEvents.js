<!DOCTYPE html>
<html>
<head>
	<title>Pause Event</title>
	<script src="http://libs.baidu.com/jquery/1.9.1/jquery.min.js"></script>
<script>
$(function(){

	$.confirm = function(text){
		var dfd = $.Deferred();
		if(confirm(text)){
			dfd.resolve();
		}else{
			dfd.reject();
		}
		return dfd.promise();
	}


	$.fn.unshiftEvent = function(event, foo) {
		var self = this,
			_type = event.split('.')[0];
		$.each(self, function() {
			var events = $._data(this, 'events');
			$.event.add(this, event, foo, self.selector);
			events && _type in events && events[_type].unshift(Array.prototype.pop.call(events[_type]));
		})
		return this;
	};

	$.fn.pauseEvents = function(event, promiseFn, namespace) {
		var namespace = namespace || 'pauseEvents',
			_type = event.split('.')[0];
		this.unshiftEvent(event + '.' + namespace, function(e) {
			e.stopImmediatePropagation();
			var args = arguments,
				self = this;
			promiseFn.apply(this, args).then(function() {
				$.each($._data(self, 'events')[_type], function(key, e) {
					if (('handler' in e) && e.namespace !== namespace) {
						e.handler.apply(self, args);
					}
				});
			});
		});
	}


	$("button").on('click',function(e){
		console.log(this)
	});

	$("[confirm]").pauseEvents('click',function(){
		var text = $(this).attr('confirm');
		return $.confirm(text)
	})


});
</script>
</head>
<body>
	<button confirm="确定?">button</button>
	<button confirm="Are you 确定?">button</button>
</body>
</html>