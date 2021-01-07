({
    doInit : function(component, event, helper) {
        var action = component.get("c.getPrototype");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        
        // Register the callback function
        action.setCallback(this, function(response) {
            component.set('v.prototype' , response.getReturnValue());
            helper.getCreator(component, event);
        });
        
        // Invoke the service
        $A.enqueueAction(action); 
    },
    
    gotoProto : function(component, event, helper) {
        window.history.back();	
   }
})