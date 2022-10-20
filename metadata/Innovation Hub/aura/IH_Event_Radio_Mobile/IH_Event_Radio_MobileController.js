({
    
    doInit : function(component, event, helper) {
        var industryMap = [];
        industryMap.push({label: $A.get("$Label.c.Filter_Type_All"), value: 'All Events'});
        industryMap.push({label: $A.get("$Label.c.my_Events_Filter_Label"), value: 'My Events'});
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
    },
    
    theRadioSelected : function(component, event, helper) {
        var theRadio = event.getParam("radioSelected");
        var checkedList = [];
        component.set('v.value', theRadio);
        checkedList.push(theRadio);
        
        var filterChangedEvent = component.getEvent("filterChangedEvent");
        
        filterChangedEvent.setParams({
            "filterName" : 'Type',
            "selectedFilters" : checkedList
        });
        filterChangedEvent.fire();
    }
});