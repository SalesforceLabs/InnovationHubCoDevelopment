public with sharing class IH_ArticleController {

    @AuraEnabled
    public static List<innohub__Event__c> getArticles(){
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
        
        
        List<innohub__Event__c> myCamps = [SELECT Id, Name, innohub__Agenda__c, innohub__Image__c, innohub__Start__c, innohub__End__c, innohub__Type__c, innohub__Location__c, CreatedById, innohub__Contact__c, innohub__Spaces_Available__c,innohub__Registration_Open__c, innohub__Venue__c From innohub__Event__c WHERE innohub__Active__c = true ORDER BY innohub__End__c DESC NULLS LAST LIMIT 3];
        return myCamps;
    }
}