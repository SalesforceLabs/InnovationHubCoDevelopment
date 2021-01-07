({
    doInit : function(component, event, helper) {
        
        var action = component.get("c.getIdea");
        
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        
        // Register the callback function
        action.setCallback(this, function(response) {
            component.set('v.idea' , response.getReturnValue());
        });
        $A.enqueueAction(action);
        
        var action_2 = component.get('c.getLoggedInUser');
        
        action_2.setParams({
            'recordId' : component.get('v.recordId')
        });
        
        action_2.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.theBoolean', response.getReturnValue());
            }
            
        });
        $A.enqueueAction(action_2);
    },
    
    handleApplicationEvent : function(component, event, helper) {
        console.log('BANANAS + MONKEYS EVENT FIRED');
    }
})