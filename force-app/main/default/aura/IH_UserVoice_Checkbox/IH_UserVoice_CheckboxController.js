({
    doInit: function(cmp, event) {
        var industryMap = [];
        industryMap.push({label: $A.get("$Label.c.Filter_Type_All"), value: 'All'});
        industryMap.push({label: $A.get("$Label.c.Type_Filter_Recent_Label"), value: 'Recent'});
        cmp.set("v.listOfRecordTypes", industryMap);
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
});