({
	doInit : function(component, event, helper) {
		var action = component.get('c.isApproved');
        
        action.setParams({
            "recordId": component.get('v.recordId')
        });
        
        action.setCallback(this, function(response) {
            //component.set("v.idea", response.getReturnValue()); 
            console.log('Status: ' + response.getReturnValue());
            if(response.getReturnValue() == 'Rejected'){
                component.set("v.theBoolean", true); 
            }
            else{
                component.set("v.theBoolean", false); 
            }
        });
        
        $A.enqueueAction(action); 
	},
    
    close : function(component, event, helper) {
        console.log('Close warning');
        component.set("v.theBoolean", false); 
    }
})