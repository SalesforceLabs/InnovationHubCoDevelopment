public with sharing class IH_HomepageHighlights {
    
    @AuraEnabled
    public static ideaWrapper getPopularIdea(String userField){
        //Checking the Innovation_Idea__c Field Level Security
        String [] innIdeaFields = new String [] {'Id', 
            'innohub__Recommended__c', 
            'RecordTypeId', 
            'Name', 
            'innohub__Overview__c', 
            'innohub__Image__c',  
            'CreatedById', 
            'CreatedDate', 
            'innohub__Category__c', 
            'innohub__Points__c',
            'innohub__Approval_Status__c',
            'OwnerId' 
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Innovation_Idea__c.fields.getMap();
        
        for (String fieldToCheck : innIdeaFields) {
            
            // Check if the user has access to view field
            if (!innIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        String [] userFields = new String [] {'Id', 
            'Name',
            'SmallPhotoUrl',
            'FullPhotoUrl',
            'MediumPhotoUrl'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> userMap = Schema.SObjectType.User.fields.getMap();
        
        for (String fieldToCheck : userFields) {
            
            // Check if the user has access to view field
            if (!userMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        innohub__Innovation_Idea__c popIdea = [SELECT Id, RecordTypeId, Name, innohub__Overview__c, innohub__Image__c, CreatedById, CreatedBy.Name, CreatedBy.SmallPhotoUrl, CreatedBy.FullPhotoUrl, CreatedDate, toLabel(innohub__Category__c), innohub__Points__c, OwnerId, innohub__Approval_Status__c FROM innohub__Innovation_Idea__c WHERE IsDeleted = false AND innohub__Improvement_Request__c  != true AND innohub__Approval_Status__c  = 'Approved' ORDER BY CreatedDate DESC NULLS LAST LIMIT 1]; 
        
        ideaWrapper iowList = new ideaWrapper();
        iowList.ownerUser = new User();
        iowList.idea = new innohub__Innovation_Idea__c();
        iowList.idea = popIdea;
        if(userField != 'Created By'){
            //List<Queue> q = new List<Queue>();
            List<User> users = new List<User>();
            List<Id> userIds = new List<Id>();
            List<Id> queueIds = new List<Id>();
            if(string.valueOf(popIdea.OwnerId.getSObjectType()) == 'User'){
                userIds.add(popIdea.OwnerId);
            }else if(string.valueOf(popIdea.OwnerId.getSObjectType()) == 'Group'){
                queueIds.add(popIdea.OwnerId);
            }
            //System.debug('The Owner is Object: ' + string.valueOf(ini.OwnerId.getSObjectType()));  
            
            if(userIds.size()>0){
                iowList.ownerUser = [SELECT Id, Name, SmallPhotoUrl, FullPhotoUrl, MediumPhotoUrl FROM User WHERE Id IN: userIds];
            }
            if(queueIds.size()>0){
                iowList.ownerQueue = [SELECT Id, Name FROM Group WHERE Id IN: queueIds];
            }
        }
        return iowList;
    }
    
    public class ideaWrapper
    {
        @AuraEnabled
        public User ownerUser { get; set; }
        @AuraEnabled
        public Group ownerQueue { get; set; }
        @AuraEnabled
        public innohub__Innovation_Idea__c idea { get; set; }
    }
    
    
    @AuraEnabled
    public static Demo__c getLatestDemo(){
        //Checking the Demo__c Field Level Security
        String [] demoFields = new String [] {'Id', 
            'Name', 
            'innohub__Image__c', 
            'innohub__Overview__c',
            'CreatedById',
            'CreatedDate',
            'innohub__OwnerId',
            'innohub__Category__c',
            'innohub__Clouds_Involved__c'
            };
                
                // Obtain the field name/token map for the Demo__c object
                Map<String,Schema.SObjectField> demoIdeaMap = Schema.SObjectType.innohub__Demo__c.fields.getMap();  
        
        for (String fieldToCheck : demoFields) {
            
            // Check if the user has access to view field
            if (!demoIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        String [] userFields = new String [] {'Id', 
            'Name',
            'SmallPhotoUrl',
            'FullPhotoUrl',
            'MediumPhotoUrl'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> userMap = Schema.SObjectType.User.fields.getMap();
        
        for (String fieldToCheck : userFields) {
            
            // Check if the user has access to view field
            if (!userMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        innohub__Demo__c latestDemo = [SELECT Id, Name, innohub__Image__c, innohub__Overview__c, CreatedById, CreatedBy.Name, CreatedBy.SmallPhotoUrl, CreatedBy.FullPhotoUrl, CreatedDate, OwnerId, toLabel(innohub__Category__c), innohub__Points__c, toLabel(innohub__Clouds_Involved__c) FROM innohub__Demo__c WHERE IsDeleted = false ORDER BY CreatedDate DESC NULLS LAST LIMIT 1];
        return latestDemo;
    }
    
    @AuraEnabled
    public static innohub__Prototype__c getThePrototype(){
        //Check dermo1_Prototype__c
        String [] prototypeFields = new String [] {'Id', 
            'innohub__Region__c',
            'Name',
            'innohub__Image__c',
            'CreatedById',
            'CreatedDate',
            'OwnerId',
            'innohub__Description__c',
            'innohub__Overview__c'
            
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> prototypeMap = Schema.SObjectType.innohub__Prototype__c.fields.getMap();
        
        for (String fieldToCheck : prototypeFields) {
            
            // Check if the user has access to view field
            if (!prototypeMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        String [] userFields = new String [] {'Id', 
            'Name',
            'SmallPhotoUrl',
            'FullPhotoUrl',
            'MediumPhotoUrl'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> userMap = Schema.SObjectType.User.fields.getMap();
        
        for (String fieldToCheck : userFields) {
            
            // Check if the user has access to view field
            if (!userMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        innohub__Prototype__c myPrototype = [SELECT Id, toLabel(innohub__Region__c), Name, innohub__Image__c, CreatedById, CreatedBy.Name, CreatedBy.SmallPhotoUrl, CreatedBy.FullPhotoUrl, CreatedDate, OwnerId, innohub__Description__c FROM innohub__Prototype__c ORDER BY CreatedDate DESC NULLS LAST LIMIT 1];
        return myPrototype;
    }
    
    @AuraEnabled
    public static User_Voice__c getThUserVoice(){
        //Checking the UserVoice__c Field Level Security
        String [] userVoiceFields = new String [] {'Id', 
            'innohub__Detail__c', 
            'innohub__Headline__c',
            'innohub__Image__c',
            'innohub__Introduction__c',
            'Name',
            'OwnerId', 
            'innohub__Workstream__c', 
            'innohub__Submitter_Detail__c'
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> userVoiceMap = Schema.SObjectType.innohub__User_Voice__c.fields.getMap();
        
        for (String fieldToCheck : userVoiceFields) {
            
            // Check if the user has access to view field
            if (!userVoiceMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        User_Voice__c thisVoice = [SELECT innohub__Detail__c, innohub__Headline__c,Id, innohub__Image__c, innohub__Introduction__c,Name,OwnerId, toLabel(innohub__Workstream__c), innohub__Submitter_Detail__c FROM innohub__User_Voice__c ORDER BY CreatedDate DESC NULLS LAST LIMIT 1];
        return thisVoice;
    } 
    
    @AuraEnabled
    public static Activity__c getTheActivity(){
        //Checking the Activity__c Field Level Security
        String [] activityFields = new String [] {'Id', 
            'Name', 
            'innohub__Subject__c', 
            'innohub__Description__c', 
            'innohub__Type__c',
            'innohub__Step__c', 
            'innohub__BU__c', 
            'CreatedById', 
            'CreatedDate', 
            'innohub__Image__c', 
            'OwnerId'
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> activityMap = Schema.SObjectType.innohub__Activity__c.fields.getMap();
        
        for (String fieldToCheck : activityFields) {
            
            // Check if the user has access to view field
            if (!activityMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        Activity__c thisActivity = [SELECT Id, Name, innohub__Subject__c, innohub__Description__c, toLabel(innohub__Type__c), toLabel(innohub__BU__c), OwnerId, innohub__Image__c, CreatedById  FROM innohub__Activity__c  ORDER BY CreatedDate DESC NULLS LAST LIMIT 1];
        return thisActivity;
    }  
}