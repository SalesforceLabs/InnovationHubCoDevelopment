({
    doInit : function(component, event, helper) {
        console.log('Video Init');
        var action = component.get('c.getVideo');
        
        action.setParams({
            "recordId" : component.get('v.recordId')
        });
        
        action.setCallback(this, function(response) {
            console.log('Video Init callback');
            var state = response.getState();
            
            if (state === "SUCCESS") {
                console.log('Ins Video: ', response.getReturnValue());
                component.set('v.theObject', response.getReturnValue());
                console.log('The Video Id: ' + response.getReturnValue().innohub__Video_File_Id__c);
                
                if(response.getReturnValue().innohub__Video_File_Id__c != null){
                    console.log('We have an id');
                    
                    var action_1 = component.get('c.checkVideoExists');
                    
                    action_1.setParams({
                        "videoId" : response.getReturnValue().innohub__Video_File_Id__c
                    });
                    
                    action_1.setCallback(this, function(response1) {
                        var state = response1.getState();
                        
                        if (state === "SUCCESS") {
                            console.log('Video of Id does exist: ', response1.getReturnValue());
                        }
                        else{
                            console.log('Video of Id does NOT exist');
                            component.set('v.videoFileNotDeleted', false);
                        }
                    }); 
                    $A.enqueueAction(action_1);
                }
            }
        });
        $A.enqueueAction(action);
    }
})