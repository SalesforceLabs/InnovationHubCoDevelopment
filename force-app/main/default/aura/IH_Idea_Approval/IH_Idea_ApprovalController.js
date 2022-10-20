({
    doInit : function(component, event, helper) {
        
        var action = component.get('c.isApproved');
        
        action.setParams({
            "recordId": component.get('v.recordId')
        });
        
        action.setCallback(this, function(response) { 
            
            if(response.getReturnValue() == 'Approved'){
                component.set("v.theBoolean", true); 
            }
            else{
                component.set("v.theBoolean", false);
                var theReason = response.getReturnValue();
                component.set("v.theReason", theReason);
            }
        });
        $A.enqueueAction(action); 
    }
})