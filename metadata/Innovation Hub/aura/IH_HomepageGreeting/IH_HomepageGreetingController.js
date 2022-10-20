({
	doInit : function(component, event, helper) {
		var action = component.get('c.getUser');
        
        action.setCallback(this, function(result){
            component.set("v.user", result.getReturnValue());
        });
        $A.enqueueAction(action);
	}
})