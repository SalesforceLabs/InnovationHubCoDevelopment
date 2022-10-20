({
	doInit : function(component, event, helper) {
		helper.loadActivities(component,helper);
        helper.loadTypes(component,helper);
        helper.loadBU(component,helper);
        
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
        helper.loadActivities(component,helper);
	}
})