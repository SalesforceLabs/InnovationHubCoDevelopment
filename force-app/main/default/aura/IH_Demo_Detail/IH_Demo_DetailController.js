({
    doInit : function(component, event, helper) {
        var action = component.get("c.getDemo");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        
        action.setCallback(this, function(response) {
            component.set('v.demo' , response.getReturnValue());
        });
        $A.enqueueAction(action);
    }
})