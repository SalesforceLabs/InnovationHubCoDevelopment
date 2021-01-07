({
    doInit : function(component, event, helper) {
        var action = component.get("c.getDemo");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        
        action.setCallback(this, function(response) {
            component.set('v.demo' , response.getReturnValue());
            helper.getTheCreator(component, event);
            helper.loadVote(component, helper);
            helper.loadPoints(component, helper);
            
            if(component.get('v.demo.Category__c')){
                component.set('v.catSet', true);
                component.set('v.demoCatAll', component.get('v.demo.Category__c').replace(new RegExp(";", "g"), ' | '));
            }
        });
        $A.enqueueAction(action);
    },
    
    voteUp : function(component, event, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.upvote');
        
        action.setParams({
            "recordId": component.get('v.demo.Id')
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
            "recordId": component.get('v.demo.Id')
        });
        
        action.setCallback(this, function(response) {
            helper.loadVote(component, helper);
            helper.loadPoints(component, helper);
        });
        
        $A.enqueueAction(action);
    },
    
    
    gotoDemos : function(component, event, helper) {
       window.history.back();    
   }
})