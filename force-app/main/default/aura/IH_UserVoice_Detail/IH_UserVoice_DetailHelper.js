({
	helperMethod : function(component, event) {
        
		var action = component.get("c.getCreator");
        action.setParams({
            "creatorId": component.get("v.userVoice.OwnerId")
        });
        
        // Register the callback function
        action.setCallback(this, function(response) {
            component.set('v.creator' , response.getReturnValue());
        });
        
        // Invoke the service
        $A.enqueueAction(action);

	}
})