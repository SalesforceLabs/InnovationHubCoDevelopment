({
	doInit : function(component, event, helper) {
        var action = component.get("c.getEvent");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        
        action.setCallback(this, function(response) {
            component.set('v.event' , response.getReturnValue());
        });
        $A.enqueueAction(action);
    }
})