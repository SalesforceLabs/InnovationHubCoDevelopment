({
    navigateToEvent : function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get('v.article.Id'),
            "slideDevName": "related"
        });
        navEvt.fire();
    }
})