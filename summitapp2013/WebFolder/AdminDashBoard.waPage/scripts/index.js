
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var menuItem5 = {};	// @menuItem
	var menuItem4 = {};	// @menuItem
// @endregion// @endlock

// eventHandlers// @lock

	menuItem5.click = function menuItem5_click (event)// @startlock
	{// @endlock
		$$('tabView1').selectTab(2);
	};// @lock

	menuItem4.click = function menuItem4_click (event)// @startlock
	{// @endlock
		$$('tabView1').selectTab(1);
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("menuItem5", "click", menuItem5.click, "WAF");
	WAF.addListener("menuItem4", "click", menuItem4.click, "WAF");
// @endregion
};// @endlock
