({
    doInit : function(component, event, helper) {
        console.log('User Voice: ' + component.get('v.userVoice'));
        if(component.get('v.userVoice.innohub__Workstream__c')){
            component.set('v.catSet', true);
            component.set('v.userVoiceCatAll', component.get('v.userVoice.innohub__Workstream__c').replace(new RegExp(";", "g"), ' | '));
            var theLength = ((component.get('v.userVoice.innohub__Workstream__c').split(";")).length);
            
            if(theLength > 2){
                var theString = (component.get('v.userVoice.innohub__Workstream__c').split(";")[0]) + ' | ' + (component.get('v.userVoice.innohub__Workstream__c').split(";")[1]);
                component.set('v.userVoiceCatTwo', theString);
                $A.util.removeClass(component.find('theHelpText'), 'hidden');
            }
            else if(theLength > 1){
                var theString = (component.get('v.userVoice.innohub__Workstream__c').split(";")[0]) + ' | ' + (component.get('v.userVoice.innohub__Workstream__c').split(";")[1]);
                component.set('v.userVoiceCatTwo', theString);
                $A.util.removeClass(component.find('theTrunc'), 'slds-truncate');
                $A.util.removeClass(component.find('theSize'), 'slds-size_3-of-5');
                $A.util.addClass(component.find('theSize'), 'slds-size_4-of-5');
            }
                else{
                    component.set('v.userVoiceCatTwo', component.get('v.userVoice.innohub__Workstream__c'));
                    $A.util.removeClass(component.find('theTrunc'), 'slds-truncate');
                }
        }
    },
    
    goToUserVoice : function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get("v.userVoice.Id"),
            "slideDevName": "related"
        });
        navEvt.fire(); 
    },
    
    voteUp : function(component, event, helper) {
        var action = component.get('c.upvote');
        
        action.setParams({
            "recordId": component.get('v.idea.Id')
        });
        
        action.setCallback(this, function(response) {
            //  var demos = response.getReturnValue();
            //  
            $A.get('e.force:refreshView').fire();;
        });
        
        $A.enqueueAction(action);
    },
    
    voteDown : function(component, event, helper) {
        var action = component.get('c.downvote');
        
        action.setParams({
            "recordId": component.get('v.idea.Id')
        });
        
        action.setCallback(this, function(response) {
            //   var demos = response.getReturnValue();
            $A.get('e.force:refreshView').fire();
        });
        
        $A.enqueueAction(action);
    }
})