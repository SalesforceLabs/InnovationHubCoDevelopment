({
	doInit : function(component, event, helper) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)); //You get the whole decoded URL of the page.
        var sURLVariables = sPageURL.split('&'); //Split by & so that you get the key value pairs separately in a list
        var sParameterName;
        var i;
        
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('='); //to split the key from the value.
            
            if (sParameterName[0] === 'firstName') { //lets say you are looking for param name - firstName
                sParameterName[1] === undefined ? 'Not found' : sParameterName[1];
            }
        }
        
        if(sParameterName[1] != 'myEvents'){
            $A.util.removeClass(component.find('mySpinner'), "slds-hide");
            var searchFilters = component.get('v.searchFilters');
            var action = component.get('c.getCampaignes');
            
            action.setParams({
                "selectedFilter":"Popular",
                "searchFiltersJSON": '[{"filterName":"Type","selectedFilters":["All Events"]}]'
            });
            
            action.setCallback(this, function(response) {
                var events = response.getReturnValue();
                component.set("v.events", events); 
                $A.util.addClass(component.find('mySpinner'), "slds-hide");
            });
            
            $A.enqueueAction(action);
        }
        
        helper.loadLocations(component,helper);
        helper.loadSessionTypes(component,helper);
        
        if(component.get('v.FilterFieldName1') != null){
            helper.loadCustomPicklist_1(component,helper);
        }
        
        if(component.get('v.FilterFieldName2') != null){
            helper.loadCustomPicklist_2(component,helper);
        }
        if(component.get('v.FilterFieldName3') != null){
            helper.loadCustomPicklist_3(component,helper);
        }
	},
    
    filterChanged : function(component, event, helper) {
        var searchFilters =  event.getParam("filterList");
        component.set("v.searchFilters",searchFilters);
        helper.loadEvents(component,helper);
	}
})