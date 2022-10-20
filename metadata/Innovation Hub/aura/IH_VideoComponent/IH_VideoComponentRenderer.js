({
	rerender: function (component, helper) {
        this.superRerender();
        var theVidId = component.get('v.theObject.innohub__Video_File_Id__c');
        component.set('v.videoIdOld', theVidId);
    }
})