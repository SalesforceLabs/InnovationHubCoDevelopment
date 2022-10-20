({
	getSpaces : function(component, helper) {
        var action = component.get('c.checkAvailability');
        
        action.setParams({
            "theEvent": component.get("v.recordId")
        });
        
        action.setCallback(this, function(response) {
            console.log('BANANAS: ' + response.getReturnValue());
            component.set("v.spaces", response.getReturnValue()); 
        });
        
        $A.enqueueAction(action); 
		
	}
})