({
    doInit : function(component, event, helper){
        var industryMap = [];
        industryMap.push({label: $A.get("$Label.c.Filter_Type_All"), value: 'All'});
        industryMap.push({label: $A.get("$Label.c.this_week_filter_label"), value: 'This Week'});
        industryMap.push({label: $A.get("$Label.c.this_month_filter_label"), value: 'This Month'});
        industryMap.push({label: $A.get("$Label.c.this_quarter_filter_label"), value: 'This Quarter'});

        component.set("v.listOfRecordTypes", industryMap); 
    },
    
    handleChange : function(component, event, helper) {
        var changeValue = event.getParam("value");
        var checkedList = [];
        checkedList.push(changeValue);
        
        var filterChangedEvent = component.getEvent("filterChangedEvent");
        
        filterChangedEvent.setParams({
            "filterName" : 'Date',
            "selectedFilters" : checkedList
        });
        
        filterChangedEvent.fire();
    }
});