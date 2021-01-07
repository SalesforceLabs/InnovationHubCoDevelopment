({
    doInit : function(component, event, helper) {
        var action = component.get("c.getUserVoice");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        
        // Register the callback function
        action.setCallback(this, function(response) {
            component.set('v.userVoice' , response.getReturnValue());
            helper.helperMethod(component, event);
            
            if(component.get('v.userVoice.Workstream__c')){
                component.set('v.userVoiceCatAll', component.get('v.userVoice.innohub__Workstream__c').replace(new RegExp(";", "g"), ' | '));
            }
        });
        
        // Invoke the service
        $A.enqueueAction(action);
    },
    
    gotoUserVoices : function(component, event, helper) {
        window.history.back();
    }
})