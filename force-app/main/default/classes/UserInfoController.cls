public with sharing class UserInfoController {
    @AuraEnabled(cacheable=true)
    public static sObject getUserInfo(String objApiName, String userType, Id currentRecordId){
      
        String query = 'SELECT Id ';

        if(userType == 'Creator'){
            query += ', CreatedBy.Name, CreatedBy.SmallPhotoUrl, CreatedBy.MediumPhotoUrl';
            
        }
        else if(userType == 'Owner'){
            query += ', typeof Owner when user then Id, Name, SmallPhotoUrl, FullPhotoUrl, MediumPhotoUrl when Group then Id, Name, Type end';
           
        }
        //Customer__User__r
        else {
            String fieldApiName = userType.left(userType.length()-1);
            query += ' ,' + fieldApiName + 'c';
            query += ',' + userType +'.Name,' + + userType +  '.MediumPhotoUrl ';
            
        }
        query += ' FROM ' + objApiName + ' WHERE IsDeleted = false AND  Id =: currentRecordId';
        query +=' WITH SECURITY_ENFORCED';

        try {
            return Database.query(query);
        } catch(exception e) {
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        
      
    }
}
