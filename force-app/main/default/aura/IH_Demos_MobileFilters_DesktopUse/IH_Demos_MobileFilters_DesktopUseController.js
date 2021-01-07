({
    doInit : function(component, event, helper) {
        console.log('STUFF');
        
        var actionDemoType = component.get('c.getPicklistLabel');
        actionDemoType.setParams({
            "picklistAPIName" : 'innohub__Demo_Type__c'
        });
        
        actionDemoType.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.standardDemoType", response.getReturnValue()); 
            }
        });  
        $A.enqueueAction(actionDemoType);
        
        var actionCategory = component.get('c.getPicklistLabel');
        actionCategory.setParams({
            "picklistAPIName" : 'innohub__Category__c'
        });
        
        actionCategory.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.standardCategory", response.getReturnValue()); 
            }
        });  
        $A.enqueueAction(actionCategory);
        
        var actionWorkstream = component.get('c.getPicklistLabel');
        actionWorkstream.setParams({
            "picklistAPIName" : 'innohub__Clouds_Involved__c'
        });
        
        actionWorkstream.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.standardWorkstream", response.getReturnValue()); 
            }
        });  
        $A.enqueueAction(actionWorkstream);
        
        if(component.get('v.FilterFieldName1') != null){
            var action = component.get('c.getPicklistLabel');
            action.setParams({
                "picklistAPIName" : component.get('v.FilterFieldName1') 
            });
            
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    console.log('DERMO');
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
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "key": "filter",
            "message": "Filter updated"
        });
        toastEvent.fire();
        
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
        
        component.set("v.filters",filters);
        
        console.log('current filters' , component.get("v.filters"));
        
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
    },
    sectionSeven : function(component, event, helper) {
        helper.helperFun(component,event,'listSeven');
    },
    
    theRadioSelected : function(component, event, helper) {
        var theRadio = event.getParam("radioSelected");
        var checkedList = [];
        component.set('v.value', theRadio);
        checkedList.push(theRadio);
        
        var filterChangedEvent = component.getEvent("filterChangedEvent");
        
        filterChangedEvent.setParams({
            "filterName" : 'Type',
            "selectedFilters" : checkedList
        });
        filterChangedEvent.fire();
    }
    
})