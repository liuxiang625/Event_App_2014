
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button2 = {};	// @button
	var dataGrid2 = {};	// @dataGrid
// @endregion// @endlock

// eventHandlers// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(2);
	};// @lock

	dataGrid2.onRowDblClick = function dataGrid2_onRowDblClick (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(2);
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button2", "click", button2.click, "WAF");
	WAF.addListener("dataGrid2", "onRowDblClick", dataGrid2.onRowDblClick, "WAF");
// @endregion
};// @endlock
