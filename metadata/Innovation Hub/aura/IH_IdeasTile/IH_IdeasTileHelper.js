({
    loadCreator : function(component, helper) {
        var action = component.get('c.getCreator');
        
        action.setParams({
            "creatorId": component.get('v.idea.CreatedById')
        });
        
        action.setCallback(this, function(response) {
            component.set("v.creator", response.getReturnValue()); 
        });
        
        $A.enqueueAction(action); 
    },
    
    loadVote : function(component, helper) {
        var action = component.get('c.checkVote');
        
        action.setParams({
            "recordId": component.get('v.idea.Id')
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
    
    //MF - Added init method for loading votes
    initLoadVote : function(component, helper) {
        if(component.get('v.idea.innohub__Innovation_Idea_Votes__r')){
            console.log('VOTE: ');
            component.set('v.theVote', component.get('v.idea.innohub__Innovation_Idea_Votes__r')[0].innohub__Vote_Type__c);
            component.set('v.votePresent', true);
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        }
    },
    
    getRecordTypeName : function(component, helper) {
        
        var action = component.get('c.getRecordTypeName');
        
        action.setParams({
            "recordTypeId": component.get('v.idea.RecordTypeId')
        });
        
        action.setCallback(this, function(response) {
            //console.log('Record Type Name: ' + response.getReturnValue());
            component.set('v.recordTypeName', response.getReturnValue());
        });
        
        $A.enqueueAction(action);
    },
    
    loadPoints : function(component, helper) {
        var action = component.get('c.getPoints');
        
        action.setParams({
            "recordId": component.get('v.idea.Id')
        });
        
        action.setCallback(this, function(response) {
            var vote = response.getReturnValue();
            
            component.set('v.idea.innohub__Points__c', response.getReturnValue());
        });
        
        $A.enqueueAction(action);
    }
})