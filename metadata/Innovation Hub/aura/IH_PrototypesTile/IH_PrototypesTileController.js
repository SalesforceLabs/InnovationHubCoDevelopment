({
    doInit : function(component, event, helper) {
        //helper.loadCreator(component, helper);
        //component.set("v.prototypeCat", component.get('v.prototype.Region__c').replace(";", " | "));	
        
        if(component.get('v.prototype.innohub__Region__c')){
            component.set('v.catSet', true);
            component.set('v.prototypeCatAll', component.get('v.prototype.innohub__Region__c').replace(new RegExp(";", "g"), ' | '));
            var theLength = ((component.get('v.prototype.innohub__Region__c').split(";")).length);
            
            if(theLength > 2){
                var theString = (component.get('v.prototype.innohub__Region__c').split(";")[0]) + ' | ' + (component.get('v.prototype.innohub__Region__c').split(";")[1]);
                component.set('v.prototypeCatTwo', theString);
                $A.util.removeClass(component.find('theHelpText'), 'hidden');
            }
            else if(theLength > 1){
                var theString = (component.get('v.prototype.innohub__Region__c').split(";")[0]) + ' | ' + (component.get('v.prototype.innohub__Region__c').split(";")[1]);
                component.set('v.prototypeCatTwo', theString);
                $A.util.removeClass(component.find('theTrunc'), 'slds-truncate');
                $A.util.removeClass(component.find('theSize'), 'slds-size_3-of-5');
                $A.util.addClass(component.find('theSize'), 'slds-size_4-of-5');
            }
                else{
                    component.set('v.prototypeCatTwo', component.get('v.prototype.innohub__Region__c'));
                }
        }
    },
    
    goToPrototypeDetail : function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get('v.prototype.Id')
        });
        navEvt.fire();
    }
})