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
                }else if(response.getReturnValue().innohub__Video_URL__c){
                    var regEx = "^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?\.com|youtu\.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)";
                    var matches = response.getReturnValue().innohub__Video_URL__c.match(regEx);
                    if (matches) {
                        //console.log(response.getReturnValue().innohub__Video_URL__c + "\n" + matches[1] + "\n");
                        component.set('v.theObject.innohub__Video_URL__c', 'https://www.youtube.com/embed/'+matches[1]);
                    }
                    
                }
                
            }
        });
        $A.enqueueAction(action);
    }
})