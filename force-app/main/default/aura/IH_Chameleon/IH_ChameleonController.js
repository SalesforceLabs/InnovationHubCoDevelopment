({
	doinit : function(cmp, event, helper) {
        var css = $A.get("e.c:IH_HeaderCSS_2");
        console.log('Panel Image: ' + cmp.get("v.panelImage"));
        
        css.setParams({
            pimage : cmp.get("v.panelImage")
        });
        css.fire();
	}
})