({
    loadEvents : function(component, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var searchFilters = component.get('v.searchFilters');
        var action = component.get('c.getCampaignes');
        
        action.setParams({
            "selectedFilter":"Popular",
            "searchFiltersJSON":JSON.stringify(searchFilters)
        });
        
        action.setCallback(this, function(response) {
            var events = response.getReturnValue();
            component.set("v.events", events); 
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
    },
    
    loadLocations : function(component, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.getPicklistValues');
      
        action.setParams({
            "picklistAPIName" : "innohub__Location__c"  
        });
        
        action.setCallback(this, function(response) {
            
            component.set("v.countries",response.getReturnValue());
           
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
    },
    
    loadSessionTypes : function(component, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.getPicklistValues');
      
        action.setParams({
            "picklistAPIName" : "innohub__Type__c"  
        });
        
        action.setCallback(this, function(response) {
            
            component.set("v.sessionTypes",response.getReturnValue());
           
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
    },
    
    //Custom picklist
    loadCustomPicklist_1 : function(component, helper) {
        console.log('BANANAS');
        
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
        console.log('BANANAS');
        
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
        console.log('BANANAS');
        
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