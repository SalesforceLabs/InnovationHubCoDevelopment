({
    doInit : function(component, event, helper) {
        helper.loadCategories(component,helper);
        //helper.loadUserVoices(component,helper);
        
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var searchFilters = component.get('v.searchFilters');
        var action = component.get('c.getUserVoices');
        
        action.setParams({
            "selectedFilter":"Popular",
            "searchFiltersJSON": '[{"filterName":"Type","selectedFilters":["All"]}]'
        });
        
        action.setCallback(this, function(response) {
            var userVoices = response.getReturnValue();
            component.set("v.userVoices", userVoices); 
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);  
        

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
        helper.loadUserVoices(component,helper);
    }
})