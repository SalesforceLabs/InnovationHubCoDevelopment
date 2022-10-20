public with sharing class listViewCtr {
    
    @AuraEnabled
    public static List<SObject> getList(Id theId, String queryObject, String relatedObject){
        //Ideas
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
        
        //demos
        String [] demoFields = new String [] {'Id', 
            'Name', 
            'innohub__Image__c', 
            'innohub__Overview__c',
            'CreatedById',
            'CreatedDate',
            'OwnerId',
            'innohub__Category__c',
            'innohub__Clouds_Involved__c',
            'innohub__Video_URL__c',
            'innohub__Video_Title__c'
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
        
        //events
        String [] eventFields = new String [] {'Id', 
            'Name',
            'innohub__Active__c',
            'innohub__Agenda__c',
            'innohub__Contact__c',
            'CreatedById',
            'innohub__Description__c',
            'innohub__End__c',
            'innohub__Image__c',
            'innohub__Location__c',
            'innohub__Registered_Attendees__c',
            'innohub__Registration_Open__c',
            'innohub__Spaces_Available__c',
            'innohub__Speaker__c',
            'innohub__Start__c',
            'innohub__Total_Spaces_Available__c',
            'innohub__Type__c',
            'innohub__Venue__c',
            'innohub__Video_File_Id__c',
            'innohub__Video_Title__c',
            'innohub__Video_URL__c'
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> eventMap = Schema.SObjectType.innohub__Event__c.fields.getMap();
        
        for (String fieldToCheck : eventFields) {
            
            // Check if the user has access to view field
            if (!eventMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        //activities
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
        
        //Innovation_Activity_Association__c
        String [] innActAssFields = new String [] {'Id', 
            'innohub__Activity__c',
            'CreatedById',
            'innohub__Innovation__c',
            'Name',
            'LastModifiedById'
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> innActAssMap = Schema.SObjectType.innohub__Innovation_Activity_Association__c.fields.getMap();
        
        for (String fieldToCheck : innActAssFields) {
            
            // Check if the user has access to view field
            if (!innActAssMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        //Innovation_Demo_Association__c
        String [] innDemoAssFields = new String [] {'Id', 
            'innohub__Demo__c',
            'CreatedById',
            'innohub__Innovation__c',
            'Name',
            'LastModifiedById'
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> innDemoAssMap = Schema.SObjectType.innohub__Innovation_Demo_Association__c.fields.getMap();
        
        for (String fieldToCheck : innDemoAssFields) {
            
            // Check if the user has access to view field
            if (!innDemoAssMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        //Idea_Event_Association__c
        String [] innEventAssFields = new String [] {'Id', 
            'innohub__Event__c',
            'CreatedById',
            'innohub__Idea__c',
            'Name',
            'LastModifiedById'
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> innEventAssMap = Schema.SObjectType.innohub__Idea_Event_Association__c.fields.getMap();
        
        for (String fieldToCheck : innEventAssFields) {
            
            // Check if the user has access to view field
            if (!innEventAssMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        //Demo_Activity_Association__c
        String [] demoActAssFields = new String [] {'Id', 
            'innohub__Activity__c',
            'CreatedById',
            'innohub__Demo__c',
            'Name',
            'LastModifiedById'
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> demoActAssMap = Schema.SObjectType.innohub__Demo_Activity_Association__c.fields.getMap();
        
        for (String fieldToCheck : demoActAssFields) {
            
            // Check if the user has access to view field
            if (!demoActAssMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        //Demo_Event_Association__c 
        String [] demoEventAssFields = new String [] {'Id', 
            'innohub__Event__c',
            'CreatedById',
            'innohub__Demo__c',
            'Name',
            'LastModifiedById'
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> demoEventAssMap = Schema.SObjectType.innohub__Event_Demo_Association__c.fields.getMap();
        
        for (String fieldToCheck : demoEventAssFields) {
            
            // Check if the user has access to view field
            if (!demoEventAssMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        system.debug('queryObject: ' + queryObject);
        system.debug('relatedObject: ' + relatedObject);
        
        String myQuery = 'SELECT Id, Name FROM ' + relatedObject + ' WHERE ' + queryObject + '.Id = :theId';
        system.debug('myQuery: ' + myQuery);
        List<sObject> myList = Database.query(myQuery);
        
        system.debug('myList: ' + myList);
        return myList;
    }
}