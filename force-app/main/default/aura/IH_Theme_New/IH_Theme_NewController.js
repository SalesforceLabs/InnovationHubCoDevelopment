({
    gotoHome : function(component, event, helper) {
        console.log('gotoHome');
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/"
        });
        urlEvent.fire();		
    },
    
    editCss :function(component, event, helper){
        component.find('panelImage').getElement().style.background = "url('/resource/" + event.getParam("pimage") + "')";
        component.find('panelImage').getElement().style.backgroundSize  = "cover";  
    }
})