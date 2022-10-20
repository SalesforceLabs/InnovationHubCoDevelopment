({
	doInit : function(component, event, helper) {
        var action = component.get('c.getLoggedInUser');
        
        action.setParams({
            'recordId' : component.get('v.recordId')
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.theBoolean', response.getReturnValue());
            }
            
        });
        $A.enqueueAction(action); 
    },
    
    editSubmission : function(component, event, helper) {
        var editRecordEvent = $A.get("e.force:editRecord");
        editRecordEvent.setParams({
            "recordId": component.get("v.recordId")
        });
        editRecordEvent.fire();
        
        var appEvent = $A.get("e.c:editUnderReviewIdea");
        appEvent.fire();
    }
})