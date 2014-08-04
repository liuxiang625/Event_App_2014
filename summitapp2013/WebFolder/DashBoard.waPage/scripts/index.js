
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button5 = {};	// @button
	var button6 = {};	// @button
	var button18 = {};	// @button
	var button17 = {};	// @button
	var dataGrid3 = {};	// @dataGrid
	var button10 = {};	// @button
	var button9 = {};	// @button
	var menuItem1 = {};	// @menuItem
	var menuItem2 = {};	// @menuItem
	var button8 = {};	// @button
	var button7 = {};	// @button
	var button1 = {};	// @button
	var documentEvent = {};	// @document
	var button3 = {};	// @button
	var button4 = {};	// @button
	var button2 = {};	// @button
	var dataGrid2 = {};	// @dataGrid
// @endregion// @endlock

// eventHandlers// @lock

	button5.click = function button5_click (event)// @startlock
	{// @endlock
		sources.presentaors.removeCurrent();
	};// @lock

	button6.click = function button6_click (event)// @startlock
	{// @endlock
		sources.presentaors.addNewElement();
		sources.presentaors.session.set(sources.session);
		sources.presentaors.save();
	};// @lock

	button18.click = function button18_click (event)// @startlock
	{// @endlock
		sources.speaker.removeCurrentReference({
	        onSuccess: function(event) {
	           $$('tabView2').selectTab(3);
	        }
    	});
	};// @lock

	button17.click = function button17_click (event)// @startlock
	{// @endlock
		sources.speaker.save({
	        onSuccess: function(event) {
	           $$('tabView2').selectTab(3);
	        }
    	});
	};// @lock

	dataGrid3.onRowDblClick = function dataGrid3_onRowDblClick (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(4);
	};// @lock

	button10.click = function button10_click (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(4);
	};// @lock

	button9.click = function button9_click (event)// @startlock
	{// @endlock
		sources.speaker.addNewElement();
		$$('tabView2').selectTab(4);
	};// @lock

	menuItem1.click = function menuItem1_click (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(1);
	};// @lock

	menuItem2.click = function menuItem2_click (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(3);
	};// @lock

	button8.click = function button8_click (event)// @startlock
	{// @endlock
		sources.presentaors.removeCurrent();
	};// @lock

	button7.click = function button7_click (event)// @startlock
	{// @endlock
		
		sources.presentaors.addNewElement();
		sources.presentaors.speaker.set(sources.speaker);
		sources.presentaors.save();
	};// @lock
	
	button1.click = function button1_click (event)// @startlock
	{// @endlock
		sources.session.addNewElement();
		$$('tabView2').selectTab(2);
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		$$('menuItem1').setState('active');
	};// @lock

	button3.click = function button3_click (event)// @startlock
	{// @endlock
		sources.session.save({
	        onSuccess: function(event) {
	           $$('tabView2').selectTab(1);
	        }
    	});
	};// @lock

	button4.click = function button4_click (event)// @startlock
	{// @endlock
		sources.session.removeCurrentReference({
	        onSuccess: function(event) {
	           $$('tabView2').selectTab(1);
	        }
    	});
	};// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(2);
	};// @lock

	dataGrid2.onRowDblClick = function dataGrid2_onRowDblClick (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(2);
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button5", "click", button5.click, "WAF");
	WAF.addListener("button6", "click", button6.click, "WAF");
	WAF.addListener("button18", "click", button18.click, "WAF");
	WAF.addListener("button17", "click", button17.click, "WAF");
	WAF.addListener("dataGrid3", "onRowDblClick", dataGrid3.onRowDblClick, "WAF");
	WAF.addListener("button10", "click", button10.click, "WAF");
	WAF.addListener("button9", "click", button9.click, "WAF");
	WAF.addListener("menuItem1", "click", menuItem1.click, "WAF");
	WAF.addListener("menuItem2", "click", menuItem2.click, "WAF");
	WAF.addListener("button8", "click", button8.click, "WAF");
	WAF.addListener("button7", "click", button7.click, "WAF");
	WAF.addListener("button1", "click", button1.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("button3", "click", button3.click, "WAF");
	WAF.addListener("button4", "click", button4.click, "WAF");
	WAF.addListener("button2", "click", button2.click, "WAF");
	WAF.addListener("dataGrid2", "onRowDblClick", dataGrid2.onRowDblClick, "WAF");
// @endregion
};// @endlock
