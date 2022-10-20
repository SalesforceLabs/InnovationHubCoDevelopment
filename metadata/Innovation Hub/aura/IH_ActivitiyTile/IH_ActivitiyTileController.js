({
	doInit : function(component, event, helper) {
        helper.loadCreator(component, helper);
	},
    
    goToActivity : function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
          "recordId": component.get("v.activity.Id"),
          "slideDevName": "related"
        });
    	navEvt.fire(); 
    }
})