({
    doInit : function(component, event, helper) {
        console.log('doInit');
        console.log('recordId: ' + component.get('v.recordId'));
        console.log('queryObject: ' + component.get('v.queryObject'));
        console.log('relatedObject: ' + component.get('v.relatedObject'));
        
        var action = component.get('c.getList');
        
        action.setParams({
            'theId' :  component.get('v.recordId'),
            'queryObject' : component.get('v.queryObject'),
            'relatedObject' : component.get('v.relatedObject')
        });
        
        action.setCallback(this, function(actionResult){
            console.log('actionResult: ', actionResult.getReturnValue());
            component.set('v.ListofsObject', actionResult.getReturnValue());
        });
        $A.enqueueAction(action);
    },
    
    newRecord : function(component, event, helper) {
        var theObject = component.get('v.queryObjectwithC');
        console.log('theObject: ' + theObject);
        console.log('theObject related: ' + component.get('v.relatedObject'));
        
        if(component.get('v.relatedObject') == 'innohub__Innovation_Demo_Association__c'){
            
            if(theObject == 'innohub__Innovation__c'){
                var createRecordEvent = $A.get("e.force:createRecord");
                createRecordEvent.setParams({
                    "entityApiName": component.get('v.relatedObject'),
                    "defaultFieldValues": {
                        'innohub__Innovation__c' : component.get('v.recordId')
                    }
                });
                createRecordEvent.fire();
            }
            
            else if(theObject == 'innohub__Demo__c'){
                var createRecordEvent = $A.get("e.force:createRecord");
                createRecordEvent.setParams({
                    "entityApiName": component.get('v.relatedObject'),
                    "defaultFieldValues": {
                        'innohub__Demo__c' : component.get('v.recordId')
                    }
                });
                createRecordEvent.fire();
            }
        }
        
        if(component.get('v.relatedObject') == 'innohub__Idea_Event_Association__c'){
            var createRecordEvent = $A.get("e.force:createRecord");
            createRecordEvent.setParams({
                "entityApiName": component.get('v.relatedObject'),
                "defaultFieldValues": {
                    'innohub__Idea__c' : component.get('v.recordId')
                }
            });
            createRecordEvent.fire();
        }
        
        if(component.get('v.relatedObject') == 'innohub__Innovation_Activity_Association__c'){
            var createRecordEvent = $A.get("e.force:createRecord");
            createRecordEvent.setParams({
                "entityApiName": component.get('v.relatedObject'),
                "defaultFieldValues": {
                    'innohub__Innovation__c' : component.get('v.recordId')
                }
            });
            createRecordEvent.fire();
        } 
        
        if(component.get('v.relatedObject') == 'innohub__Event_Demo_Association__c'){
            var createRecordEvent = $A.get("e.force:createRecord");
            createRecordEvent.setParams({
                "entityApiName": component.get('v.relatedObject'),
                "defaultFieldValues": {
                    'innohub__Demo__c' : component.get('v.recordId')
                }
            });
            createRecordEvent.fire();
        } 
        
        if(component.get('v.relatedObject') == 'innohub__Idea_Activity_Association__c'){
            var createRecordEvent = $A.get("e.force:createRecord");
            createRecordEvent.setParams({
                "entityApiName": component.get('v.relatedObject'),
                "defaultFieldValues": {
                    'innohub__Innovation_Idea__c' : component.get('v.recordId')
                }
            });
            createRecordEvent.fire();
        } 
        
        
        if(component.get('v.relatedObject') == 'innohub__Demo_Activity_Association__c'){
            var createRecordEvent = $A.get("e.force:createRecord");
            createRecordEvent.setParams({
                "entityApiName": component.get('v.relatedObject'),
                "defaultFieldValues": {
                    'innohub__Demo__c' : component.get('v.recordId')
                }
            });
            createRecordEvent.fire();
        }          
    }
})