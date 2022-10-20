({ 
    doInit : function(component, event, helper) {
        var actionWorkstreams = component.get('c.getPicklistLabel');
        actionWorkstreams.setParams({
            "picklistAPIName" : 'innohub__Workstream__c' 
        });
        
        actionWorkstreams.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.standardWorkstream", response.getReturnValue()); 
            }
        });  
        $A.enqueueAction(actionWorkstreams);
        
        var actionRegion = component.get('c.getPicklistLabel');
        actionRegion.setParams({
            "picklistAPIName" : 'innohub__Region__c' 
        });
        
        actionRegion.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.standardRegion", response.getReturnValue()); 
            }
        });  
        $A.enqueueAction(actionRegion);
        
        if(component.get('v.FilterFieldName1') != null){
            var action = component.get('c.getPicklistLabel');
            action.setParams({
                "picklistAPIName" : component.get('v.FilterFieldName1') 
            });
            
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.customFilterLabel_1", response.getReturnValue()); 
                }
            });  
            $A.enqueueAction(action);
        }
        
        if(component.get('v.FilterFieldName2') != null){
            var action1 = component.get('c.getPicklistLabel');
            
            action1.setParams({
                "picklistAPIName" : component.get('v.FilterFieldName2') 
            });
            
            action1.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.customFilterLabel_2", response.getReturnValue()); 
                }
            });  
            $A.enqueueAction(action1);
        }
        
        if(component.get('v.FilterFieldName3') != null){
            var action2 = component.get('c.getPicklistLabel');
            
            action2.setParams({
                "picklistAPIName" : component.get('v.FilterFieldName3') 
            });
            
            action2.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.customFilterLabel_3", response.getReturnValue()); 
                }
            });  
            $A.enqueueAction(action2);
        }
    },
    
    filterChanged : function(component, event, helper) {
        
        var filterName = event.getParam("filterName");
        var selectedFilters = event.getParam("selectedFilters");
        var filters = component.get("v.filters");
        
        //Adding the received filter values to the global filter List and sending this list to the global component
        var filterFound = false;
        for (var i=0;i<filters.length;i++){
            if (filters[i].filterName == filterName){
                filters[i].selectedFilters=selectedFilters;
                filterFound=true;
                break;
            } 
        }
        if (!filterFound){
            filters.push({"filterName":filterName,"selectedFilters":selectedFilters});
        } 
        
        console.log('FILTERS: ', filters);
        
        component.set("v.filters",filters);
        var filtersUpdated = component.getEvent("filtersUpdated");
        filtersUpdated.setParams({
            "filterList" : filters
        });
        
        filtersUpdated.fire();    
        
    }, 
    sectionOne : function(component, event, helper) {
        helper.helperFun(component,event,'listOne');
    },
    
    sectionTwo : function(component, event, helper) {
        helper.helperFun(component,event,'listTwo');
    }, 
    sectionThree : function(component, event, helper) {
        helper.helperFun(component,event,'listThree');
    },
    sectionFour : function(component, event, helper) {
        helper.helperFun(component,event,'listFour');
    },
    sectionFive : function(component, event, helper) {
        helper.helperFun(component,event,'listFive');
    }, 
    sectionSix : function(component, event, helper) {
        helper.helperFun(component,event,'listSix');
    }
})