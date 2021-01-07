({
    doInit : function(component, event, helper) {
        var action = component.get("c.getEvent");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        
        // Register the callback function
        action.setCallback(this, function(response) {
            component.set('v.event' , response.getReturnValue());
        });
        
        // Invoke the service
        $A.enqueueAction(action);
    }
})