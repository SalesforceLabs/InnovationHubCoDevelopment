({
    doInit : function(component, event, helper) {
        var actionWorkstream = component.get('c.getPicklistLabel');
        actionWorkstream.setParams({
            "picklistAPIName" : 'innohub__Workstream__c'
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
        
        
        console.log('filters changed');
        
        component.set("v.filters",filters);
        var filtersUpdated = component.getEvent("filtersUpdated");
        filtersUpdated.setParams({
            "filterList" : filters
        });
        
        filtersUpdated.fire();      
        
    },
    
    handleClick : function(component, event, helper) {
        /*var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/create-idea"
        });
        urlEvent.fire();*/
        component.set("v.isModalOpen", true);
    },
    handleClick2 : function(component, event, helper) {
        
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Innovation_Idea__c",
            "recordTypeId" : "0120N000000ERurQAG"
        });
        createRecordEvent.fire();
    },
    handleChange : function(component, event, helper) {
        component.set("v.selectedRecordType", event.getSource().get("v.value"));
        console.log(event.getSource().get("v.value"));
    },
   openModel: function(component, event, helper) {
      // for Display Model,set the "isOpen" attribute to "true"
      component.set("v.isModalOpen", true);
   },
 
   closeModel: function(component, event, helper) {
      // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
      component.set("v.isModalOpen", false);
   },
 
   likenClose: function(component, event, helper) {
      // Display alert message on the click on the "Like and Close" button from Model Footer 
      // and set set the "isOpen" attribute to "False for close the model Box.
      component.set("v.isModalOpen", false);
      var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Innovation_Idea__c",
            "recordTypeId" : component.get("v.selectedRecordType")
        });
        createRecordEvent.fire();
      
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
    }
})