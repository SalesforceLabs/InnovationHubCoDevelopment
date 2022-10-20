({
    doInit : function(component, event, helper) {
        var action = component.get('c.getLoggedInUser');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.user', response.getReturnValue());
                component.set('v.theBoolean', true);
                console.log('USER IS AN ADMIN');
            }
            
        });
        $A.enqueueAction(action); 
        
        var action2 = component.get('c.firstSubmissionCheck');        
        action2.setParams({
            'theRecordId' : component.get('v.recordId')  
        });
        
        action2.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.firstSubmission', false);
                component.set('v.demoCard', response.getReturnValue());
            }
        });
        $A.enqueueAction(action2); 
    },
    
    createScorecard : function(component, event, helper) {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "innohub__Demo_Scorecard__c",
            "defaultFieldValues": {
                'innohub__Demo__c' : component.get('v.recordId')
            }
        });
        createRecordEvent.fire();
    },
    
    editScorecard : function(component, event, helper) {
        var editRecordEvent = $A.get("e.force:editRecord");
        editRecordEvent.setParams({
            "recordId": component.get("v.demoCard.Id")
        });
        editRecordEvent.fire();
    }
});