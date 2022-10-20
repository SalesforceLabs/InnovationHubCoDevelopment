public with sharing class IHvideoController {
    /* public with sharing class IHvideoController - was for app exchange version */
    
    
    @AuraEnabled
    static public sObject getVideo(String recordId){
        system.debug('getVideo');
        system.debug('recordId: ' + recordId);
        
        String sObjName = Id.valueOf(recordId).getSObjectType().getDescribe().getName();
        String query = 'SELECT Id, innohub__Video_Title__c, innohub__Video_URL__c, innohub__Video_File_Id__c  FROM '+ sObjName+' where Id = : recordId';
        system.debug('query: ' + query);
        sObject thisIdea = Database.query(query);
        system.debug('thisIdea: ' + thisIdea);
        return thisIdea;
    }
    
    @AuraEnabled
    static public sObject checkVideoExists(String videoId){
        system.debug('videoId: ' + videoId);
     	ContentDocument myContentDoc = [SELECT Id FROM ContentDocument WHERE Id = :videoId];
        system.debug('myContentDoc: ' + myContentDoc);
        
        return myContentDoc;
    }
   
}