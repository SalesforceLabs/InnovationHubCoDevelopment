({
    doInit : function(component, event, helper) {
        var industryMap = [];
        industryMap.push({label: $A.get("$Label.c.Type_Filter_Recent_Label"), value: 'Recent'});
        industryMap.push({label: $A.get("$Label.c.my_Prototypes_Filter_Label"), value: 'My Prototypes'});
        component.set("v.listOfRecordTypes", industryMap);
        
    },
    
	handleChange : function(component, event, helper) {
		var changeValue = event.getParam("value");
        var checkedList = [];
        checkedList.push(changeValue);
                    
        var filterChangedEvent = component.getEvent("filterChangedEvent");
        
        filterChangedEvent.setParams({
            "filterName" : 'Type',
            "selectedFilters" : checkedList
        });
        
        filterChangedEvent.fire();
    }
})