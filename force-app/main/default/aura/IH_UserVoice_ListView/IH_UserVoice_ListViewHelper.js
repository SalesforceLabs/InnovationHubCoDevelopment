({
    loadUserVoices : function(component, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var searchFilters = component.get('v.searchFilters');
        var action = component.get('c.getUserVoices');
        
        action.setParams({
            "selectedFilter":"Popular",
            "searchFiltersJSON":JSON.stringify(searchFilters)
        });
        
        action.setCallback(this, function(response) {
            var userVoices = response.getReturnValue();
            component.set("v.userVoices", userVoices); 
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);       
    },
    
    loadCategories : function(component, helper) {
        
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.getPicklistValues');
        
        action.setParams({
            "picklistAPIName" : "innohub__Workstream__c"
        });
        
        action.setCallback(this, function(response) {
            component.set("v.categories", response.getReturnValue());
            
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
    },
    
    //Custom picklist
    loadCustomPicklist_1 : function(component, helper) {
        
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.getPicklistValues');
        
        action.setParams({
            "picklistAPIName" : component.get('v.FilterFieldName1')
        });
        
        action.setCallback(this, function(response) {
            component.set("v.customList_1", response.getReturnValue());
            
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
    },
    
    //Custom picklist 2
    loadCustomPicklist_2 : function(component, helper) {
        
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.getPicklistValues');
        
        action.setParams({
            "picklistAPIName" : component.get('v.FilterFieldName2')
        });
        
        action.setCallback(this, function(response) {
            component.set("v.customList_2", response.getReturnValue());
            
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
    },
    //Custom picklist 3
    loadCustomPicklist_3 : function(component, helper) {
        
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.getPicklistValues');
        
        action.setParams({
            "picklistAPIName" : component.get('v.FilterFieldName3')
        });
        
        action.setCallback(this, function(response) {
            component.set("v.customList_3", response.getReturnValue());
            
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
    }
})