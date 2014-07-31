WAF.define('Test', ['waf-core/widget'], function(widget) {
	
    var Test = widget.create('Test', {
        init: function() {
        	debugger;
//            /* Define a custom event */
//            this.fire('myEvent', {
//                message: 'Hello'
//            });
        }
//        ,
        
//        /* Create a property */
//        test: widget.property({
//            onChange: function(newValue) {
//                this.node.innerHTML = this.test(); /* this contains the widget and newValue contains its current value */
//            }
//        })
    });
	
//	Test.addProperty('value',{
//		type: "datasource",
//		attributes: [{
//			name:'A'
//		},{
//			name:'B'
//		}]
//	
//	});
	Test.addProperty('test',{
		bindable:false,
		onChange:function(newValue) {
			debugger;
		}
	});
//    /* Map the custom event above to the DOM click event */
//    Test.mapDomEvents({
//        'click': 'action'
//    });

    return Test;

});

/* For more information, refer to http://doc.wakanda.org/Wakanda0.DevBranch/help/Title/en/page3871.html */