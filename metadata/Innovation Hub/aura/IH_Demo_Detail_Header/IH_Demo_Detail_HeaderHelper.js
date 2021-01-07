({
	getTheCreator : function(component, event) {
        
		var action = component.get("c.getCreator");
        action.setParams({
            "creatorId": component.get("v.demo.OwnerId")
        });
        
        // Register the callback function
        action.setCallback(this, function(response) {
            component.set('v.creator' , response.getReturnValue());
        });
        
        // Invoke the service
        $A.enqueueAction(action);

	},
    
    loadVote : function(component, helper) {
        var action = component.get('c.checkVote');
        
        action.setParams({
            "recordId": component.get('v.demo.Id')
        });
        
        action.setCallback(this, function(response) {
            var vote = response.getReturnValue();
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.theVote', response.getReturnValue());
                component.set('v.votePresent', true);
                $A.util.addClass(component.find('mySpinner'), "slds-hide");
            }
            else{
                component.set('v.votePresent', false);
            }
        });
        
        $A.enqueueAction(action);
    },
    
    loadPoints : function(component, helper) {
        var action = component.get('c.getPoints');
        
        action.setParams({
            "recordId": component.get('v.demo.Id')
        });
        
        action.setCallback(this, function(response) {
            var vote = response.getReturnValue();
            
            component.set('v.thePoints', response.getReturnValue());
        });
        
        $A.enqueueAction(action);
    }
})