({
    loadCreator : function(component, helper) {
        
        var action = component.get('c.getCreator');
        
        action.setParams({
            "creatorId": component.get('v.demo.CreatedById')
        });
        
        action.setCallback(this, function(response) {
            var demos = response.getReturnValue();
            component.set("v.creator", demos); 
        });
        
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
    
    initLoadVote : function(component, helper) {  
        if(component.get('v.demo.innohub__Vote_Type__c')){
            //console.log('Entered tile');
            component.set('v.theVote', component.get('v.demo.innohub__Vote_Type__c'));
            component.set('v.votePresent', true);
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        }
        
    },
    
    loadPoints : function(component, helper) {
        var action = component.get('c.getPoints');
        
        action.setParams({
            "recordId": component.get('v.demo.Id')
        });
        
        action.setCallback(this, function(response) {
            var vote = response.getReturnValue();
            
            component.set('v.demo.innohub__Points__c', response.getReturnValue());
        });
        
        $A.enqueueAction(action);
    }
})