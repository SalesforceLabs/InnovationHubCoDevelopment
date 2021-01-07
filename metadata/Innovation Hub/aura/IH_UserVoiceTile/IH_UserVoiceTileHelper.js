({
    loadCreator : function(component, helper) {
        var action = component.get('c.getCreator');
        
        action.setParams({
            "creatorId": component.get('v.idea.CreatedById')
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
            "recordId": component.get('v.idea.Id')
        });
        
        action.setCallback(this, function(response) {
            var vote = response.getReturnValue();
            
            if(vote === 'Up'){
                component.set('v.liked', true);
                
            }else if(vote === 'Down'){
                component.set('v.disliked', true);
            } 
        });
        
        $A.enqueueAction(action);
    },
    
    getRecordTypeName : function(component, helper, recordId) {
        var action = component.get('c.getRecordTypeName');
        
         action.setParams({
            "recordTypeId": recordId
        });
        
        action.setCallback(this, function(response) {
            component.set('v.recordTypeName', response.getReturnValue());
        });
        
        $A.enqueueAction(action);
    }
})