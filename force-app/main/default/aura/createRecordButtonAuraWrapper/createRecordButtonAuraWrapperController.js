({
  createNewRecord: function(component, event, helper) {
    var createRecordEvent = $A.get("e.force:createRecord");
      const defaultValues = event.getParam("defaultValues");
      console.log(JSON.stringify(defaultValues));
      
    createRecordEvent.setParams({
      entityApiName: component.get("v.objectApiName"),
      recordTypeId: event.getParam("recordTypeId"),
      defaultFieldValues: event.getParam("defaultValues")
    });
    createRecordEvent.fire();
  }
});