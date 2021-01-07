({
    doInit : function(component, event, helper) {
        var action = component.get('c.getArticles');
        
        action.setCallback(this, function(response) {
            component.set('v.theArticles', response.getReturnValue());
        });
        $A.enqueueAction(action);
    }
})