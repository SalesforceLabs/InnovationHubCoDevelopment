({
    doInit : function(component, event, helper) {
        helper.getSpaces(component, helper);
        
        var today = new Date();
        var monthDigit = today.getMonth() + 1;
        if (monthDigit <= 9) {
            monthDigit = '0' + monthDigit;
        }
        
        var dayDigit = today.getDate()
        if(dayDigit <= 9){
            dayDigit = '0' + dayDigit;
        }
        
        component.set('v.today', today.getFullYear() + "-" + monthDigit + "-" + dayDigit);
        
        var action = component.get("c.getEvent");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        
        // Register the callback function
        action.setCallback(this, function(response) {
            component.set('v.event' , response.getReturnValue());
            
            // NEED TO UPDATE WITH EVENT MEMBER
            var action1 = component.get('c.checkIfEventMember');
            
            action1.setParams({
                'theEvent' : component.get('v.event')
            });
            
            action1.setCallback(this, function(response) {
                if(response.getReturnValue() != null){
                    component.set('v.isRegistered', true);
                    
                    $A.util.toggleClass(component.find('registerId'), 'slds-hide');
                    $A.util.toggleClass(component.find('unregisterId'), 'slds-hide');
                    $A.util.toggleClass(component.find('registerMessage'), 'slds-hide');
                }
                                
                if(component.get("v.today") > component.get("v.event.innohub__End__c")){
                    component.set('v.isFuture', false);
                    $A.util.addClass(component.find('theCountofSpaces'), 'slds-hide');
                }
                
                else{
                    component.set('v.isFuture', true);
                }
            });
            $A.enqueueAction(action1);
        });
        
        // Invoke the service
        $A.enqueueAction(action);
    },
    
    registerMessage : function(component, event, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action1 = component.get('c.createEventMember');
        
        action1.setParams({
            'theEvent' : component.get('v.event')
        });
        
        action1.setCallback(this, function(response) {
            var state = response.getState();
            //if (state === "SUCCESS") {
                $A.util.addClass(component.find('mySpinner'), "slds-hide");
                $A.util.toggleClass(component.find('registerId'), 'slds-hide');
                $A.util.toggleClass(component.find('unregisterId'), 'slds-hide');
                $A.util.toggleClass(component.find('registerMessage'), 'slds-hide');
                
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": $A.get("$Label.c.event_Register_Me_Success_Status"),
                    "type" : "success",
                    "message": $A.get("$Label.c.event_Register_Me_SuccessMessage")
                });
                toastEvent.fire();
            /*}
            else{
                $A.util.addClass(component.find('mySpinner'), "slds-hide");
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Registration unsuccessful!",
                    "type" : "error",
                    "message": "No contact record found for this user"
                });
                toastEvent.fire();
            }*/
        });
        $A.enqueueAction(action1);
        
        helper.getSpaces(component, helper);
    },
    
    unregister : function(component, event, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        $A.util.toggleClass(component.find('registerId'), 'slds-hide');
        $A.util.toggleClass(component.find('unregisterId'), 'slds-hide');
        $A.util.toggleClass(component.find('registerMessage'), 'slds-hide');
        
        
        var action1 = component.get('c.removeEventMember');
        
        action1.setParams({
            'theEvent' : component.get('v.event')
        });
        
        action1.setCallback(this, function(response) {
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": $A.get("$Label.c.event_Unregister_Me_Success_Status"),
                "type" : "success",
                "message": $A.get("$Label.c.event_Unregister_Me_SuccessMessage")
            });
            toastEvent.fire();
        });
        $A.enqueueAction(action1);
        
        helper.getSpaces(component, helper);
    },
    
    gotoEvents : function(component, event, helper) {
         window.history.back();	
   }   
})