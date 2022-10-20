({
    doInit : function(component, event, helper) {
        //helper.loadCreator(component, helper);
        helper.initLoadVote(component, helper);
        //helper.loadPoints(component, helper);
        if(component.get('v.isHighlight') == true){
            helper.loadVote(component, helper);
        }
        
        if(component.get('v.demo.innohub__Category__c')){
            component.set('v.catSet', true);
            component.set('v.demoCatAll', component.get('v.demo.innohub__Category__c').replace(new RegExp(";", "g"), ' | '));
            var theLength = ((component.get('v.demo.innohub__Category__c').split(";")).length);
            if(theLength > 2){
                var theString = (component.get('v.demo.innohub__Category__c').split(";")[0]) + ' | ' + (component.get('v.demo.innohub__Category__c').split(";")[1]);
                component.set('v.demoCatTwo', theString);
                $A.util.removeClass(component.find('theHelpText'), 'hidden');
            }
            else if(theLength > 1){
                var theString = (component.get('v.demo.innohub__Category__c').split(";")[0]) + ' | ' + (component.get('v.demo.innohub__Category__c').split(";")[1]);
                component.set('v.demoCatTwo', theString);
                $A.util.removeClass(component.find('theTrunc'), 'slds-truncate');
                $A.util.removeClass(component.find('theSize'), 'slds-size_3-of-5');
                $A.util.addClass(component.find('theSize'), 'slds-size_4-of-5');
            }
                else{
                    component.set('v.demoCatTwo', component.get('v.demo.innohub__Category__c'));
                }
        }
    },
    
    goToDemoDetail : function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get('v.demo.Id')
        });
        navEvt.fire();
    },
    
    
    voteUp : function(component, event, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.upvote');
        
        action.setParams({
            "recordId": component.get('v.demo.Id')
        });
        
        action.setCallback(this, function(response) {
            var applicationEvent = $A.get("e.c:DemoVoteChange");
            applicationEvent.fire();
            
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
            var applicationEvent = $A.get("e.c:DemoVoteChange");
            applicationEvent.fire();
            
            helper.loadVote(component, helper);
            helper.loadPoints(component, helper);
        });
        
        $A.enqueueAction(action);
    }
})