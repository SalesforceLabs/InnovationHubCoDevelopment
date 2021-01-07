global with sharing class IH_HomepageController {
    
    @AuraEnabled
    global static Integer getMyIdeas(){
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
            'OwnerId', 
            'innohub__Approval_Status__c'
            };
                
                
                String customSettingField;
        
        List<innohub__Idea__c> customSetting = innohub__Idea__c.getall().values();
        if(customSetting.size() >= 1){
            if(customSetting[0].innohub__User_Idea_Owner_Field_API_Name__c != null){
                customSettingField = customSetting[0].innohub__User_Idea_Owner_Field_API_Name__c;
                if(!innIdeaFields.contains(customSetting[0].innohub__User_Idea_Owner_Field_API_Name__c)){
                    innIdeaFields.add(customSetting[0].innohub__User_Idea_Owner_Field_API_Name__c);
                }
            } 
        }
        
        
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
        
        //Check user
        String [] userFields = new String [] {'Id'
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
        
        //RecordType
        String [] recordTypeFields = new String [] {'Id', 'Name'
            };
                
                // Obtain the field name/token map for the RecordType object
                Map<String,Schema.SObjectField> recordTypeMap = Schema.SObjectType.RecordType.fields.getMap();
        
        for (String fieldToCheck : recordTypeFields) {
            
            // Check if the user has access to view field
            if (!recordTypeMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        String userId = userinfo.getuserid();
        Integer myIdeasCount = 0;
        if(customSettingField != null){
            return Database.countQuery('SELECT count() FROM innohub__Innovation_Idea__c WHERE ' +customSettingField+ ' = ' +'\''+userId+'\'');
        }else{
            myIdeasCount = [SELECT count() FROM innohub__Innovation_Idea__c WHERE OwnerId =: userId];
        }
        return myIdeasCount;
    }
    
    @AuraEnabled
    global static Integer getFavIdeas(){
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
        
        //Check user
        String [] userFields = new String [] {'Id'
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
        
        String userId = userinfo.getuserid();
        Integer favIdeas = [SELECT count() FROM innohub__Innovation_Idea_Vote__c WHERE CreatedById =: userId AND innohub__Vote_Type__c = true];
        return favIdeas;
    }
    
    @AuraEnabled
    global static Integer getFavDemos(){
        //Checking the innohub__Demo__c Field Level Security
        String [] demoFields = new String [] {'Id', 
            'Name', 
            'innohub__Image__c', 
            'innohub__Overview__c',
            'CreatedById',
            'CreatedDate',
            'OwnerId',
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
        
        //Check user
        String [] userFields = new String [] {'Id'
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
        
        String userId = userinfo.getuserid();
        Integer favDemos = [SELECT count() FROM innohub__Demo_Vote__c WHERE CreatedById =: userId AND innohub__Vote_Type__c = true];
        return favDemos;
    }
    
    @AuraEnabled
    global static Integer getMyEvents(User myUser){
        //Check innohub__Event_Member__c
        String [] innoEventMemberFields = new String [] {'Id',
            'innohub__Attending__c',
            'CreatedById',
            'innohub__Event__c',
            'Name',
            'LastModifiedById'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> innoEventMemberMap = Schema.SObjectType.innohub__Event_Member__c.fields.getMap();
        
        for (String fieldToCheck : innoEventMemberFields) {
            
            // Check if the user has access to view field
            if (!innoEventMemberMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        //Check user
        String [] userFields = new String [] {'Id'
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
        
        //Checking the innohub__Event__c Field Level Security
        String [] campFields = new String [] {'Id', 
            'Name', 
            'innohub__Agenda__c', 
            'innohub__Image__c', 
            'innohub__Start__c', 
            'innohub__End__c', 
            'innohub__Type__c', 
            'innohub__Location__c', 
            'CreatedById',
            'innohub__Contact__c',
            'innohub__Spaces_Available__c',
            'innohub__Registration_Open__c',
            'innohub__Venue__c'
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> campMap = Schema.SObjectType.innohub__Event__c.fields.getMap();
        
        for (String fieldToCheck : campFields) {
            
            // Check if the user has access to view field
            if (!campMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        User theUser = new User();
        if(myUser != null){
            theUser = myUser;
            system.debug('***** 2 *****');
        }
        else{
            theUser = [SELECT Id, Name FROM User WHERE Id = :UserInfo.getUserId()];
            system.debug('***** 3 *****');
        }
        
        List<innohub__Event__c> EventRegisteredTrue = new List<innohub__Event__c>();
        List<innohub__Event_Member__c> eventMembers = new List<innohub__Event_Member__c >();
        eventMembers = [SELECT Id, innohub__Event__c FROM innohub__Event_Member__c WHERE innohub__Attending__c = true AND CreatedById = :userinfo.getuserid()];
        innohub__Event__c thisEvent;
        Integer theCount=0;
        
        for (innohub__Event_Member__c myEventMember : eventMembers) {
            thisEvent = [SELECT Id, innohub__End__c FROM innohub__Event__c WHERE Id = :myEventMember.innohub__Event__c];
            EventRegisteredTrue.add(thisEvent);
        }
        
        for(Integer i=0; i < EventRegisteredTrue.size(); i++){
            datetime myDateTime = datetime.now();
            
            if(EventRegisteredTrue[i].innohub__End__c >= myDateTime){
                system.debug('FUTURE EVENT: ' + EventRegisteredTrue[i].innohub__End__c);
                theCount=theCount+1;
            }
        }
        return theCount;
    }
    
    @AuraEnabled
    global static User getUser(){
        //Check user
        String [] userFields = new String [] {'Id'
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
        
        User u = [select Id, username, ContactId, SmallPhotoUrl, FullPhotoUrl, MediumPhotoUrl, FirstName from User where Id = :UserInfo.getUserId()];
        return u;
    }
}