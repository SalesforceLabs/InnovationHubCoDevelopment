({
    doInit: function(component, event, helper) {
        var action = component.get('c.getPicklistLabel');
        
        action.setParams({
            "picklistAPIName" : component.get('v.filterName') 
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.filterLabel", response.getReturnValue()); 
            }
        });  
        $A.enqueueAction(action);
    },
    
    handleChange : function(component, event, helper) {
        
        var cbList = component.find("filterCB");  
        var options = component.get("v.options");
        var filterName = component.get("v.filterName");
        var type= component.get("v.type");
        var checkedList = [];
        
        if (!Array.isArray(cbList)) {
            cbList = [cbList];
        }  
        
        for (var i=0;i<cbList.length;i++){
            if (cbList[i].get("v.checked")==true) {
                if ((type=='radio' && event.getSource().get("v.value")==i)||(type=='checkbox')){
                    checkedList.push('\''+options[i]+'\'');
                }
            }
        }
        
        var filterChangedEvent = component.getEvent("filterChangedEvent");
        filterChangedEvent.setParams({
            "filterName" : filterName,
            "selectedFilters" : checkedList
        });
        
        filterChangedEvent.fire();
    }
})