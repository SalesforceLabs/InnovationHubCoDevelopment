({
	loadCreator : function(component, helper) {

		var action = component.get('c.getCreator');
        
        action.setParams({
            "creatorId": component.get('v.event.CreatedById')
        });
        
        action.setCallback(this, function(response) {
            var demos = response.getReturnValue();
            component.set("v.creator", demos); 
        });
        
        $A.enqueueAction(action); 
	}
})