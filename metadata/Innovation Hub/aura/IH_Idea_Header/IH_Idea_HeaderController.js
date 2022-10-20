({
    doInit : function(component, event, helper) {
        
        var action = component.get("c.getIdea");
        
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        
        // Register the callback function
        action.setCallback(this, function(response) {
            console.log('response.getReturnValue(): ' , response.getReturnValue());
            component.set('v.idea' , response.getReturnValue());
            helper.getTheCreator(component, event);
            helper.loadVote(component, helper);
            helper.loadPoints(component, helper);
            
            if(component.get('v.idea.innohub__Category__c')){
                component.set('v.catSet', true);
                component.set('v.ideaCatAll', component.get('v.idea.innohub__Category__c').replace(new RegExp(";", "g"), ' | '));
            }
        });
        $A.enqueueAction(action);
        
        
    },
    
    voteUp : function(component, event, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.upvote');
        
        action.setParams({
            "recordId": component.get('v.idea.Id')
        });
        
        action.setCallback(this, function(response) {
            helper.loadVote(component, helper);
            helper.loadPoints(component, helper);
        });
        
        $A.enqueueAction(action);
    },
    
    voteDown : function(component, event, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.downvote');
        
        action.setParams({
            "recordId": component.get('v.idea.Id')
        });
        
        action.setCallback(this, function(response) {
            helper.loadVote(component, helper);
            helper.loadPoints(component, helper);
        });
        
        $A.enqueueAction(action);
    },
    
    gotoIdeas : function(component, event, helper) {
       window.history.back();	
   }

})