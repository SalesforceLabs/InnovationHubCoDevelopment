({
    doInit : function(component, event, helper) {
        var actionCategory = component.get('c.getPicklistLabel');
        actionCategory.setParams({
            "picklistAPIName" : 'innohub__Type__c'
        });
        
        actionCategory.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.standardCategory", response.getReturnValue()); 
            }
        });  
        $A.enqueueAction(actionCategory);
        
        var actionBU = component.get('c.getPicklistLabel');
        actionBU.setParams({
            "picklistAPIName" : 'innohub__BU__c'
        });
        
        actionBU.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.standardBU", response.getReturnValue()); 
            }
        });  
        $A.enqueueAction(actionBU);
        
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
    
    handleShowModal: function(component, evt, helper) {
       $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var modalBody;
        $A.createComponents([
            ["c:Activity_ModelContent",{}]
        ],
                            function(components, status){
                                if (status === "SUCCESS") {
                                    $A.util.addClass(component.find('mySpinner'), "slds-hide");
                                    modalBody = components[0];
                                    component.find('overlayLib').showCustomModal({
                                        header: "Create New Activity",
                                        body: modalBody, 
                                        showCloseButton: true,
                                        cssClass: "my-modal,my-custom-class,my-other-class"
                                    })
                                }
                            }
                           );
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