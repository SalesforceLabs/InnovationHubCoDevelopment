({
	doInit : function(component, event, helper) {
		//helper.loadPrototypes(component,helper);
		
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var searchFilters = component.get('v.searchFilters');
		var action = component.get('c.getPrototypes');
        
        action.setParams({
            "selectedFilter":"Popular",
            "searchFiltersJSON": '[{"filterName":"Type","selectedFilters":["Recent"]}]'
        });
        
        action.setCallback(this, function(response) {
            var prototypes = response.getReturnValue();
            component.set("v.prototypes", prototypes); 
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
        
        helper.loadCategories(component,helper);
        helper.loadWorkstreams(component,helper);
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
        helper.loadPrototypes(component,helper);
	}
})