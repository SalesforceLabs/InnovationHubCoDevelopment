({
    filterChanged : function(component, event, helper) {
        var filterName = event.getParam("filterName");
        var selectedFilters = event.getParam("selectedFilters");
        var filters = component.get("v.filters");
        
        
        //Adding the received filter values to the global filter List and sending this list to the global component
        var filterFound = false;
        for (var i=0;i<filters.length;i++){
            if (filters[i].filterName == filterName){
                filters[i].selectedFilters=selectedFilters;
                filterFound=true;
                break;
            } 
        }
        if (!filterFound){
            filters.push({"filterName":filterName,"selectedFilters":selectedFilters});
        } 
        component.set("v.filters",filters);
        //cosnole.log('THE FILTERS: ' + filters);
                    
        var filtersUpdated = component.getEvent("filtersUpdated");
        filtersUpdated.setParams({
            "filterList" : filters
        });
        
        filtersUpdated.fire();      
        
    },
    
    handleShowModal: function(component, evt, helper) {
       $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var modalBody;
        $A.createComponents([
            ["c:Activity_ModelContent",{}]
        ],
                            function(components, status){
                                if (status === "SUCCESS") {
                                    $A.util.addClass(component.find('mySpinner'), "slds-hide");
                                    modalBody = components[0];
                                    component.find('overlayLib').showCustomModal({
                                        header: $A.get("$Label.c.create_Activity_Modal_Header"),
                                        body: modalBody, 
                                        showCloseButton: true,
                                        cssClass: "my-modal,my-custom-class,my-other-class"                                        
                                    })
                                }
                            }
                           );
    } 
})