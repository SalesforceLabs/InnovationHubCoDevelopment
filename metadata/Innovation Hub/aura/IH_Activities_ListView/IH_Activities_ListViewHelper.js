({
    loadActivities : function(component, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var searchFilters = component.get('v.searchFilters')
        
        var action = component.get('c.getActivities');
        
        action.setParams({
            "selectedFilter":"Popular",
            "searchFiltersJSON":JSON.stringify(searchFilters)
        });
        action.setCallback(this, function(response) {
            var activities = response.getReturnValue();
            component.set("v.activities", activities); 
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);        
    },
    
    loadTypes : function(component, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.getTypes');
        
        action.setCallback(this, function(response) {
            var types = response.getReturnValue();
            component.set("v.types",types);
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
    },
    
    loadBU : function(component, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.getPicklistValues');
        
        action.setParams({
            "picklistAPIName" : "innohub__BU__c"  
        });
        
        action.setCallback(this, function(response) {
            component.set("v.bu",response.getReturnValue());
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