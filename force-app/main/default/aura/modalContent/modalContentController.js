({
    doInit: function(cmp) {
        var action = cmp.get("c.getIdeaRecordTypesButton");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.listOfRecordTypes", response.getReturnValue());
                if(response.getReturnValue().length == 1){
                    cmp.set("v.selectedRecordType", response.getReturnValue()[0]);
                    cmp.find("overlayLib").notifyClose();
                    
                    
                    var createRecordEvent = $A.get("e.force:createRecord");
                    createRecordEvent.setParams({
                        "entityApiName": "innohub__Innovation_Idea__c",
                        "recordTypeId" : response.getReturnValue()[0].Id,
                        'defaultFieldValues': {
                            'innohub__Approval_Status__c':'Submitted'
                        }
                    });
                    createRecordEvent.fire();
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    createInnovation : function(component, event, helper) {
        component.set("v.selectedRecordType", event.getSource().get("v.value"));
        component.set('v.isDisabled', 'false');
    },
    
    closeModel: function(component, event, helper) {
        component.find("overlayLib").notifyClose();
    },
    
    next: function(component, event, helper) {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "innohub__Innovation_Idea__c",
            "recordTypeId" : component.get("v.selectedRecordType"),
            'defaultFieldValues': {
                'innohub__Approval_Status__c':'Submitted'
            }
        });
        createRecordEvent.fire();
        component.find("overlayLib").notifyClose();
    }
})