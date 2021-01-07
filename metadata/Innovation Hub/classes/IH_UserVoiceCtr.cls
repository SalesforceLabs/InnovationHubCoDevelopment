public with sharing class IH_UserVoiceCtr {
    
    /* Fitered Class */
    public class Filter{
        public String filterName{get;set;}
        public List<String> selectedFilters{get;set;}
    }
    
    /* Get Fitered User Voice */
    @AuraEnabled
    public static List<User_Voice__c> getUserVoices(String selectedFilter, String searchFiltersJSON) {
        system.debug('getUserVoices');
        system.debug('selectedFilter: ' + selectedFilter);
        system.debug('searchFiltersJSON: ' + searchFiltersJSON);
        
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
        
        List<User_Voice__c> theUserVoices = new List<User_Voice__c>();
        String selectClause = 'SELECT innohub__Detail__c, innohub__Headline__c,Id, innohub__Image__c,innohub__Introduction__c,Name,OwnerId, toLabel(innohub__Workstream__c), innohub__Submitter_Detail__c FROM innohub__User_Voice__c WHERE IsDeleted = false ';
        List<String> theType = new List<String>();
        List<String> theWorkstreams = new List<String>();
        String customClause='';
        List<filter> filterList  = (List<filter>)JSON.deserialize(searchFiltersJSON, List<filter>.class);
        system.debug('filterList: ' + filterList);
        
        system.debug(filterList[0].selectedFilters.size() + ': ' + filterList[0].selectedFilters);
        
        
        for(Integer i=0; i < filterList.size(); i++){
            if(filterList[i].filterName == 'Type'){
                theType.add(filterList[i].selectedFilters[0]);
            }
            else if(filterList[i].filterName == 'innohub__Workstream__c'){
                theWorkstreams = filterList[i].selectedFilters;
                
                if(theWorkstreams.size() != 0){
                    selectClause += 'AND toLabel(innohub__Workstream__c) INCLUDES ' + theWorkstreams;
                }
            }
            else{
                system.debug('WOOHOO IN ELSE');
                List<String> theCustomList = filterList[i].selectedFilters;
                system.debug('theCustomList: ' + theCustomList);
                
                if(theCustomList.size() != 0){
                    selectClause += 'AND toLabel(' + filterList[i].filterName + ') INCLUDES ' + theCustomList + ' ';
                    system.debug('selectClause: ' + selectClause);
                }
            }
        }
        
        if(theType.size() != 0){
            switch on theType[0] {
                when 'All' {
                    
                }
                
                when 'Recent' {
                    selectClause += ' ORDER BY CreatedDate DESC ';

                }
            }
        }
        
        selectClause += ' ORDER BY CreatedDate DESC ';
		System.debug('selectClause' + selectClause);
        try {
            theUserVoices = Database.query(selectClause);
        } catch (Exception e) {
            System.debug(e);
        }
        
        System.debug('theUserVoices' + theUserVoices);
        
        return theUserVoices;
    }
    
    @AuraEnabled
    public static User_Voice__c getUserVoice(String recordId){
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
        
        User_Voice__c thisVoice = [SELECT innohub__Detail__c, innohub__Headline__c,Id, innohub__Image__c, innohub__Introduction__c,Name,OwnerId, toLabel(innohub__Workstream__c), innohub__Submitter_Detail__c FROM innohub__User_Voice__c where Id = : recordID];
        return thisVoice;
    } 
    
    
       /* Get available picklist values for picklistAPIName*/
    @AuraEnabled
    public static List<String> getPicklistValues(String picklistAPIName) {
        system.debug('getPicklistValues ' + picklistAPIName);
        //Check Innovation_Idea__c
        String [] innIdeaFields = new String [] {'Id', 
            picklistAPIName
            };  
                // Obtain the field name/token map for the Innovation_Idea__c object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__User_Voice__c.fields.getMap();
        
        for (String fieldToCheck : innIdeaFields) {
            
            // Check if the user has access to view field
            if (!innIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        List<String> options = new List<String>();
        List<Schema.PicklistEntry> fieldResult = Schema.getGlobalDescribe().get('innohub__User_Voice__c').getDescribe().fields.getMap().get(picklistAPIName).getDescribe().getPicklistValues();
        
        for(Schema.PicklistEntry f : fieldResult) {
            options.add(f.getLabel());
        }
        return options;
    }
    
    
    /* Get available picklist labels*/
    
    @AuraEnabled
    public static String getPicklistLabel(String picklistAPIName) {
        system.debug('picklistAPIName for Label: ' + picklistAPIName);
        
        //Check Innovation_Idea__c
        String [] innIdeaFields = new String [] {'Id', 
            picklistAPIName
            };  
                // Obtain the field name/token map for the Innovation_Idea__c object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__User_Voice__c.fields.getMap();
        
        for (String fieldToCheck : innIdeaFields) {
            
            // Check if the user has access to view field
            if (!innIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        system.debug('Before Schema.getGlobalDescribe()');
        String theLabel = Schema.getGlobalDescribe().get('innohub__User_Voice__c').getDescribe().fields.getMap().get(picklistAPIName).getDescribe().getlabel();
        system.debug('After Schema.getGlobalDescribe(): ' + theLabel);
        return theLabel;
    }
    
    /*Get Creator*/
    
    @AuraEnabled
    public static User getCreator(String creatorId) {
        //Check user
        String [] userFields = new String [] {'Id', 
                'Name',
            	'SmallPhotoUrl'
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
        
        return [SELECT Id, Name, SmallPhotoUrl FROM User WHERE Id = :creatorId];
    }
}