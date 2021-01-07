({
    doInit: function(cmp) {
        var action = cmp.get("c.getIdeaRecordTypes");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.listOfRecordTypes", response.getReturnValue());
                console.log(response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    
    createActivity : function(component, event, helper) {
        console.log('The Activity: ' + event.getSource().get("v.value"));
        component.set("v.selectedRecordType", event.getSource().get("v.value"));
        component.set('v.isDisabled', 'false');
    },
    
    closeModel: function(component, event, helper) {
        component.find("overlayLib").notifyClose();
    },
    
    next: function(component, event, helper) {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "innohub__Activity__c",
            "recordTypeId" : component.get("v.selectedRecordType")
        });
        createRecordEvent.fire();
        component.find("overlayLib").notifyClose();
    }
})