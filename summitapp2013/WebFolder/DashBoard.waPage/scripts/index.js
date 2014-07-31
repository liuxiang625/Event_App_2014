
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
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

	button8.click = function button8_click (event)// @startlock
	{// @endlock
		var newPresenter = sources.session.presentaors.addNewElement();
		newPresenter.speaker = sources.speaker;
		newPresenter.save();
	};// @lock

	button7.click = function button7_click (event)// @startlock
	{// @endlock
		var ID = sources.session.presentaors.ID;
		sources.presentation.find({
			onSuccess: function(event) {
	           $$('tabView2').selectTab(1);
	        }
		});
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
