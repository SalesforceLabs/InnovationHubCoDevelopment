({
	navigateToRecord : function(component, event, helper) {
        
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get('v.objectItem.Id'),
            "slideDevName": "related"
        });
        navEvt.fire();
    }
})